var config = require("../../../config/config_" + process.env.CURRENT_SERVER + ".json"),
    constants = require("../../constants"),
    contract = require("../contracts"),
    rsa = require("../../../rsa/rsa"),
    variables = require("../../variables"),

    mToken = contract.mToken,
    web3 = contract.web3,

    deployerPasswd = rsa.decryptStringWithRsaPrivateKey(config.ethereum_client.deployer_password, constants.RSA_PRIVATE_KEY_URL);

require('log-timestamp');

module.exports = {
    wallet: function (req, res) {
        mToken.deployed().then(function (instance) {
            return res.send(instance.address);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    owner: function (req, res) {
        mToken.deployed().then(function (instance) {
            return instance.getOwners();
        }).then(function (result) {
            console.log("mToken / getOwners :\n" + result + "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    manager: function (req, res) {
        mToken.deployed().then(function (instance) {
            return instance.manager.call();
        }).then(function (result) {
            console.log("mToken / manager.call :\n" + result + "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    canissue: function (req, res) {
        mToken.deployed().then(function (instance) {
            return instance.issuanceFinished.call();
        }).then(function (result) {
            console.log("mToken / issuanceFinished.call :\n" + result + "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    addLimitedWallet: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mToken.deployed().then(function (instance) {
                console.log(req.body.wallet);
                return instance.addLimitedWalletAddress(req.body.wallet, { from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mToken / addLimitedWalletAddress :\n" + JSON.stringify(result, null, 2) + "\n\n");
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
    removeLimitedWallet: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mToken.deployed().then(function (instance) {
                console.log(req.body.wallet);
                return instance.delLimitedWalletAddress(req.body.wallet, { from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mToken / delLimitedWalletAddress :\n" + JSON.stringify(result, null, 2) + "\n\n");
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
    islimited: function (req, res) {
        mToken.deployed().then(function (instance) {
            return instance.isLimitEnabled.call();
        }).then(function (result) {
            console.log("mToken / isLimitEnabled.call :\n" + result + "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    isLimitedWallet: function (req, res) {
        mToken.deployed().then(function (instance) {
            return instance.isLimitedWalletAddress(req.query.wallet);
        }).then(function (result) {
            console.log("mToken / isLimitedWalletAddress :\n" + result + "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
        });
    },
    disablelimit: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mToken.deployed().then(function (instance) {
                console.log(req.session.walletAddress);
                return instance.disableLimit({ from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mToken / disableLimit :\n" + JSON.stringify(result, null, 2) + "\n\n");
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
    mTokenAmount: function (req, res) {
        mToken.deployed().then(function (instance) {
            console.log(req.query.walletAddress);
            return instance.balanceOf(req.query.walletAddress);
        }).then(function (result) {
            console.log("mToken / balanceOf :\n" + web3.utils.fromWei(result.toString(16)) + "\n\n");
            res.setHeader('Content-Type', 'application/json');
            return res.send(web3.utils.fromWei(result.toString(16)));
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
} 
