const Caver = require('caver-js'),
      caver = new Caver('http://localhost:/')

const account = caver.klay.accounts.create()

function printAccount(account) {
		console.log(`address: ${account.address}`)
		console.log(`privateKey: ${account.privateKey}`)
		console.log(`accountKeyType: ${account.accountKeyType}`)
		console.log(`accountKey`)
		console.log(account.accountKey)
		console.log(`account.keys: ${account.keys}`)
		console.log(`account.transactionKey: ${account.transactionKey}`)
		console.log(`account.updateKey: ${account.updateKey}`)
		console.log(`account.feePayerKey: ${account.feePayerKey}\n`)
}

console.log("--------------------- created account")
printAccount(account)
