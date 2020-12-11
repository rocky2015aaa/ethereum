const Caver = require('caver-js')
const caver = new Caver('http://localhost:/')

const address = '';
const newPrivateKey = '';
const oldPrivateKey = '';

// transaction Key test
const tx = {
		type: 'VALUE_TRANSFER',
		from: address,
		to: '',
		gas: 300000,
		value: caver.utils.toPeb('0.01', 'KLAY'),
}

async function send(tx) {
		console.log('-----------------------------------------')
		//const user1Signed = await caver.klay.accounts.signTransaction(tx, oldPrivateKey);
		const user1Signed = await caver.klay.accounts.signTransaction(tx, newPrivateKey);
	
		const receipt = await caver.klay.sendSignedTransaction(user1Signed)
		console.log(receipt)
}

send(tx)
