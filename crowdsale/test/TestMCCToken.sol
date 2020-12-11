pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Token.sol";
import "../contracts/TokenSale.sol";

contract TestToken {

    function testInitialBalanceUsingDeployedContract() public {
        Token mcc = Token(DeployedAddresses.Token());
        
        uint expected = 1000000000000000000000000000;

        Assert.equal(mcc.balanceOf(DeployedAddresses.TokenSale()), expected, "Owner should have 1000000000000000000000000000 MetaCoin initially");
    }
}
