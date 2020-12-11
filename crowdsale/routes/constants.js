var config = require("../config/config_" + process.env.CURRENT_SERVER + ".json");

function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true,
        writable : false
    });
}

define("PROVIDER_URL", "http://" + config.ethereum_client.host + ":" + config.ethereum_client.port);
define("ADMIN", 1);
define("USER", 2);
define("DATE_FORMAT", "YYYY-MM-DD");
define("DATETIME_FORMAT", "YYYY-MM-DD HH:mm:ss");
define("RINKEBY_TRANSACTION_URL", "https://api-rinkeby.etherscan.io/api?module=account&action=txlist&startblock=0&endblock=99999999&sort=asc&address=");
define("RSA_PRIVATE_KEY_URL", require('os').homedir()+config.rsa.private_key_path);
define("RSA_PUBLIC_KEY_URL", require('os').homedir()+config.rsa.public_key_path);