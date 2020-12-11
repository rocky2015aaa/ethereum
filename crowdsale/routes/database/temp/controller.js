var bcrypt = require('bcrypt'),
    contract = require("../../ethereum/contracts"),
    pool = require("../connection"),
    randomstring = require('randomstring'),

    web3 = contract.web3;

require('log-timestamp');

module.exports = {
    loadInverstorList: function (req, res) {
        var query = `select * from user`;
        if (typeof req.query.email !== "undefined") {
            query += ` where email like "` + req.query.email + `";`;
        } else {
            query += ";";
        }
        console.log("req.query.email : ", req.query.email, ", query : ", query);
        pool.query(query, function (err, rows, fields) {
            if (err) {
                console.log("loadInverstorList : \n" + err);
                return res.sendStatus(500);
            }
            console.log("loadInverstorList :");
            console.log(rows);
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].eth_value != null) {
                    rows[i].eth_value_fromWei = web3.utils.fromWei(rows[i].eth_value.toString(16));
                }
            }
            res.send(rows);
        });
    },
    loadSpecialInverstorList: function (req, res) {
        pool.query(`select * from user_private;`, function (err, rows, fields) {
            if (err) {
                console.log("loadSpecialInverstorList : \n" + err);
                return res.sendStatus(500);
            }
            console.log("loadSpecialInverstorList :");
            console.log(rows);
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].eth_value != null) {
                    rows[i].eth_value_fromWei = web3.utils.fromWei(rows[i].eth_value.toString(16));
                }
            }
            res.send(rows);
        });
    },
    getIfSmartContractDeployed: function (req, res) {
        pool.query(`select mng_value from manage_set where mng_key like 'ICO_TYPE';`, function (err, rows, fields) {
            if (err) {
                console.log("getIfSmartContractDeployed : \n" + err);
                return res.sendStatus(500);
            }
            console.log("getIfSmartContractDeployed :");
            console.log(rows);
            for (var i = 0; i < rows.length; i++) {
                rows[i].mng_value = parseInt(rows[i].mng_value, 10);
            }
            res.send(rows);
        });
    },
    updateUserInfo: function (req, res) {
        console.log("updateUserInfo : ", req.body);
        if (req.body.ethValue > 0) {
            req.body.ethValue += req.body.privateEthValue;
        } else {
            req.body.ethValue = req.body.privateEthValue;
        }
        pool.query('UPDATE user SET eth_value = ?, status = 6, update_date = now() WHERE email like ?;', [req.body.ethValue, req.body.email], function (err, result) {
            if (err) {
                console.log("updateUserStatus : \n" + err);
                return res.sendStatus(500);
            }
            console.log("updateUserStatus :");
            console.log(result.affectedRows + " record(s) updated");
            res.sendStatus(202);
        });
    },
    updateUserIsWhiteListed: function (req, res) {
        console.log("updateUserIsWhiteList : ", req.body.value, req.body.wallet);
        pool.query('UPDATE user SET is_whitelisted = ? WHERE eth_wallet like ?;', [req.body.value, req.body.wallet], function (err, result) {
            if (err) {
                console.log("updateUserIsWhiteList : \n" + err);
                return res.sendStatus(500);
            }
            console.log("updateUserIsWhiteList :");
            console.log(result.affectedRows + " record(s) updated");
            res.sendStatus(202);
        });
    },
    getUserType: function (req, res) {
        console.log(req.query.email, req.query.password)
        pool.query(`SELECT *
        FROM manager
        WHERE username LIKE ?;`, [req.query.email], function (err, rows, fields) {
                if (err) {
                    console.log("getUserType : \n" + err);
                    return res.sendStatus(500);
                }
                console.log("getUserType :");
                console.log(rows[0]);
                res.send(rows[0]);
            });
    },
    addBatchQueue: function (req, res) {
        pool.query('INSERT INTO batch_queue (status, execute_at, type, refer_key, reg_time) VALUES (0, now(), 1, ?, now());', [req.body.userId], function (err, result) {
            if (err) {
                console.log("addBatchQueue : \n" + err);
                return res.sendStatus(500);
            }
            console.log("addBatchQueue :");
            console.log(result.affectedRows + " record(s) inserted");
            res.sendStatus(202);
        });
    },
    addUser: function (req, res) {
        web3.eth.getCode(req.body.ethWallet).then((response) => {
            if (response != "0x") {
                console.log("addUser : " + req.body.ethWallet + "is not valid eth wallet address.");
                return res.sendStatus(500);
            } else {
                var checkProposeKey = function () {
                    return new Promise(function cpk(resolve, reject) {
                        var propose_key = "_" + randomstring.generate(9);
                        pool.query(`select * from user where propose_key like ?;`, [propose_key], function (err, rows, fields) {
                            if (err) {
                                console.log("addUser : \n" + err);
                                cpk(propose_key);
                            }
                            console.log("addUser :");
                            console.log(rows);
                            resolve(propose_key);
                        });
                    });
                };

                checkProposeKey()
                    .then(function (result) {
                        var hash = bcrypt.hashSync(new Date().toISOString(), bcrypt.genSaltSync(10));
                        console.log("addUser : \n" + hash);

                        pool.query(`INSERT INTO user (active, email, name, password, phone, eth_wallet, eth_value, status, insert_date, update_date, lang, country, propose_key, reg_type)
                 VALUES (1, ?, ?, ?, ?, ?, ?, 6, now(), now(), "en", ?, ?, ?);`,
                            [req.body.email, req.body.name, hash, req.body.phone, req.body.ethWallet, req.body.ethValue, req.body.country, result, req.body.regType], function (err, result) {
                                if (err) {
                                    console.log("addUser : \n" + err);
                                    return res.sendStatus(500);
                                }
                                console.log("addUser :");
                                console.log(result.affectedRows + " record(s) inserted");
                                res.sendStatus(202);
                            });
                    });
            }
        })
    },
    assignBonusToken: function (req, res) {
        pool.query('INSERT INTO bonus_token_log (user_id, type, tokens) VALUES (?, ?, ?);', [req.body.userId, req.body.type, web3.utils.toWei(req.body.tokens)], function (err, result) {
            if (err) {
                console.log("assignBonusToken : \n" + err);
                return res.sendStatus(500);
            }
            console.log("assignBonusToken :");
            console.log(result.affectedRows + " record(s) inserted");
            res.sendStatus(202);
        });
    },
    addUserRole: function (req, res) {
        pool.query('INSERT INTO user_role (user_id, role_id) VALUES (?, 2);', [req.body.userId], function (err, result) {
            if (err) {
                console.log("addUserRole : \n" + err);
                return res.sendStatus(500);
            }
            console.log("addUserRole :");
            console.log(result.affectedRows + " record(s) inserted");
            res.sendStatus(202);
        });
    },
}