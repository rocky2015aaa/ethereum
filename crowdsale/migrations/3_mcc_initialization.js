var config = require("../config/config_" + process.env.CURRENT_SERVER + ".json"),
    MCCFund = artifacts.require("MCCFund"),
    MCCToken = artifacts.require("MCCToken"),
    MCCCrowdsale = artifacts.require("MCCCrowdsale");

require('log-timestamp');

var mccToken, mccCrowdsale, mccFund;
module.exports = function (deployer) {
    deployer.then(function () {
        return MCCToken.deployed()
    })
        .then(function (instance) {
            mccToken = instance;
            return MCCCrowdsale.deployed();
        })
        .then(function (instance) {
            mccCrowdsale = instance;
            return MCCFund.deployed();
        }).then(function (instance) {
            mccFund = instance;
            mccFund.setTokenAddress(mccToken.address);
            return mccToken.balanceOf(mccToken.constructor.class_defaults.from);
        }).then(function (result) {
            console.log(result);
            return mccToken.issue(mccCrowdsale.address, result);
        }).then(function (result) {
            console.log(result);
            tokenOwnerWhenSales = [
                config.ethereum_client.deployer,
                mccCrowdsale.address,
                mccFund.address,
            ];
            return mccToken.setOwners(tokenOwnerWhenSales);
        })
        .then(function (result) {
            mccFund.setCrowdsaleAddress(mccCrowdsale.address);
        });
};