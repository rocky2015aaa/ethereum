const Caver = require('caver-js')
const caver = new Caver('http://localhost:/')

const address = '';
const privateKey = '';

const privateKeyArray = ["", 
                         "",
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
		// pk1 + pk2i (1+1 == 2) : work
		const user1Signed = await caver.klay.accounts.signTransaction(tx, privateKeyArray[0]);
		const user2Signed = await caver.klay.accounts.signTransaction(user1Signed.rawTransaction, privateKeyArray[1])
	
		// pk3 (2 == 2) :work
		//const user2Signed = await caver.klay.accounts.signTransaction(tx, privateKeyArray[2])
		
		// pk2 (1 < 2) : not work
		//const user2Signed = await caver.klay.accounts.signTransaction(tx, privateKeyArray[1])

		// CAUTION: once this transaction gets passed, your old account uses the new private key
		const receipt = await caver.klay.sendSignedTransaction(user2Signed)
		console.log(receipt)
}

send(tx)

