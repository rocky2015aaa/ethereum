pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TokenSale.sol";

contract TestTokenSale {

    function testGetGoalUsingDeployedContract() public {
        TokenSale mccTokenSale = TokenSale(DeployedAddresses.TokenSale());
        
        Assert.isAbove(mccTokenSale.getGoal(), 0, "goal should be bigger than 0");
    }

    function testGetHardcapUsingDeployedContract() public {
        TokenSale mccTokenSale = TokenSale(DeployedAddresses.TokenSale());
        
        Assert.isAbove(mccTokenSale.getHardcap(), 0, "hardcap should be bigger than 0");
    }

    function testGetRateUsingDeployedContract() public {
        TokenSale mccTokenSale = TokenSale(DeployedAddresses.TokenSale());
        
        Assert.isAbove(mccTokenSale.getRate(), 0, "rate should be bigger than 0");
    }
}
