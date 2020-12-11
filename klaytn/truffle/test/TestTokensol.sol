pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Token.sol";

contract TestTokenSol {
    Token m = Token(DeployedAddresses.Token());
    uint public initialBalance = 2 wei;

    function testInitialBalanceUsingDeployedContract() public {
        uint expected = 10000000000000000000000000000;
        address expectedAddress = 0x78A44FCDb80c24cBA85776B1C66B389Ef388BD69;

        Assert.equal(tx.origin, expectedAddress, "Origin address is different");
        Assert.equal(m.balanceOf(0xdA18FaFfD93Bf6F85C442BCafEA02e5DBC877C6B), expected, "Deployer should have 1000000000 Token initially");
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
