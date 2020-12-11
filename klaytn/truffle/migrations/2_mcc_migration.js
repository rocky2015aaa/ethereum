//var config = require("../config/config_" + process.env.CURRENT_SERVER + ".json"),
var config = require("../config/config_development.json"),
    MCCToken = artifacts.require("MCCToken");

module.exports = function (deployer) {
    const EXCHANGE_MASTER_WALLET = config.ethereum_client.exchange_master;
    const TOKEN_MANAGER = config.ethereum_client.manager;
    const OWNER_WALLET = config.owner_wallet_address.payment;

    deployer.deploy(MCCToken, 10000000000, "MyCreditChain", "MCC", 18, EXCHANGE_MASTER_WALLET, OWNER_WALLET, TOKEN_MANAGER);
}; 
