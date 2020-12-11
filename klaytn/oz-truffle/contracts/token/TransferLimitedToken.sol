// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.6.0;

import "./ManagedToken.sol";

/**
 * @title TransferLimitedToken
 * @dev Token with ability to limit transfers within wallets included in limitedWallets list for certain period of time
 */
contract TransferLimitedToken is ManagedToken {
    uint8 public constant LIMITED_NONE = 0;
    uint8 public constant LIMITED_SENDER = 1;
    uint8 public constant LIMITED_RECEIVER = 2;
    uint8 public constant LIMITED_ALL = 3;

    mapping(address => bool) public limitedSenderWallets;
    mapping(address => bool) public limitedReceiverWallets; // TODO: how to get keys(addesses) only without other logic?

    /**
     * @dev Check if transfer between addresses is available
     * @param _from From address
     * @param _to To address
     */
    modifier canTransfer(address _from, address _to)  {
        require((!limitedSenderWallets[_from] && !limitedReceiverWallets[_to]), "One or both addresses are limited for transfering");
        _;
    }

    /**
     * @dev TransferLimitedToken constructor
     * @param _owner Owner
     */
    function initialize(string memory _name, string memory _symbol, uint8 _decimals, address _owner) initializer public
    {
        ManagedToken.initialize(_name, _symbol, _decimals, _owner);
    }

    /**
     * @dev Add address to limitedWallets
     * @dev Can be called only by owner
     */
    function setLimitedWalletAddress(address _wallet, uint8 targetStatus, bool registration) public onlyOwner {
        require(LIMITED_SENDER <= targetStatus && LIMITED_ALL >= targetStatus);
        if (targetStatus >= LIMITED_RECEIVER) {
            limitedReceiverWallets[_wallet] = registration;
            targetStatus -= LIMITED_RECEIVER;
        }
        if (targetStatus == LIMITED_SENDER) {
            limitedSenderWallets[_wallet] = registration;
        }
    }

    function isLimitedWalletAddress(address _wallet) public view returns(uint8) {
        uint8 targetStatus = LIMITED_NONE;
        if (limitedSenderWallets[_wallet]) {
            targetStatus += LIMITED_SENDER;
        }
        if (limitedReceiverWallets[_wallet]) {
            targetStatus += LIMITED_RECEIVER;
        }
        return targetStatus;
    }

    /**
     * @dev Override transfer function. Add canTransfer modifier to check possibility of transferring
     */
    function transfer(address _to, uint256 _value) public canTransfer(msg.sender, _to) returns (bool) {
        return super.transfer(_to, _value);
    }

    /**
     * @dev Override transferFrom function. Add canTransfer modifier to check possibility of transferring
     */
    function transferFrom(address _from, address _to, uint256 _value) public canTransfer(_from, _to) returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }

    /**
     * @dev Override approve function. Add canTransfer modifier to check possibility of transferring
     */
    function approve(address _spender, uint256 _value) public canTransfer(msg.sender, _spender) returns (bool) {
        return super.approve(_spender,_value);
    }
}
