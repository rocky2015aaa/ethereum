var config = require("../../../../config/config_" + process.env.CURRENT_SERVER + ".json"),
    constants = require("../../../constants"),
    contract = require("../../contracts"),
    rsa = require("../../../../rsa/rsa"),
    variables = require("../../../variables"),

    mCrowdsale = contract.mCrowdsale,
    web3 = contract.web3,

    deployerPasswd = rsa.decryptStringWithRsaPrivateKey(config.ethereum_client.deployer_password, constants.RSA_PRIVATE_KEY_URL);

require('log-timestamp');

module.exports = {
    checkIfInWhitelist: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.isRegisteredWhiteList(req.query.walletAddress);
        }).then(function (result) {
            console.log("mCrowdsale / isRegisteredWhiteList :\n" + JSON.stringify(result, null, 2) + "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    addToWhitelist: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mCrowdsale.deployed().then(function (instance) {
                console.log(req.body);
                return instance.addToWhiteList(req.body.target, { from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mCrowdsale / addToWhiteList :\n" + JSON.stringify(result, null, 2) + "\n\n");
                web3.eth.personal.lockAccount(req.session.walletAddress, deployerPasswd).then((response) => {
                    console.log("web3.eth.personal / lockAccount :\n" + response + "\n\n");
                    return res.sendStatus(202);
                }).catch((error) => {
                    console.log(error);
                    return res.sendStatus(500);
                });
            }).catch(function (err) {
                console.log(err);
                web3.eth.personal.lockAccount(req.session.walletAddress, deployerPasswd).then((response) => {
                    console.log("web3.eth.personal / lockAccount :\n" + response + "\n\n");
                    return res.sendStatus(400);
                }).catch((error) => {
                    console.log(error);
                    return res.sendStatus(500);
                });
            });
        }).catch((error) => {
            console.log(error);
            return res.sendStatus(401);
        });
    },
    addManyToWhitelist: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mCrowdsale.deployed().then(function (instance) {
                return instance.addManyToWhitelist(req.body.list, { from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mCrowdsale / addManyToWhitelist :\n" + JSON.stringify(result, null, 2) + "\n");
                for (var i = 0; i < result.logs.length; i++) {
                    var log = result.logs[i];
    
                    if (log.event == "fncReturnVAL") {
                        console.log(JSON.stringify(log.args) + "\n\n");
                        break;
                    }
                }
                web3.eth.personal.lockAccount(req.session.walletAddress, deployerPasswd).then((response) => {
                    console.log("web3.eth.personal / lockAccount :\n" + response + "\n\n");
                    return res.sendStatus(202);
                }).catch((error) => {
                    console.log(error);
                    return res.sendStatus(500);
                });
            }).catch(function (err) {
                console.log(err);
                web3.eth.personal.lockAccount(req.session.walletAddress, deployerPasswd).then((response) => {
                    console.log("web3.eth.personal / lockAccount :\n" + response + "\n\n");
                    return res.sendStatus(400);
                }).catch((error) => {
                    console.log(error);
                    return res.sendStatus(500);
                });
            });
        }).catch((error) => {
            console.log(error);
            return res.sendStatus(401);
        });
    },
    removeFromWhitelist: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mCrowdsale.deployed().then(function (instance) {
                return instance.removeFromWhitelist(req.body.target, { from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mCrowdsale / removeFromWhitelist :\n" + JSON.stringify(result, null, 2) + "\n\n");
                web3.eth.personal.lockAccount(req.session.walletAddress, deployerPasswd).then((response) => {
                    console.log("web3.eth.personal / lockAccount :\n" + response + "\n\n");
                    return res.sendStatus(202);
                }).catch((error) => {
                    console.log(error);
                    return res.sendStatus(500);
                });
            }).catch(function (err) {
                console.log(err);
                web3.eth.personal.lockAccount(req.session.walletAddress, deployerPasswd).then((response) => {
                    console.log("web3.eth.personal / lockAccount :\n" + response + "\n\n");
                    return res.sendStatus(400);
                }).catch((error) => {
                    console.log(error);
                    return res.sendStatus(500);
                });
            });
        }).catch((error) => {
            console.log(error);
            return res.sendStatus(401);
        });
    },
}
