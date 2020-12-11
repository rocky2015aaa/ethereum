const Caver = require('caver-js'),
		caver = new Caver('http://localhost:/'),
		privateKey1 = "",
		privateKey2 = "",
		privateKey3 = ""

const keyobject = {
    transactionKey: [privateKey1,privateKey2,privateKey3],
    updateKey: privateKey1,
    feePayerKey: [privateKey1,privateKey2,privateKey3]
}
const accountKey = caver.klay.accounts.createAccountKey(keyobject)

const accountFromKey = caver.klay.accounts.privateKeyToAccount("")
const accountFromStringKey = caver.klay.accounts.createWithAccountKey(accountFromKey.address, keyobject)
const accountFromAccountKey = caver.klay.accounts.createWithAccountKey(accountFromKey.address, accountKey)

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

function printAccountKey(accountKey) {
		console.log(accountKey)
		console.log(`type: ${accountKey.type}`)
		console.log(`keys:`)
		console.log(accountKey.keys)
		console.log(`transactionKey: ${accountKey.transactionKey}`)
		console.log(`updateKey: ${accountKey.updateKey}`)
		console.log(`feePayerKey: ${accountKey.feePayerKey}`)
}

console.log("--------------------- accountFromKey")
printAccount(accountKey)
console.log("--------------------- accountFromStringKey")
printAccount(accountFromStringKey)
console.log("--------------------- accountFromAccountKey")
printAccount(accountFromAccountKey)
