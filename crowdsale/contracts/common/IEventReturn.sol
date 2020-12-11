pragma solidity ^0.4.24;

/**
 * @title IEventReturn
 * @dev This contract is to use event for checking other contracts are working well.
 */
contract IEventReturn {
        
    bool constant SUCCEED = true; 

    event fncReturnVAL(bool success);
}