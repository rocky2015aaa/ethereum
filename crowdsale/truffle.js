var config = require("./config/config_" + process.env.CURRENT_SERVER + ".json");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: config.ethereum_client.host,
            port: config.ethereum_client.port,
            network_id: "*", // match any network
            from: "",
            gas: 4700000,
            gasPrice: 60000000000
        },
        ropsten: {
            host: config.ethereum_client.host,
            port: config.ethereum_client.port,
            from: "",
            network_id: 3,
            gas: 4700000,
            gasPrice: 60000000000
        },
        rinkeby: {
            host: config.ethereum_client.host,
            port: config.ethereum_client.port,
            from: "",
            network_id: 4,
            gasPrice: 60000000000
        },
        kovan: {
            host: config.ethereum_client.host,
            port: config.ethereum_client.port,
            from: "",
            network_id: 42,
            gasPrice: 60000000000
        },
        main: {
            host: config.ethereum_client.host, // Random IP for example purposes (do not use)
            port: config.ethereum_client.port,
            network_id: 1,        // Ethereum public network
            from: "",
            gasPrice: 60000000000
        }
    },
    solc: {
        optimizer: {
            enable: true,
            runs: 200
        }
    }
};
