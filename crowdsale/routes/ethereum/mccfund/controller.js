var config = require("../../../config/config_" + process.env.CURRENT_SERVER + ".json"),
    constants = require("../../constants"),
    contract = require("../contracts"),
    rsa = require("../../../rsa/rsa"),
    variables = require("../../variables"),

    mFund = contract.mFund,
    web3 = contract.web3,

    deployerPasswd = rsa.decryptStringWithRsaPrivateKey(config.ethereum_client.deployer_password, constants.RSA_PRIVATE_KEY_URL);

require('log-timestamp');

module.exports = {
    wallet: function (req, res) {
        mFund.deployed().then(function (instance) {
            return res.send(instance.address);
        });
    },
    owner: function (req, res) {
        mFund.deployed().then(function (instance) {
            return instance.getOwners();
        }).then(function (result) {
            console.log("mFund / getOwners :\n" + result + "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });

    },
    token: function (req, res) {
        mFund.deployed().then(function (instance) {
            return instance.token.call();
        }).then(function (result) {
            console.log("mFund / token.call :\n" + result + "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });

    },
    state: function (req, res) {
        mFund.deployed().then(function (instance) {
            return instance.state.call();
        }).then(function (result) {
            console.log("mFund / state.call :\n" + result + "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
}    
