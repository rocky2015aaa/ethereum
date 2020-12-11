var mysql = require('mysql'),
    config = require("../../config/config_" + process.env.CURRENT_SERVER + ".json");

var pool = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    port: config.mysql.port,
    database: config.mysql.database
});

module.exports = pool;