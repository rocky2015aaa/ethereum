const Caver = require('caver-js')
const caver = new Caver('http://localhost:/')

const address = '';
const privateKey = '';

// AccountForUpdate with AccountKeyRoleBased
const keyObject = {
    transactionKey: ['', ''],
    updateKey: '',
    feePayerKey: '',
}
const roleBasedOptions = { transactionKey: { threshold: 2, weight: [1, 1] } }
const accountForUpdateForAccountKeyRoleBased = caver.klay.accounts.createAccountForUpdate(address, keyObject, roleBasedOptions)

const updateTx = {
		type: 'ACCOUNT_UPDATE',
		from: address,
		key: accountForUpdateForAccountKeyRoleBased,
		gas: 300000,
}

async function update(updateTx) {
		console.log('-----------------------------------------')
		// sign with private key, not with address
		const signed = await caver.klay.accounts.signTransaction(updateTx, privateKey);
		//const signed = await caver.klay.accounts.signTransaction(updateTx, privateKeyArray);

		// CAUTION: once this transaction gets passed, your old account uses the new private key
		const receipt = await caver.klay.sendSignedTransaction(signed)
		console.log(receipt)
		console.log('>>> new private key is in effect:', keyObject);
		console.log('>>> old private key is no longer effective:', privateKey);
}

update(updateTx)

