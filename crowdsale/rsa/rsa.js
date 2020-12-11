var path = require("path"),
    fs = require("fs"),
    constants = require("../routes/constants"),
    NodeRSA = require('node-rsa');

require('log-timestamp');

var encryptStringWithRsaPublicKey = function (toEncrypt, relativeOrAbsolutePathToPublicKey) {
    try {
        var absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
        var publicKey = fs.readFileSync(absolutePath, "utf8");

        var key = new NodeRSA(publicKey, {b: 1024});
        var encrypted = key.encrypt(toEncrypt, 'base64');
    } catch (err) {
        console.log(err);    // Handle the error here.
        return err;
    }
    return encrypted;
};

var decryptStringWithRsaPrivateKey = function (toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
    try {
        var absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
        var privateKey = fs.readFileSync(absolutePath, "utf8");

        var key = new NodeRSA(privateKey, {b: 1024});
        var decrypted = key.decrypt(toDecrypt, 'utf8');

    } catch (err) {
        console.log("\nrsa / decryptStringWithRsaPrivateKey :\n", err);
        return err;
    }
    return decrypted;
};

module.exports = {
    encryptStringWithRsaPublicKey: encryptStringWithRsaPublicKey,
    decryptStringWithRsaPrivateKey: decryptStringWithRsaPrivateKey
}