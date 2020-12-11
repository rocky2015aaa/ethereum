const moment = require('moment-timezone');

var config = require("../../../config/config_" + process.env.CURRENT_SERVER + ".json"),
    constants = require("../../constants"),
    contract = require("../contracts"),
    rsa = require("../../../rsa/rsa"),
    variables = require("../../variables"),

    mCrowdsale = contract.mCrowdsale,
    mFund = contract.mFund,
    mToken = contract.mToken,
    web3 = contract.web3,

    deployerPasswd = rsa.decryptStringWithRsaPrivateKey(config.ethereum_client.deployer_password, constants.RSA_PRIVATE_KEY_URL);

require('log-timestamp');

module.exports = {
    wallet: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return res.send(instance.address);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    owner: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.owner.call();
        }).then(function (result) {
            console.log("mCrowdsale / owner.call :\n"+result+ "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    pause: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.paused.call();
        }).then(function (result) {
            console.log("mCrowdsale / paused.call :\n"+result+ "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    trial: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.salesCurrentTrials.call();
        }).then(function (result) {
            console.log("mCrowdsale / salesCurrentTrials.call :\n"+result+ "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    infos: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.getCurrentSalesInfo();
        }).then(function (result) {
            console.log("mCrowdsale / getCurrentSalesInfo :\n"+result+ "\n\n");
            result[0] = moment.unix(result[0]).format(constants.DATETIME_FORMAT);
            result[1] = moment.unix(result[1]).format(constants.DATETIME_FORMAT);
            result[3] = web3.utils.fromWei(result[3].toString(16))
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    isfinalized: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.isFinalized.call();
        }).then(function (result) {
            console.log("mCrowdsale / isFinalized.call :\n"+result+ "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    isclosed: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.hasClosed();
        }).then(function (result) {
            console.log("mCrowdsale / hasClosed :\n"+result+ "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    goal: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.SOFT_CAP.call();
        }).then(function (result) {
            console.log("mCrowdsale / SOFT_CAP.call :\n"+web3.utils.fromWei(result.toString(16))+ "\n\n");
            return res.send(web3.utils.fromWei(result.toString(16)));
        }).catch(function (err) {
            console.log(err);
        });
    },
    hardcap: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.HARD_CAP.call();
        }).then(function (result) {
            console.log("mCrowdsale / HARD_CAP.call :\n"+web3.utils.fromWei(result.toString(16))+ "\n\n");
            return res.send(web3.utils.fromWei(result.toString(16)));
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    fund: function (req, res) {
        web3.eth.getBalance(mFund.address).then(function (result) {
            console.log("web3 / eth.getBalance (fund) :\n" + result + "\n\n");
            return res.send(web3.utils.fromWei(result.toString(16)));
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    purchasedTokenAmount: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.getPurchasedTokenAmount(req.query.walletAddress);
        }).then(function (result) {
            console.log("mCrowdsale / getPurchasedTokenAmount :\n"+web3.utils.fromWei(result.toString(16))+ "\n\n");
            return res.send(web3.utils.fromWei(result.toString(16)));
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    availableTokenToSell: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.getRemainTokensToSell();
        }).then(function (result) {
            console.log("mCrowdsale / getRemainTokensToSell :\n"+web3.utils.fromWei(result.toString(16))+ "\n\n");
            return res.send(web3.utils.fromWei(result.toString(16)));
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    etherAmount: function (req, res) {
        web3.eth.getBalance(req.query.walletAddress).then(function (result) {
            console.log("web3 / eth.getBalance :\n" + result + "\n");
            return res.send(web3.utils.fromWei(result.toString(16)));
        });
    },
    getPrivateSaleRate: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.getPrivateSaleRate(req.query.payer);
        }).then(function (result) {
            console.log("mCrowdsale / getEventRate :\n" + result + "\n\n");
            return res.send(result);
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
    getPrivateSaleMinumum: function (req, res) {
        mCrowdsale.deployed().then(function (instance) {
            return instance.getPrivateSaleMinumum(req.query.payer);
        }).then(function (result) {
            console.log("mCrowdsale / getEventRate :\n" + result + "\n\n");
            return res.send(web3.utils.fromWei(result.toString(16)));
        }).catch(function (err) {
            console.log(err);
            return res.sendStatus(500);
        });
    },
}
