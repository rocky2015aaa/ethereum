const Caver = require('caver-js'),
		caver = new Caver('https://api.baobab.klaytn.net:/'),
		privateKey = ""

const accountFromKey = caver.klay.accounts.privateKeyToAccount(privateKey)
const accountKey = caver.klay.accounts.createAccountKey(privateKey)
const accountFromStringKey = caver.klay.accounts.createWithAccountKey(accountFromKey.address, privateKey)
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
printAccount(accountFromKey)
console.log("--------------------- accountFromStringKey")
printAccount(accountFromStringKey)
console.log("--------------------- accountFromAccountKey")
printAccount(accountFromAccountKey)
