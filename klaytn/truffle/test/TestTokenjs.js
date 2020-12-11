const Token = artifacts.require("Token");
//const Web3 = require('web3');
//var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// deployer = accounts[0]
// owner = accounts[1]
// exchange_master = accounts[9]
// manager = accounts[3]

contract("TestTokenjs - setOwner", accounts => {
    // test update owner by manager
    before("### check  token owner", () =>
        Token.deployed()
        .then(instance => 
            instance.owner()
            .then(owner => assert.equal(owner, accounts[1], "cannot find original  token owner"))));

    it("*** setOwner success: update new token owner by token manager", () => 
        Token.deployed() .then(instance => {
             instance.setOwner(accounts[4], { from: accounts[3], gasPrice: 60000000000, gas: 400000 });
             return instance;
        }).then(instance =>
                instance.owner().then(owner => {
                    console.log("setOwner is successful");
                    assert.equal(owner, accounts[4], "update token owner is failed");
                })));
    
    it("*** setOwner failure: wrong manager updates owner", () => 
        Token.deployed().then(instance => 
             instance.setOwner(accounts[1], { from: accounts[0], gasPrice: 60000000000, gas: 400000 })
             .catch(function(e) {
                  assert.equal(true, e instanceof Error, "should be error");
                  console.log(e.message);
             })));

    after("$$$ reset token owner", () =>
        Token.deployed()
        .then(instance => {
             instance.setOwner(accounts[1], { from: accounts[3], gasPrice: 60000000000, gas: 400000 });
             return instance;
        }).then(instance =>
                instance.owner().then(owner => assert.equal(owner, accounts[1], "update token owner is failed"))));
});

contract("TestTokenjs - setSeedPublisher", accounts => {
    it("*** setseedpublisher success: update new token seed publisher by token owner", () => 
        Token.deployed().then(instance => {
             instance.setSeedPublisher(accounts[8], { from: accounts[1], gasprice: 60000000000, gas: 400000 });
             return instance;
        }).then(instance =>
                instance.seedPublisher().then(seedpublisher => {
                    console.log("setseedpublisher is successful");
                    assert.equal(seedpublisher, accounts[8], "update token seed publisher is failed");
                })));
    
    it("*** setSeedPublisher failure: wrong owner updates seed publisher", () => 
        Token.deployed().then(instance => 
             instance.setOwner(accounts[7], { from: accounts[0], gasPrice: 60000000000, gas: 400000 })
             .catch(function(e) {
                  assert.equal(true, e instanceof Error, "should be error");
                  console.log(e.message);
             })));
});

contract("TestTokenjs - goodmorn", accounts => {
    it("*** setseedpublisher success: update new token seed publisher by token owner", () => 
        Token.deployed().then(instance => {
             instance.setSeedPublisher(accounts[7], { from: accounts[1], gasprice: 60000000000, gas: 400000 });
             return instance;
        }).then(instance =>
                instance.seedPublisher().then(seedpublisher => {
                    console.log("setseedpublisher is successful");
                    assert.equal(seedpublisher, accounts[7], "update token seed publisher is failed");
                })));

    it("*** goodmorn success: call goodmorn function with klay by seed publisher", () => 
        Token.deployed().then(instance => {
             instance.goodmorn(1, 1, 1, 1,"10.0","Korea","2020/02/24 13:49:00", { from: accounts[7], gasPrice: 60000000000, gas: 400000 , value: 0});
             return instance;
        }).then(console.log("goodmorn is successful")));

    it("*** goodmorn failure: wrong seed publisher calls goodmorn", () => 
        Token.deployed().then(instance => 
             instance.goodmorn(1, 1, 1, 1,"10.0","Korea","2020/02/25 17:49:00", { from: accounts[8], gasPrice: 60000000000, gas: 400000 , value: 0})
             .catch(function(e) {
                  assert.equal(true, e instanceof Error, "should be error");
                  console.log(e.message);
             })));
});

