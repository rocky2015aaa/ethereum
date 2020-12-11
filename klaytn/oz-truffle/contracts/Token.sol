// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.6.0;

import "./token/TransferLimitedToken.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

contract Token is TransferLimitedToken {
    // =================================================================================================================
    //                                         Members
    // =================================================================================================================
    using SafeMath for uint256;

    address private _tokenManager;
    address private _seedPublisher;
    mapping(address => bool) public multiTransferSenderWallets;

    event SetOwner(address indexed owner);
    event SetSeedPublisher(address indexed _seedPublisher);
    event Burn(address indexed burner, uint256 value);

    modifier onlyManager() {
        require(msg.sender == _tokenManager, "msg.sender is not token manager");
        _;
    }
    modifier onlySeedPublisher() {
        require(msg.sender == _seedPublisher, "msg.sender is not seed publisher");
        _;
    }
    modifier canMultiTransfer(address _sender)  {
        require(multiTransferSenderWallets[_sender], "the sender address is not on multiTransferSenderWallets");
        require(!limitedSenderWallets[_sender], "the sender address is limited");
        _;
    }

    // =================================================================================================================
    //                                         Constructor
    // =================================================================================================================

    /**
     * @dev  Token
     */
    function initialize(uint256 initialSupply, string memory _name, string memory _symbol, uint8 _decimals, address _exchangeMaster, address _owner, address _manager) initializer public
    {
        TransferLimitedToken.initialize(_name, _symbol, _decimals, _owner);
        _tokenManager = _manager;
		_mint(_exchangeMaster, initialSupply.mul(10 ** uint256(_decimals)));
    }

    function () external payable {}
    
    function goodmorn(uint256 refKey, uint256 from, uint256 to, uint8 seed, string calldata penalty) onlySeedPublisher external payable {}
    
    function refund() external onlyOwner {
        _transfer(address(this), msg.sender, address(this).balance);
    }
    
    /**
     * @dev set token owner who can set token limitation
     * @param _owner token owner
     */
    function setOwner(address _owner) external onlyManager {
        _transferOwnership(_owner);
        emit SetOwner(_owner);
    }
    
    function manager() public view returns (address) {
        return _tokenManager;
    }
    
    /**
     * @dev set seed publisher who can set seed publisher
     * @param _publisher seed publisher
     */
    function setSeedPublisher(address _publisher) external onlyOwner {
        _seedPublisher = _publisher;
        emit SetSeedPublisher(_publisher);
    }

    function seedPublisher() public view returns (address) {
        return _seedPublisher;
    }
    
    function setMultiTransferSenderWalletAddress(address _wallet, bool approval) public onlyOwner {
        multiTransferSenderWallets[_wallet] = approval;
    }

    function isMultiTransferSenderWalletAddress(address _wallet) public view returns(bool) {
        return multiTransferSenderWallets[_wallet];
    }

    /**
     * @dev transferMulti
     * @param _targets token receiver list
     * @param _values token amount to send
     */
    function transferMulti(address[] calldata _targets, uint256[] calldata _values) external transfersAllowed canMultiTransfer(msg.sender) {
        uint256 totalValues = 0;
        for ( uint i = 0 ; i < _targets.length ; i++ ) {
           require(!limitedReceiverWallets[_targets[i]], "the receiver address is limited");
           totalValues = totalValues.add(_values[i]);
           require(balanceOf(msg.sender) >= totalValues, "the sender doesn't have enough balance");
        }

        for( uint i = 0 ; i < _targets.length ; i++ ) {
		    transfer(_targets[i], _values[i]);
        }
     }
}
