const Caver = require('caver-js')
const caver = new Caver('http://localhost:/')

const address = '';
const privateKeyArray = ["", 
                         ""]
const tx = {
		type: 'VALUE_TRANSFER',
		from: address,
		to: '',
		gas: 300000,
		value: caver.utils.toPeb('1', 'KLAY'),
}

async function send(tx) {
		console.log('-----------------------------------------')
		// sign with private key, not with address
		const user1Signed = await caver.klay.accounts.signTransaction(tx, privateKeyArray[0]);
		const user2Signed = await caver.klay.accounts.signTransaction(user1Signed.rawTransaction, privateKeyArray[1])

		// CAUTION: once this transaction gets passed, your old account uses the new private key
		const receipt = await caver.klay.sendSignedTransaction(user2Signed)
		console.log(receipt)
}

send(tx)

