const Caver = require('caver-js')
const caver = new Caver('http://localhost:/')

const address = '';
const privateKey = '';

const privateKeyArray = ["", 
                         "",
						 ""]
const multiSigOptions = { threshold: 2, weight: [1, 1, 2] }
// use createAccountForUpdate
const accountForUpdateForAccountKeyMultiSig = caver.klay.accounts.createAccountForUpdate(address, privateKeyArray, multiSigOptions);
console.log('>>> about to configure ACCOUNT(address=', address, ') with the following key:', privateKeyArray)

const updateTx = {
		type: 'ACCOUNT_UPDATE',
		from: address,
		key: accountForUpdateForAccountKeyMultiSig,
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
		console.log('>>> new private key is in effect:', privateKeyArray);
		console.log('>>> old private key is no longer effective:', privateKey);
}

update(updateTx)

