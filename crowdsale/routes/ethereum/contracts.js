var contract = require("truffle-contract"),
    Web3 = require('web3'),
    constants = require("../constants"),
    mccTokenJSON = require('../../build/contracts/MCCToken.json'),
    MCCCrowdsaleJSON = require('../../build/contracts/MCCCrowdsale.json'),
    mccFundJSON = require('../../build/contracts/MCCFund.json');

var provider = new Web3.providers.HttpProvider(constants.PROVIDER_URL);

mccFund = contract(mccFundJSON);
mccFund.setProvider(provider);
if (typeof mccFund.currentProvider.sendAsync !== "function") {
    mccFund.currentProvider.sendAsync = function () { return mccFund.currentProvider.send.apply(mccFund.currentProvider, arguments) };
}

mccToken = contract(mccTokenJSON);
mccToken.setProvider(provider);
if (typeof mccToken.currentProvider.sendAsync !== "function") {
    mccToken.currentProvider.sendAsync = function () { return mccToken.currentProvider.send.apply(mccToken.currentProvider, arguments) };
}

mccCrowdsale = contract(MCCCrowdsaleJSON);
mccCrowdsale.setProvider(provider);
if (typeof mccCrowdsale.currentProvider.sendAsync !== "function") {
    mccCrowdsale.currentProvider.sendAsync = function () { return mccCrowdsale.currentProvider.send.apply(mccCrowdsale.currentProvider, arguments) };
}

module.exports = {
    web3: new Web3(provider),
    mccFund: mccFund,
    mccToken: mccToken,
    mccCrowdsale: mccCrowdsale,
}