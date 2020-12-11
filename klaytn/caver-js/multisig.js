const Caver = require('caver-js'),
		caver = new Caver('http://localhost:/'),
		privateKey1 = "",
		privateKey2 = "",
		privateKey3 = ""

const accountFromKey = caver.klay.accounts.privateKeyToAccount("")

const privateKeyArray = [privateKey1, privateKey2, privateKey3]
const accountKey = caver.klay.accounts.createAccountKey(privateKeyArray)

const accountFromStringKey = caver.klay.accounts.createWithAccountKey(accountFromKey.address, privateKeyArray)
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

console.log("--------------------- accountFromKey")
printAccount(accountKey)
console.log("--------------------- accountFromStringKey")
printAccount(accountFromStringKey)
console.log("--------------------- accountFromAccountKey")
printAccount(accountFromAccountKey)
