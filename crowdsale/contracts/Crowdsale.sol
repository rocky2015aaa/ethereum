pragma solidity ^0.4.24;

import "./math/SafeMath.sol";
import "./lifecycle/Pausable.sol";
import "./fund/ICrowdsaleFund.sol";
import "./common/IEventReturn.sol";
import "./Token.sol";

contract Crowdsale is Pausable, IEventReturn {

    using SafeMath for uint256;

    uint256 public constant TOKEN_SALES_MAX = 350000000000000000000000000;

    uint256 public constant MAINSALES_OPEN_TIME =  1530374400; // Sun July 1st 00:00:00 SGT 2018 (not confirmed yet)
    uint256 public constant MAINSALES_CLOSE_TIME = 1533052800; // Web August 1st 00:00:00 SGT 2018 (not confirmed yet)

    uint256 public constant MAXIMUM_SALE_RATE = 14000;
    uint256 public constant MAINSALES_RATE = 10000;

    uint256 public constant SOFT_CAP = 5000 ether;  
    uint256 public constant HARD_CAP = 25000 ether;

    uint256 public constant MAINSALES_MIN_ETHER = 0.1 ether; // not confirmed yet
    
    ICrowdsaleFund public fund;

    int public salesCurrentTrials;       //0 - main

    struct PrivateSaleData {
        uint256 saleForMinEther;
        uint256 rate;
    }

    struct CrowdSaleInfo {
        uint256 minEtherCap; // 0.5 ether;
        uint256 openTime;
        uint256 closeTime;
        uint256 rate;
        string description;
    }

    CrowdSaleInfo[] inSalesInfoList;
    PrivateSaleData[] privateSaleDataList;

    uint256 refundCompleted;

    uint256 public soldTokensPrivateICO;
    uint256 public soldTokensMainICO;

    mapping(address => bool) public whiteList;
    mapping(address => uint256) public privateWhiteList;

    address public founderTokenWallet;
    address public advisorTokenWallet;
    address public bizDevelopTokenWallet;
    address public marketingTokenWallet;
    address public airdropTokenWallet;

    // The token being sold
    Token public token;

    // How many token units a buyer gets per wei
    uint256 public rate;

    // Amount of wei raised
    uint256 public weiRaised;

    /**
    * Event for token purchase logging
    * @param purchaser who paid for the tokens
    * @param beneficiary who got the tokens
    * @param value weis paid for purchase
    * @param amount amount of tokens purchased
    */
    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    uint256 public openingTime;
    uint256 public closingTime;

    /**
    * @dev Reverts if not in crowdsale time range.
    */
    modifier onlyWhileOpen {
        // solium-disable-next-line security/no-block-members  
        require(block.timestamp >= openingTime && block.timestamp <= closingTime);
        _;
    }

    /**
    * @dev Checks whether the period in which the crowdsale is open has already elapsed.
    * @return Whether crowdsale period has elapsed
    */
    function hasClosed() public view returns (bool) {
        // solium-disable-next-line security/no-block-members  
        return block.timestamp > closingTime;
    }

    bool public isFinalized = false;

    event Finalized();

    function Crowdsale(
        address _tokenAddress,
        address _fundAddress,
        address _founderTokenWallet,
        address _advisorTokenWallet,
        address _bizDevelopTokenWallet,
        address _marketingTokenWallet,
        address _airdropTokenWallet,
        address _owner
    ) public {
        require(_tokenAddress != address(0));
        require(_fundAddress != address(0));

        rate = MAINSALES_RATE;
     
        token = Token(_tokenAddress);
        fund = ICrowdsaleFund(_fundAddress);

        founderTokenWallet = _founderTokenWallet;
        advisorTokenWallet = _advisorTokenWallet;
        bizDevelopTokenWallet = _bizDevelopTokenWallet;
        marketingTokenWallet = _marketingTokenWallet;
        airdropTokenWallet = _airdropTokenWallet;

        owner = _owner;

        salesCurrentTrials = -1;

        CrowdSaleInfo memory saleInfoMain;

        saleInfoMain.openTime = MAINSALES_OPEN_TIME;
        saleInfoMain.closeTime = MAINSALES_CLOSE_TIME;
        saleInfoMain.rate = MAINSALES_RATE;
        saleInfoMain.minEtherCap = MAINSALES_MIN_ETHER;
        saleInfoMain.description = " Token Main Sales";

        inSalesInfoList.push(saleInfoMain);

        openingTime = MAINSALES_OPEN_TIME;
        closingTime = MAINSALES_CLOSE_TIME;

        soldTokensPrivateICO = 0;
        soldTokensMainICO = 0;

        paused = true;
    }

    // -----------------------------------------
    // Crowdsale external interface
    // -----------------------------------------

    /**
    * @dev fallback function ***DO NOT OVERRIDE***
    */
    function () external payable {
        buyTokens(msg.sender);
    }

    /**
    * @dev low level token purchase ***DO NOT OVERRIDE***
    * @param _beneficiary Address performing the token purchase
    */
    function buyTokens(address _beneficiary) public payable {

        uint256 weiAmount = msg.value;
        _preValidatePurchase(_beneficiary, weiAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(weiAmount);

        // update state
        weiRaised = weiRaised.add(weiAmount);

        _processPurchase(_beneficiary, tokens);
        emit TokenPurchase(
            msg.sender,
            _beneficiary,
            weiAmount,
            tokens
        );

        _updatePurchasingState(_beneficiary, weiAmount);

        _forwardFunds();
        _postValidatePurchase(_beneficiary, weiAmount);
    }

     // -----------------------------------------
    // Internal interface (extensible)
    // -----------------------------------------

    /**
    * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use super to concatenate validations.
    * @param _beneficiary Address performing the token purchase
    * @param _weiAmount Value in wei involved in the purchase
     */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal whenNotPaused isWhitelisted(_beneficiary) {
        require(salesCurrentTrials >= 0);
        require(_beneficiary != address(0));
        require(_weiAmount != 0);

        CrowdSaleInfo memory saleInfo = inSalesInfoList[uint(salesCurrentTrials)];
        require(_weiAmount >= saleInfo.minEtherCap);

        require(weiRaised.add(_weiAmount) <= HARD_CAP);
    }

    /**
    * @dev Validation of an executed purchase. Observe state and use revert statements to undo rollback when valid conditions are not met.
    * @param _beneficiary Address performing the token purchase
    * @param _weiAmount Value in wei involved in the purchase
    */
    function _postValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
      // optional override
    }

    /**
    * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends its tokens.
    * @param _beneficiary Address performing the token purchase
    * @param _tokenAmount Number of tokens to be emitted
    */
    function _deliverTokens(address _beneficiary, uint256 _tokenAmount) internal {
        token.transfer(_beneficiary, _tokenAmount);
    }

    /**
    * @dev Executed when a purchase has been validated and is ready to be executed. Not necessarily emits/sends tokens.
    * @param _beneficiary Address receiving the tokens
    * @param _tokenAmount Number of tokens to be purchased
    */
    function _processPurchase(address _beneficiary, uint256 _tokenAmount) internal {
        require(SafeMath.add(getTotalTokensSold(), _tokenAmount) <= TOKEN_SALES_MAX);

        token.issue(msg.sender, _tokenAmount);

        soldTokensMainICO = SafeMath.add(soldTokensMainICO, _tokenAmount);
    }

    /**
    * @dev Override for extensions that require an internal state to check for validity (current user contributions, etc.)
    * @param _beneficiary Address receiving the tokens
    * @param _weiAmount Value in wei involved in the purchase
    */
    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) internal {
      // optional override
    }

    /**
    * @dev Override to extend the way in which ether is converted to tokens.
    * @param _weiAmount Value in wei to be converted into tokens
    * @return Number of tokens that can be purchased with the specified _weiAmount
    */
    function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
        return _weiAmount.mul(rate);
    }

    /**
    * @dev Overrides Crowdsale fund forwarding, sending funds to vault.
    */
    function _forwardFunds() internal {
        //noting called. fund already forward _processPurchase
        fund.processContribution.value(msg.value)(msg.sender);
    }


   /**
   * @dev Reverts if beneficiary is not whitelisted. Can be used when extending this contract.
   */
    modifier isWhitelisted(address _beneficiary) {
        require(whiteList[_beneficiary]);
        _;
    }

    /**
    * @dev Reverts if beneficiary is not whitelisted for private sale. Can be used when extending this contract.
    */
    modifier isPrivateWhitelisted(address _wallet) {
        require(privateWhiteList[_wallet] > 0);
        _;
    }

    /**
     * @dev Set crowdsales information. sale duration, sale tokens rate, softcap etc..
     */
    function setSaleInfo(
        uint _salesTrials, 
        uint256 _openingTime, 
        uint256 _closingTime, 
        uint256 _rate, 
        uint256 _minETHCap, 
        string _desc) public whenPaused onlyOwner
    {
        CrowdSaleInfo storage saleInfo = inSalesInfoList[_salesTrials];

        saleInfo.openTime = _openingTime;
        saleInfo.closeTime = _closingTime;
        saleInfo.rate = _rate;
        saleInfo.minEtherCap = _minETHCap;
        saleInfo.description = _desc;

        if (int(_salesTrials) == salesCurrentTrials) {
            openingTime = saleInfo.openTime;
            closingTime = saleInfo.closeTime;
            rate = saleInfo.rate;
        }
        emit fncReturnVAL(SUCCEED);
    }

    /**
     * @dev Get current sales information.
     */
    function getSalesInfo(uint _salesTrials) public view returns (uint256, uint256, uint256, uint256, string) {
        require(_salesTrials >= 0);
        require(_salesTrials < inSalesInfoList.length);
        
        CrowdSaleInfo memory saleInfo = inSalesInfoList[_salesTrials];

        return (saleInfo.openTime, saleInfo.closeTime, saleInfo.rate, saleInfo.minEtherCap, saleInfo.description);
    }

    /**
     * @dev Activate crowdsale by assigining sale duration and rate
     */
    function startSales(uint _salesTrial) public onlyOwner {
        require(int(_salesTrial) >= salesCurrentTrials);

        CrowdSaleInfo memory saleInfo = inSalesInfoList[_salesTrial];

        require(0 < saleInfo.rate);
        require(now < saleInfo.closeTime);

        salesCurrentTrials = int(_salesTrial);

        openingTime = saleInfo.openTime;
        closingTime = saleInfo.closeTime;
        rate = saleInfo.rate;

        paused = false;

        emit fncReturnVAL(SUCCEED);
    }

    /**
     * @dev Add wallet to whitelist. For contract owner only.
     */
    function addToWhiteList(address _wallet) public onlyOwner {
        whiteList[_wallet] = true;
    }

    /**
    * @dev Adds list of addresses to whitelist. Not overloaded due to limitations with truffle testing.
    * @param _beneficiaries Addresses to be added to the whitelist
    */
    function addManyToWhitelist(address[] _beneficiaries) external onlyOwner {
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            whiteList[_beneficiaries[i]] = true;
        }
        emit fncReturnVAL(SUCCEED);
    }

    /**
    * @dev Removes single address from whitelist.
    * @param _beneficiary Address to be removed to the whitelist
    */
    function removeFromWhitelist(address _beneficiary) external onlyOwner {
        whiteList[_beneficiary] = false;
    }

    /**
     *@dev Check if wallet is registered in whitelist.
     */
    function isRegisteredWhiteList(address _beneficiary) external view returns (bool) {
        return whiteList[_beneficiary];
    }

    /**
     * @dev buy tokens who is registered in private wallet list with arbitrary rate for private sale
     * @param _beneficiary address to handle private sale
     */
    function buyTokensPrivate(address _beneficiary) external payable isPrivateWhitelisted(msg.sender) {
        require(_beneficiary != address(0));
        uint256 privateSaleDataListIndex = privateWhiteList[msg.sender].sub(1);
        require(msg.value >= privateSaleDataList[privateSaleDataListIndex].saleForMinEther);

        uint256 weiAmount = msg.value;

        // update state
        weiRaised = weiRaised.add(weiAmount);

        uint256 _tokenAmount = weiAmount.mul(privateSaleDataList[privateSaleDataListIndex].rate);

        require(getTotalTokensSold().add(_tokenAmount) <= TOKEN_SALES_MAX);

        token.issue(_beneficiary, _tokenAmount);
        fund.processContribution.value(msg.value)(_beneficiary);
        soldTokensPrivateICO = SafeMath.add(soldTokensPrivateICO, _tokenAmount);

        whiteList[_beneficiary] = true;

        emit fncReturnVAL(SUCCEED);
    }

    /**
     * @dev buy tokens who is registered in private wallet list with given rate for private sale 
     * @param _beneficiary address to handle private sale
     * @param _rate mcc token rate 
     */
    function buyTokensPrivate2VIP(address _beneficiary, uint256 _rate) external payable isPrivateWhitelisted(msg.sender) {
        require(_beneficiary != address(0));
        uint256 privateSaleDataListIndex = privateWhiteList[msg.sender].sub(1);
        require(msg.value >= privateSaleDataList[privateSaleDataListIndex].saleForMinEther);

        uint256 weiAmount = msg.value;

        // update state
        weiRaised = weiRaised.add(weiAmount);

        uint256 _tokenAmount = weiAmount.mul(_rate);

        require(getTotalTokensSold().add(_tokenAmount) <= TOKEN_SALES_MAX);

        token.issue(_beneficiary, _tokenAmount);
        fund.processContribution.value(msg.value)(_beneficiary);
        soldTokensPrivateICO = SafeMath.add(soldTokensPrivateICO, _tokenAmount);

        whiteList[_beneficiary] = true;

        emit fncReturnVAL(SUCCEED);
    }

    /**
     * @dev Add wallet to private whitelist with minimum purchase amount and rate. For contract owner only.
     * minimum purchase amount(uint256 min) must be wei
     */
    function addToPrivateWhiteList(address _payer, uint256 _min, uint256 _rate) public onlyOwner {
        require(MAINSALES_RATE <= _rate && _rate <= MAXIMUM_SALE_RATE);

        if (privateWhiteList[_payer] > 0) {
            uint256 privateSaleDataListIndex = privateWhiteList[_payer].sub(1);
            privateSaleDataList[privateSaleDataListIndex].saleForMinEther = _min;
            privateSaleDataList[privateSaleDataListIndex].rate = _rate;
        } else {
            PrivateSaleData memory privateSaleData;

            privateSaleData.saleForMinEther = _min;
            privateSaleData.rate = _rate;

            privateSaleDataList.push(privateSaleData);

            privateWhiteList[_payer] = privateSaleDataList.length;
        }
    }

    function getPrivateSaleRate(address _payer) external view returns (uint256) {
        if (privateWhiteList[_payer] > 0) {
            return privateSaleDataList[privateWhiteList[_payer].sub(1)].rate;
        }
        return 0;
    }

    function getPrivateSaleMinumum(address _payer) external view returns (uint256) {
        if (privateWhiteList[_payer] > 0) {
            return privateSaleDataList[privateWhiteList[_payer].sub(1)].saleForMinEther;
        }
        return 0;
    }

    function resetTokenWallets(        
        address _founderTokenWallet,
        address _advisorTokenWallet,
        address _bizDevelopTokenWallet,
        address _marketingTokenWallet,
        address _airdropTokenWallet) public onlyOwner {
        founderTokenWallet = _founderTokenWallet;
        advisorTokenWallet = _advisorTokenWallet;
        bizDevelopTokenWallet = _bizDevelopTokenWallet;
        marketingTokenWallet = _marketingTokenWallet;
        airdropTokenWallet = _airdropTokenWallet;
    }
    
  /**
   * @dev Checks whether the cap has been reached.
   * @return boolean value determines Whether the cap was reached
   */
    function capReached() public view returns (bool) {
        return weiRaised >= SOFT_CAP;
    }

    
    /**
     * @dev return total number of tokens sold
    */
    function getTotalTokensSold() internal view returns (uint256) {
        return soldTokensPrivateICO.add(soldTokensMainICO);
    }

    /**
     * @dev return the number of remaining tokens
    */
    function getRemainTokensToSell() external view returns (uint256) {
        return TOKEN_SALES_MAX.sub(getTotalTokensSold());
    }

    /**
    * @dev Must be called after crowdsale ends, to do some extra finalization
    * work. Calls the contract's finalization function.
    */
    function salesFinalize() onlyOwner public {
        require(!isFinalized);
        require(hasClosed());

        if (capReached()) {

            uint totalToken = token.totalSupply();
           
            token.issue(founderTokenWallet, SafeMath.div(SafeMath.mul(totalToken, 23), 100));
            token.issue(advisorTokenWallet, SafeMath.div(SafeMath.mul(totalToken, 5), 100));
            token.issue(bizDevelopTokenWallet, SafeMath.div(SafeMath.mul(totalToken, 5), 100));
            token.issue(marketingTokenWallet, SafeMath.div(SafeMath.mul(totalToken, 9), 100));
            token.issue(airdropTokenWallet, SafeMath.div(SafeMath.mul(totalToken, 23), 100));

            // unsold tokens will be burned
            token.burn(token.balanceOf(this));

            fund.onCrowdsaleEnd();
            token.setAllowTransfers(true);

        } else {
            fund.enableCrowdsaleRefund();
        }
        token.finishIssuance();

        emit Finalized();

        isFinalized = true;
    }
}
