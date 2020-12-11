var config = require("../config/config_" + process.env.CURRENT_SERVER + ".json"),
    MCCFund = artifacts.require("MCCFund"),
    MCCToken = artifacts.require("MCCToken"),
    MCCCrowdsale = artifacts.require("MCCCrowdsale");

module.exports = function (deployer) {

    const TOKEN_OWNER = config.ethereum_client.deployer;
    const FOUNDER_WALLET = config.wallet_address.founder;
    const ADVISOR_WALLET = config.wallet_address.advisor;
    const BIZ_DEVELOP_WALLET = config.wallet_address.biz_develop;
    const MARKETING_WALLET = config.wallet_address.marketing;
    const AIRDROP_WALLET = config.wallet_address.airdrop;
    const TEAM_WALLET = config.wallet_address.team;

    const ownerWallet = [
        TOKEN_OWNER,
        AIRDROP_WALLET,
    ];

    deployer.deploy(MCCFund, TEAM_WALLET, ownerWallet)
        .then(function () {
            return deployer.deploy(MCCToken, 0x0, ownerWallet, TOKEN_OWNER)
                .then(function () {
                    return deployer.deploy(MCCCrowdsale, MCCToken.address, MCCFund.address, FOUNDER_WALLET, ADVISOR_WALLET, BIZ_DEVELOP_WALLET, MARKETING_WALLET, AIRDROP_WALLET, TOKEN_OWNER);
                });

        })
};