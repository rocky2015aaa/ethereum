pragma solidity ^0.4.24;

/**
 * @title ICrowdsaleFund
 * @dev Fund methods used by crowdsale contract
 */
interface ICrowdsaleFund {
    /**
    * @dev Function accepts user`s contributed ether and logs contribution
    * @param _from Contributor wallet address.
    */
    function processContribution(address _from) external payable;
    /**
    * @dev Function is called on the end of successful crowdsale
    */
    function onCrowdsaleEnd() public;
    /**
    * @dev Function is called if crowdsale failed to reach soft cap
    */
    function enableCrowdsaleRefund() external;

}
