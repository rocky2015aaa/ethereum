const moment = require('moment-timezone');

var config = require("../../../../config/config_" + process.env.CURRENT_SERVER + ".json"),
    constants = require("../../../constants"),
    contract = require("../../contracts"),
    rsa = require("../../../../rsa/rsa"),
    variables = require("../../../variables"),

    mCrowdsale = contract.mCrowdsale,
    mFund = contract.mFund,
    web3 = contract.web3,

    deployerPasswd = rsa.decryptStringWithRsaPrivateKey(config.ethereum_client.deployer_password, constants.RSA_PRIVATE_KEY_URL);

require('log-timestamp');

module.exports = {
    pauseCrowdSale: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mCrowdsale.deployed().then(function (instance) {
                return instance.pause({ from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mCrowdsale / pause :\n" + JSON.stringify(result, null, 2) + "\n");
                for (var i = 0; i < result.logs.length; i++) {
                    var log = result.logs[i];
    
                    if (log.event == "Pause") {
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
    unpauseCrowdSale: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mCrowdsale.deployed().then(function (instance) {
                return instance.unpause({ from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mCrowdsale / unpause :\n" + JSON.stringify(result, null, 2) + "\n");
                for (var i = 0; i < result.logs.length; i++) {
                    var log = result.logs[i];
    
                    if (log.event == "Unpause") {
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
    finalizeCrowdSale: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mCrowdsale.deployed().then(function (instance) {
                return instance.finalize({ from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mCrowdsale / finalize :\n" + JSON.stringify(result, null, 2) + "\n");
                for (var i = 0; i < result.logs.length; i++) {
                    var log = result.logs[i];
    
                    if (log.event == "Finalized") {
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
    startCrowdSaleTrial: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mCrowdsale.deployed().then(function (instance) {
                console.log(req.body.trial, req.session.walletAddress);
                return instance.startSales(parseInt(req.body.trial), { from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mCrowdsale / startSales :\n" + JSON.stringify(result, null, 2) + "\n");
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
    setSalesInfo: function (req, res) {
        console.log(req.body.trial, req.body.startTime, req.session.walletAddress);
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mCrowdsale.deployed().then(function (instance) {
                return instance.setSaleInfo(parseInt(req.body.trial),
                    moment.tz(req.body.startTime, constants.DATETIME_FORMAT, "Asia/Seoul").unix(),
                    moment.tz(req.body.endTime, constants.DATETIME_FORMAT, "Asia/Seoul").unix(),
                    parseInt(req.body.rate),
                    web3.utils.toWei(req.body.minETH),
                    "from Admin Set",
                    { from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mCrowdsale / setSaleInfo :\n" + JSON.stringify(result, null, 2) + "\n");
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
    privateSalePurchase: function (req, res) {
        web3.eth.personal.unlockAccount(req.body.paymentWalletAddress, req.body.password, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mCrowdsale.deployed().then(function (instance) {
                var amount = req.body.amount;
                if (req.body.etherUnit == "eth") {
                    amount = web3.utils.toWei(req.body.amount);
                }
                console.log(amount, req.body.etherUnit);
                return instance.buyTokensPrivate(req.body.walletAddress, { from: req.body.paymentWalletAddress, value: amount, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mCrowdsale / buyTokensPrivate :\n" + JSON.stringify(result, null, 2) + "\n\n");
                web3.eth.personal.lockAccount(req.body.paymentWalletAddress, req.body.password).then((response) => {
                    console.log("web3.eth.personal / lockAccount :\n" + response + "\n\n");
                    return res.sendStatus(202);
                }).catch((error) => {
                    console.log(error);
                    return res.sendStatus(500);
                });
            }).catch(function (err) {
                console.log(err);
                web3.eth.personal.lockAccount(req.body.paymentWalletAddress, req.body.password).then((response) => {
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
    addToPrivateWhiteList: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mCrowdsale.deployed().then(function (instance) {
                console.log(req.body.payer, web3.utils.toWei(req.body.minimum), parseInt(req.body.rate, 10), req.session.walletAddress);
                return instance.addToPrivateWhiteList(req.body.payer, web3.utils.toWei(req.body.minimum), parseInt(req.body.rate, 10), { from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mCrowdsale / addToPrivateWhiteList :\n" + JSON.stringify(result, null, 2) + "\n\n");
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
    refundByAdmin: function (req, res) {
        web3.eth.personal.unlockAccount(req.session.walletAddress, deployerPasswd, 0).then((response) => {
            console.log("web3.eth.personal / unlockAccount :\n" + response + "\n\n");
        }).then(function () {
            mFund.deployed().then(function (instance) {
                console.log(req.body.walletAddress, req.session.walletAddress);
                return instance.refundByOwner(req.body.walletAddress, { from: req.session.walletAddress, gasPrice: variables.GAS_PRICE, gas: variables.GAS_LIMIT });
            }).then(function (result) {
                console.log("mFund / refundByAdmin :\n" + JSON.stringify(result, null, 2) + "\n\n");
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