contract("TestTokenjs - setLimitedWalltAddress", accounts => {
    // test lock token transfer for the specific account
    before("### set token transfer limitation for an account by owner", () =>
        Token.deployed()
        .then(instance => {
            instance.setAllowTransfers(true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
            instance.transfer(accounts[0], 1000000, { from: accounts[9], gasPrice: 60000000000, gas: 400000 });
            instance.transfer(accounts[1], 1000000, { from: accounts[9], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
            instance.transfer(accounts[4], 1000, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            instance.transfer(accounts[5], 1000, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
        }));
            
    it("*** LimitedWalletAddress success 1: set limited sender wallet address", () => 
        Token.deployed()
        .then(instance => {
            instance.setLimitedWalletAddress(accounts[4], 1, true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => 
             instance.transfer(accounts[5], 100, { from: accounts[4], gasPrice: 60000000000, gas: 400000 }))
             .catch(function(e) {
                 assert.equal(true, e instanceof Error, "should be error");
                 console.log(e.message);
             }));
    
    it("*** LimitedWalletAddress success 2: set limited receiver wallet address", () => 
        Token.deployed()
        .then(instance => {
            instance.setLimitedWalletAddress(accounts[3], 2, true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => 
             instance.transfer(accounts[3], 100, { from: accounts[2], gasPrice: 60000000000, gas: 400000 }))
             .catch(function(e) {
                 assert.equal(true, e instanceof Error, "should be error");
                 console.log(e.message);
             }));
    
    it("*** LimitedWalletAddress success 3: set limited sender/receiver wallet address", () => 
        Token.deployed()
        .then(instance => {
            instance.setLimitedWalletAddress(accounts[0], 3, true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
             instance.transfer(accounts[5], 100, { from: accounts[0], gasPrice: 60000000000, gas: 400000 })
             .catch(function(e) {
                 assert.equal(true, e instanceof Error, "should be error");
                 console.log(e.message);
             });
            instance.transfer(accounts[5], 100, { from: accounts[0], gasPrice: 60000000000, gas: 400000 })
             .catch(function(e) {
                 assert.equal(true, e instanceof Error, "should be error");
                 console.log(e.message);
             });
        }));
    
    it("*** LimitedWalletAddress success 4: unset limited wallet addresses", () => 
        Token.deployed()
        .then(instance => {
            instance.setLimitedWalletAddress(accounts[4], 3, false, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            instance.setLimitedWalletAddress(accounts[3], 3, false, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
             instance.transfer(accounts[3], 100, { from: accounts[4], gasPrice: 60000000000, gas: 400000 });
             return instance;
        }).then(instance => 
            instance.balanceOf.call(accounts[3]).then(balance => {
                console.log("unset LimitedWalletAddress is successful");
                assert.equal(balance.valueOf(), 100, "100 wasn't in the transfered account");
            })));
    it("*** add LimitedWalletAddress failure 1: wrong owner sets limited wallet address", () => 
        Token.deployed()
        .then(instance => 
            instance.setLimitedWalletAddress(accounts[6], true, true, { from: accounts[2], gasPrice: 60000000000, gas: 400000 })
            .catch(function(e) {
                 assert.equal(true, e instanceof Error, "should be error");
                 console.log(e.message);
            })));
    
    it("*** LimitedWalletAddress failure 2: overflow user flag", () => 
        Token.deployed()
        .then(instance => 
            instance.setLimitedWalletAddress(accounts[4], 4, true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 })
             .catch(function(e) {
                 assert.equal(true, e instanceof Error, "should be error");
                 console.log(e.message);
             })));
    
    it("*** LimitedWalletAddress failure 2: underflow user flag", () => 
        Token.deployed()
        .then(instance => 
            instance.setLimitedWalletAddress(accounts[4], 0, true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 })
             .catch(function(e) {
                 assert.equal(true, e instanceof Error, "should be error");
                 console.log(e.message);
             })));
});

contract("TestTokenjs - setAllowTransfers", accounts => {
    it("*** setAllowTransfer false success: not allow token transfer", () => 
        Token.deployed()
        .then(instance => 
              instance.transfer(accounts[1], 1000000000, { from: accounts[9], gasPrice: 60000000000, gas: 400000 })
              .catch(function(e) {
                    assert.equal(true, e instanceof Error, "should be error");
                    console.log(e.message);
              })));
        
    it("*** setAllowTransfer true success: allow token transfer", () => 
        Token.deployed()
        .then(instance => {
            instance.setAllowTransfers(true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
            instance.transfer(accounts[8], 1000, { from: accounts[9], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => 
            instance.balanceOf.call(accounts[8]).then(balance => {
                console.log("setAllowTransfer is successful");
                assert.equal(balance.valueOf(), 1000, "1000 wasn't in the transfered account");
            })));
    
    it("*** setAllowTransfer failure: wrong owner tried to call", () => 
        Token.deployed()
        .then(instance => 
              instance.setAllowTransfers(true, { from: accounts[3], gasPrice: 60000000000, gas: 400000 })
              .catch(function(e) {
                    assert.equal(true, e instanceof Error, "should be error");
                    console.log(e.message);
              })));
});

contract("TestTokenjs - transferFrom", accounts => {
    before("### set setAllowTransfer to true", () =>
        Token.deployed()
        .then(instance => {
            instance.setAllowTransfers(true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
            instance.transfer(accounts[1], 1000000, { from: accounts[9], gasPrice: 60000000000, gas: 400000 });
            instance.transfer(accounts[4], 1000, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            instance.transfer(accounts[5], 1000, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
        }));

    it("*** transferFrom success: approve and transferFrom", () => 
        Token.deployed()
        .then(instance => {
              instance.approve(accounts[5], 100, { from: accounts[4], gasPrice: 60000000000, gas: 400000 });
              return instance;
        }).then(instance => {
              instance.transferFrom(accounts[4], accounts[5], 80, { from: accounts[5], gasPrice: 60000000000, gas: 400000 });
              return instance;
        }).then(instance => {
            console.log("transferFrom is successful");
            instance.balanceOf.call(accounts[4]).then(balance => assert.equal(balance.valueOf(), 920, "920 wasn't in the account"));
            instance.balanceOf.call(accounts[5]).then(balance => assert.equal(balance.valueOf(), 1080, "1080 wasn't in the account"));
        }));
    
    it("*** transferFrom failure 1: transfer exceed value", () => 
        Token.deployed()
        .then(instance => 
              instance.transferFrom(accounts[4], accounts[5], 80, { from: accounts[5], gasPrice: 60000000000, gas: 400000 }))
              .catch(function(e) {
                    assert.equal(true, e instanceof Error, "should be error");
                    console.log(e.message);
              }));
    
    it("*** transferFrom failure 2: transfer value to the account is not approved", () => 
        Token.deployed()
        .then(instance => 
              instance.transferFrom(accounts[4], accounts[3], 80, { from: accounts[5], gasPrice: 60000000000, gas: 400000 }))
              .catch(function(e) {
                    assert.equal(true, e instanceof Error, "should be error");
                    console.log(e.message);
              }));
});

contract("TestTokenjs - transferMulti", accounts => {
    before("### set setAllowTransfer to true", () =>
        Token.deployed()
        .then(instance => {
            instance.setAllowTransfers(true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
            instance.transfer(accounts[1], 1000000, { from: accounts[9], gasPrice: 60000000000, gas: 400000 });
            instance.transfer(accounts[2], 1000000, { from: accounts[9], gasPrice: 60000000000, gas: 400000 });
            instance.transfer(accounts[3], 1000000, { from: accounts[9], gasPrice: 60000000000, gas: 400000 });
            instance.transfer(accounts[4], 1000000, { from: accounts[9], gasPrice: 60000000000, gas: 400000 });
        }));

    it("*** transferMulti success 1: transfer values to multiple accounts", () => {
        let accs = [accounts[5], accounts[6], accounts[7]];
        let values = [10, 20, 30];

        return Token.deployed()
        .then(instance => {
            instance.setMultiTransferSenderWalletAddress(accounts[3], true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
            instance.transferMulti(accs, values, { from: accounts[3], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
                console.log("transferMulti is successful");
                instance.balanceOf.call(accounts[5]).then(balance => assert.equal(balance.valueOf(), 10, "10 wasn't in the account"));
                instance.balanceOf.call(accounts[6]).then(balance => assert.equal(balance.valueOf(), 20, "20 wasn't in the account"));
                instance.balanceOf.call(accounts[7]).then(balance => assert.equal(balance.valueOf(), 30, "30 wasn't in the account"));
            });
        });
    
    it("*** transferMulti success 2: transfer values to multiple accounts when sender is on the limitedReceiverWallet", () => {
        let accs = [accounts[5], accounts[6], accounts[7]];
        let values = [10, 20, 30];

        return Token.deployed()
        .then(instance => {
            instance.setLimitedWalletAddress(accounts[3], 2, true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 })
            instance.setMultiTransferSenderWalletAddress(accounts[3], true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
            instance.transferMulti(accs, values, { from: accounts[3], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => {
                console.log("transferMulti is successful");
                instance.balanceOf.call(accounts[5]).then(balance => assert.equal(balance.valueOf(), 20, "20 wasn't in the account"));
                instance.balanceOf.call(accounts[6]).then(balance => assert.equal(balance.valueOf(), 40, "40 wasn't in the account"));
                instance.balanceOf.call(accounts[7]).then(balance => assert.equal(balance.valueOf(), 60, "60 wasn't in the account"));
            });
        });

    it("*** transferMulti failure 1: wrong owner set multi transfer sender", () => {
        Token.deployed()
        .then(instance => 
              instance.setMultiTransferSenderWalletAddress(accounts[4], true, { from: accounts[5], gasPrice: 60000000000, gas: 400000 })
              .catch(function(e) {
                  assert.equal(true, e instanceof Error, "should be error");
                  console.log(e.message);
              }))
        });
    
    it("*** transferMulti failure 2: multi transfer sender is not on multiTransferSenderWallet list", () => {
        let accs = [accounts[5], accounts[6], accounts[7]];
        let values = [10, 20, 30];

        return Token.deployed()
        .then(instance => {
            instance.setLimitedWalletAddress(accounts[3], 2, false, { from: accounts[1], gasPrice: 60000000000, gas: 400000 })
            instance.setMultiTransferSenderWalletAddress(accounts[3], false, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => 
            instance.transferMulti(accs, values, { from: accounts[3], gasPrice: 60000000000, gas: 400000 })
            .catch(function(e) {
                  assert.equal(true, e instanceof Error, "should be error");
                  console.log(e.message);
            }));
        })
    
    it("*** transferMulti failure 3: transfer exceeded values to multiple accounts", () => {
        let accs = [accounts[5], accounts[6], accounts[7]];
        let values = [10, 20000000, 30];

        return Token.deployed()
        .then(instance => {
            instance.setMultiTransferSenderWalletAddress(accounts[4], true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => 
              instance.transferMulti(accs, values, { from: accounts[4], gasPrice: 60000000000, gas: 400000 })
              .catch(function(e) {
                  assert.equal(true, e instanceof Error, "should be error");
                  console.log(e.message);
              }))
        });
    
    it("*** transferMulti failure 4: setAllowTransfer is false", () => {
        let accs = [accounts[5], accounts[6], accounts[7]];
        let values = [10, 20, 30];

        return Token.deployed()
        .then(instance => {
            instance.setAllowTransfers(false, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            instance.setMultiTransferSenderWalletAddress(accounts[4], true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => 
            instance.transferMulti(accs, values, { from: accounts[4], gasPrice: 60000000000, gas: 400000 })
            .catch(function(e) {
                assert.equal(true, e instanceof Error, "should be error");
                console.log(e.message);
            }))
        });
    
    it("*** transferMulti failure 5: sender is on limitSenderWallet list", () => {
        let accs = [accounts[5], accounts[6], accounts[7]];
        let values = [10, 20, 30];

        return Token.deployed()
        .then(instance => {
            instance.setAllowTransfers(true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            instance.setLimitedWalletAddress(accounts[4], 1, true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 })
            instance.setMultiTransferSenderWalletAddress(accounts[4], true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
            return instance;
        }).then(instance => 
            instance.transferMulti(accs, values, { from: accounts[4], gasPrice: 60000000000, gas: 400000 })
            .catch(function(e) {
                assert.equal(true, e instanceof Error, "should be error");
                console.log(e.message);
            }))
        });
    
    it("*** transferMulti failure 6: receiver is on limitReceiverWallet list", () => {
        let accs = [accounts[5], accounts[6], accounts[7]];
        let values = [10, 20, 30];

        return Token.deployed()
        .then(instance => {
            instance.setLimitedWalletAddress(accounts[4], 1, false, { from: accounts[1], gasPrice: 60000000000, gas: 400000 })
            instance.setLimitedWalletAddress(accounts[6], 2, true, { from: accounts[1], gasPrice: 60000000000, gas: 400000 })
            return instance;
        }).then(instance => 
            instance.transferMulti(accs, values, { from: accounts[4], gasPrice: 60000000000, gas: 400000 })
            .catch(function(e) {
                assert.equal(true, e instanceof Error, "should be error");
                console.log(e.message);
            }))
        });
    
    after("$$$ unset token transfer limitation for an account by owner", () =>
        Token.deployed()
        .then(instance => {
            instance.setLimitedWalletAddress(accounts[6], 2, false, { from: accounts[1], gasPrice: 60000000000, gas: 400000 });
        }));
});
