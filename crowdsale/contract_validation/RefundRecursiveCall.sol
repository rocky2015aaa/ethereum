pragma solidity ^0.4.21;

import "./MCCFund.sol";

contract RefundRecursiveCall {
    MCCFund fund;
    
    function () external payable {
        //fund.refundCrowdsaleContributor();
    }

    function RefundRecursiveCall(address mccFundAddress) public {
        fund = MCCFund(mccFundAddress);
    }

    function receiveEth() external payable {}

    function refund() external {
        fund.refundCrowdsaleContributor();
    }
}