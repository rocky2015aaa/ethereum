const Caver = require('caver-js')
const caver = new Caver('http://localhost:/')

const address = '';
const newPrivateKey = '';
const oldPrivateKey = '';

// use createAccountForUpdate
const accountForUpdate = caver.klay.accounts.createAccountForUpdate(address, newPrivateKey);
console.log('>>> about to configure ACCOUNT(address=', address, ') with the following key:', newPrivateKey)

const updateTx = {
		type: 'ACCOUNT_UPDATE',
		from: address,
		key: accountForUpdate,
		gas: 300000,
}

async function update(updateTx) {
		console.log('-----------------------------------------')
		// sign with private key, not with address
		const signed = await caver.klay.accounts.signTransaction(updateTx, oldPrivateKey);

		// CAUTION: once this transaction gets passed, your old account uses the new private key
		const receipt = await caver.klay.sendSignedTransaction(signed)
		console.log(receipt)
		console.log('>>> new private key is in effect:', newPrivateKey);
		console.log('>>> old private key is no longer effective:', oldPrivateKey);
}

update(updateTx)

