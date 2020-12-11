var express = require('express'),

    bcrypt = require('bcrypt'),
    bodyParser = require('body-parser'),
    config = require("./config/config_" + process.env.CURRENT_SERVER + ".json"),
    constants = require("./routes/constants"),
    contract = require("truffle-contract"),
    createKeccakHash = require('keccak'),
    http = require('http'),
    rp = require('request-promise'),
    rsa = require('./rsa/rsa');
    session = require('express-session');

require('log-timestamp');

const saltRounds = 10;

app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    key: "m_id",
    secret: '1@%24^%$3^*&98&^%$',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000 // 60 mins
    },
}));

app.use('/mtoken', require('./routes/ethereum/mtoken/index'));
app.use('/mfund', require('./routes/ethereum/mfund/index'));
app.use('/mtoken-sale', require('./routes/ethereum/mtoken_sale/index'));
app.use('/mtoken-sale/kyc', require('./routes/ethereum/mtoken_sale/kyc/index'));
app.use('/mtoken-sale/management', require('./routes/ethereum/mtoken_sale/management/index'));
app.use('/temp', require('./routes/ethereum/temp/index'));
app.use('/temp2', require('./routes/database/temp/index'));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//console.log("encrypt_production: "+rsa.encryptStringWithRsaPublicKey("mCc!masterR0", constants.RSA_PUBLIC_KEY_URL));

app.get('/keccak-address', function (req, res) {
    res.send(toChecksumAddress(req.query.walletAddress));
});

app.post('/login', function (req, res) {
    var options = {
        uri: 'http://localhost:8001/temp2/user',
        qs: {
            email: req.body.email,
            password: req.body.password
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        port: 80,
        json: true
    };

    rp(options)
        .then(function (resp) {
            if (!bcrypt.compareSync(req.body.password, resp.password)) {
                res.cookie('login_failure_msg', 'Please check your account or password')
                res.redirect('/');
                return true;
            }
            console.log("resp :\n" + resp.role,resp.eth_wallet,req.session.walletAddress);
            if (req.session.walletAddress == undefined) {
                req.session.walletAddress = resp.eth_wallet;
            }
            console.log("session :\n" + req.session.walletAddress);
            req.session.save(function () {
                if (resp.role == constants.ADMIN) {
                    res.render('admin_menu.html');
                }
            });
        })
        .catch(function (err) {
            res.cookie('login_failure_msg', 'Please check your account or password');
            res.redirect('/');
        });
});

app.post('/logout', function (req, res) {
    delete req.session;
    res.redirect('/');
});

var server = app.listen(config.app.port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("m_frontend app listening at http://%s:%s", host, port)
});


function toChecksumAddress(address) {
    address = address.toString().toLowerCase().replace('0x', '')
    var hash = createKeccakHash('keccak256').update(address).digest('hex')
    var ret = '0x'

    for (var i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            ret += address[i].toUpperCase()
        } else {
            ret += address[i]
        }
    }

    return ret
}
