pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Token.sol";

contract TestTokenSol {
    Token m = Token(DeployedAddresses.Token());
    uint public initialBalance = 2 wei;

    function testInitialBalanceUsingDeployedContract() public {
        uint expected = 10000000000000000000000000000;
        address expectedAddress = 0x1C9C1939fac8bA2EfDfa64495c4EAcb695751277;

        Assert.equal(tx.origin, expectedAddress, "Origin address is different");
        Assert.equal(m.balanceOf(0xf0402B5396dEFcBeBA4545854747d05DF47a3605), expected, "Deployer should have 1000000000 Token initially");
    }

    function testTokenSpecification() public {
        string memory expectedName = "M";
        string memory expectedSymbol = "";
        uint expectedDecimals = 18;

        Assert.equal(m.name(), expectedName, "Token name is different");
        Assert.equal(m.symbol(), expectedSymbol, "Token symbol is different");
        Assert.equal(m.decimals(), expectedDecimals, "Token decimals is different");
    }

    function testFallback() external payable {
        Assert.equal(address(m).balance, 0, "contract init balance should have 0");
        address(m).transfer(1);
        Assert.equal(address(m).balance, 1, "contract balance should have 1");
    }
}
