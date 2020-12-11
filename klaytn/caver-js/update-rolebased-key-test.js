const Caver = require('caver-js')
const caver = new Caver('http://localhost:/')

const address = '';
const privateKey = '';

const keyObject = {
    transactionKey: ['', ''],
    updateKey: '',
    feePayerKey: '',
}
const roleBasedOptions = { transactionKey: { threshold: 2, weight: [1, 1] } }

// transaction Key test
const tx = {
		type: 'VALUE_TRANSFER',
		from: address,
		to: '',
		gas: 300000,
		value: caver.utils.toPeb('1', 'KLAY'),
}

async function send(tx) {
		console.log('-----------------------------------------')
		// pk1 (1 < 2) : not work
		const user1Signed = await caver.klay.accounts.signTransaction(tx, keyObject.transactionKey[0]);
		const receipt = await caver.klay.sendSignedTransaction(user1Signed)
		console.log(receipt)

		// pk1 + pk2 (1+1 == 2) : work
		const user1Signed = await caver.klay.accounts.signTransaction(tx, keyObject.transactionKey[0]);
		const user2Signed = await caver.klay.accounts.signTransaction(user1Signed.rawTransaction, keyObject.transactionKey[1])
		const receipt = await caver.klay.sendSignedTransaction(user2Signed)
		console.log(receipt)
}

send(tx)

const Caver = require('caver-js')
const caver = new Caver('http://localhost:9889/')

const address = '';
const privateKey = '';

const keyObject = {
    transactionKey: ['', ''],
    updateKey: '',
    feePayerKey: '',
}

const newKeyObject = {
    transactionKey: privateKey,
    updateKey: keyObject.updateKey,
    feePayerKey: keyObject.feePayerKey,
}
const accountForUpdateForAccountKeyRoleBased = caver.klay.accounts.createAccountForUpdate(address, newKeyObject)

const updateTx = {
		type: 'ACCOUNT_UPDATE',
		from: address,
		key: accountForUpdateForAccountKeyRoleBased,
		gas: 300000,
}

async function update(updateTx) {
		console.log('-----------------------------------------')
		// not update key, not work
		const signed = await caver.klay.accounts.signTransaction(updateTx, privateKey);
		const receipt = await caver.klay.sendSignedTransaction(signed)
		console.log(receipt)

		// update key, work
		const signed = await caver.klay.accounts.signTransaction(updateTx, keyObject.updateKey);
		const receipt = await caver.klay.sendSignedTransaction(signed)
		console.log(receipt)
}

update(updateTx)

// Fee Delegation
const payer = caver.klay.accounts.wallet.add(keyObject.feePayerKey);
async function run() {
    caver.klay.getAccount('').then(console.log); // should print `null`

    // make sure `data` starts with 0x
    const { rawTransaction: senderRawTransaction } = await caver.klay.accounts.signTransaction({
        type: 'FEE_DELEGATED_VALUE_TRANSFER',
        from: '',
        to: '',
        gas: '3000000',
		value: caver.utils.toPeb('1', 'KLAY'),
    }, '');

    // signed raw transaction
    console.log("Raw TX:\n", senderRawTransaction);
    console.log("payer address:\n", payer.address);
    
    // send fee delegated transaction with fee payer information
    caver.klay.sendTransaction({
        senderRawTransaction: senderRawTransaction,
        feePayer: payer.address,
    })
        .on('transactionHash', function (hash) {
            console.log(">>> tx_hash for deploy =", hash);
        })
        .on('receipt', function (receipt) {
            console.log(">>> receipt arrived: ", receipt);
            
            caver.klay.getAccount('').then(console.log); // should NOT print `null`
        })
        .on('error', function (err) {
            console.error(">>> error: ", err);
        });
}

run()

// feePayerSignTransaction Test
const feePayer = caver.klay.accounts.wallet.add(keyObject.feePayerKey);
const feePayer2 = caver.klay.accounts.wallet.add('');
const tx = {
		type: 'FEE_DELEGATED_VALUE_TRANSFER',
		from: address,
		to: '',
		gas: 300000,
		value: caver.utils.toPeb('0.1', 'KLAY'),
}

async function sendT(tx) {
		console.log('-----------------------------------------')
		// pk1 + pk2i (1+1 == 2) : work
		const user1Signed = await caver.klay.accounts.signTransaction(tx, keyObject.transactionKey[0]);
		//const user2Signed = await caver.klay.accounts.feePayerSignTransaction(user1Signed.rawTransaction, feePayer.address)
		const user2Signed = await caver.klay.accounts.feePayerSignTransaction(user1Signed.rawTransaction, feePayer2.address)
	
		// CAUTION: once this transaction gets passed, your old account uses the new private key
		const receipt = await caver.klay.sendSignedTransaction(user2Signed)
		console.log(receipt)
}

sendT(tx)

