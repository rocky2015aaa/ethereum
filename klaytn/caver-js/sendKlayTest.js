const Caver = require('caver-js'),
		caver = new Caver('https://api.baobab.klaytn.net:/'),
		privateKey = ""

const account = caver.klay.accounts.wallet.add(privateKey)

caver.klay.getBalance(account.address).then(console.log);
caver.klay.sendTransaction({
    type: 'SMART_CONTRACT_EXECUTION',
    from: account.address,
    to: '',
    data: '',
    gas: '300000',
    value: 100,
}).then(console.log).then(function () {
    caver.klay.getBalance(account.address).then(console.log);
});

