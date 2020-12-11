/*
var fs = require("fs");
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const contract = JSON.parse(fs.readFileSync('/home/m/workspace/klaytn/mcc-klaytn/oz-truffle/build/contracts/Token.json', 'utf8'));

var tokenInst = new web3.eth.Contract(contract.abi,"");
tokenInst.methods.manager().call();
*/

var Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');
const { setupLoader } = require('@openzeppelin/contract-loader');
const loader = setupLoader({ provider: web3 }).web3;

// Set up a web3 contract, representing our deployed Box instance, using the contract loader
const address = '';
const box = loader.fromArtifact('Token', address);

    box.methods.owner().call(function(error, result) {
        console.log(result);
    });



