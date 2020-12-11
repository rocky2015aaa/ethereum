const https = require('https');

var config = require("../../../config/config_" + process.env.CURRENT_SERVER + ".json"),
    constants = require("../../constants"),
    contract = require("../contracts"),
    rsa = require("../../../rsa/rsa"),
    variables = require("../../variables"),

    mCrowdsale = contract.mCrowdsale,
    web3 = contract.web3,

    deployerPasswd = rsa.decryptStringWithRsaPrivateKey(config.ethereum_client.deployer_password, constants.RSA_PRIVATE_KEY_URL);

require('log-timestamp');

module.exports = {
    wallets: function (req, res) {
        var list = [];
        var keys = Object.keys(config.wallet_address);
        for (var i = 0; i < keys.length; i++) {
            var row = [];
            console.log(keys[i], config.wallet_address[keys[i]]);
            row.push(keys[i]);
            row.push(config.wallet_address[keys[i]]);
            list.push(row);
        }

        keys = Object.keys(config.private_wallet_address);
        for (var i = 0; i < keys.length; i++) {
            var row = [];
            console.log(keys[i], config.private_wallet_address[keys[i]]);
            row.push(keys[i]);
            row.push(config.private_wallet_address[keys[i]]);
            list.push(row);
        }
        console.log("\n\n");
        res.status(200);
        res.send(list);
    },
    checkTransactionGasInformation: function (req, res) {
        var body = JSON.stringify({
            gasPrice: variables.GAS_PRICE,
            gasLimit: variables.GAS_LIMIT
        })
        return res.send(body);
    },
    setTransactionGasPrice: function (req, res) {
        variables.GAS_PRICE = req.body.price;
        return res.sendStatus(202);
    },
    setTransactionGasLimit: function (req, res) {
        variables.GAS_LIMIT = req.body.limit;
        return res.sendStatus(202);
    },
}
