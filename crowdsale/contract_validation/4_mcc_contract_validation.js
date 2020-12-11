var config = require("../config/config_" + process.env.CURRENT_SERVER + ".json"),
    Fund = artifacts.require("Fund"),
    RefundRecursiveCall = artifacts.require("RefundRecursiveCall");

module.exports = function (deployer) {
    deployer.deploy(RefundRecursiveCall, "");
};
