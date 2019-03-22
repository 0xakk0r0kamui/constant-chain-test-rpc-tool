let rpcfunc = require("../../constant-rpc/constant_rpc");
// let shard = new rpcfunc("192.168.0.143", 9334);
let shard = new rpcfunc("127.0.0.1", 9334);
let assert = require('assert');
let cs = require('./votingBoard-profile');
let helper = require('./helper');
mode = "SHARD"
describe('Test voting Board', async function () {
    let numberOfVoter = cs.VOTERS_SK.length;
    let flagResponse = null;
    let numberOfDCBToken = new Array(numberOfVoter);
    let numberOfConstant = new Array(numberOfVoter);
    // it.only('Get block height', async function () {
    //     this.timeout(Number.MAX_SAFE_INTEGER);
    //     flagResponse = await shard.GetBlockCount(0);
    //     console.log("Block count: ", flagResponse.Response.Result);
    // });
    // it('Load check point', async function(){
    //     this.timeout(Number.MAX_SAFE_INTEGER);
    //     flagResponse = await shard.LoadCheckPoint()
    //     console.log(flagResponse)
    // });
    it('Get number of Constant', async function () {
        this.timeout(Number.MAX_SAFE_INTEGER);
        for (let i = 0; i < numberOfVoter; i++) {
            let waitForResult = async () => {
                return new Promise((resolve) => {
                    var getResult = async () => {
                        flagResponse = await shard.GetBalanceByPrivatekey(cs.VOTERS_SK[i]);
                        if ((flagResponse.Error == null) && (flagResponse.Response.Error == null)) {
                            resolve(flagResponse.Response.Result)
                        } else {
                            setTimeout(() => {
                                getResult();
                            }, 3000)
                        }
                    }
                    getResult()
                })
            }
            let res = await waitForResult();
            console.log("Account ", i, ": ", res);
            assert.ok(res > 0, "Balance cannot less than zero");
            numberOfConstant[i] = res;
        }
    });
    it('Get number of Customtoken', async function () {
        this.timeout(Number.MAX_SAFE_INTEGER);
        for (let i = 0; i < numberOfVoter; i++) {
            let waitForResult = async () => {
                return new Promise((resolve) => {
                    var getResult = async () => {
                        flagResponse = await shard.GetListCustomTokenBalance(cs.VOTERS_PAYMENT[i]);
                        if ((flagResponse.Error == null) && (flagResponse.Response.Error == null)) {
                            resolve(flagResponse.Response.Result)
                        } else {
                            setTimeout(() => {
                                getResult();
                            }, 3000)
                        }
                    }
                    getResult()
                })
            }
            let res = await waitForResult();
            res.ListCustomTokenBalance.forEach(customToken => {
                if (customToken.TokenID == cs.ID_DCB) {
                    numberOfDCBToken[i] = customToken.Amount;
                }
            });
            if (numberOfDCBToken[i]) {
                console.log("Account ", i, ": ", numberOfDCBToken[i]);
            }
            assert.ok(numberOfDCBToken[i] != null, "Cannot find DCB token");
        }
    });
    it('Voting Board and return vote transaction', async function () {
        this.timeout(Number.MAX_SAFE_INTEGER);
        for (let j = 0; j < numberOfVoter; j++) {
            let voteAmount = 5;
            let voteInfo = {
                "TokenAmount": 0,
                "TokenID": cs.ID_DCB,
                "TokenName": "",
                "TokenReceivers": JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(cs.BURN_ADDR, voteAmount)))),
                "TokenSymbol": "",
                "TokenTxType": 1,
                "PaymentAddress": cs.VOTERS_PAYMENT[j%7],
                "BoardIndex": 1
            }
            let voteResponse = await shard.CreateAndSendVoteDCBBoardTransaction(cs.VOTERS_SK[j], null, -1, -1, voteInfo)
            console.log(voteResponse)
            assert.ok(voteResponse.Error == null, "Vote false, error:" + voteResponse.Error);
            console.log("Account ", j, " -> ", j%7, ". TxID: ", voteResponse.Response.Result)
            waitForResult = async () => {
                return new Promise((resolve) => {
                    var getResult = async () => {
                        flagResponse = await shard.GetTransactionByHash(voteResponse.Response.Result);
                        if (flagResponse.Response.Error == null) {
                            resolve(flagResponse.Response.Result)
                        } else {
                            setTimeout(() => {
                                getResult()
                            }, 3000)
                        }
                    }
                    getResult()
                })
            }
            if (j == numberOfVoter - 1) {
                res = await waitForResult();
            }
        }
        assert.ok(true)
    });
    it('Get number of Constant after voting', async function () {
        this.timeout(Number.MAX_SAFE_INTEGER);
        let resbool = true;
        for (let i = 0; i < numberOfVoter; i++) {
            let waitForResult = async () => {
                return new Promise((resolve) => {
                    var getResult = async () => {
                        flagResponse = await shard.GetBalanceByPrivatekey(cs.VOTERS_SK[i]);
                        if ((flagResponse.Error == null) && (flagResponse.Response.Error == null)) {
                            resolve(flagResponse.Response.Result)
                        } else {
                            setTimeout(() => {
                                getResult();
                            }, 3000)
                        }
                    }
                    getResult()
                })
            }
            let res = await waitForResult();
            if (res == numberOfConstant[i]) {
                resbool = false;
            }
            console.log("Account ", i, ": ", res);
        }
        assert.ok(resbool, "Why my value dont change dude?")
    });
    it('Get number of Customtoken after voting', async function () {
        this.timeout(Number.MAX_SAFE_INTEGER);
        for (let i = 0; i < numberOfVoter; i++) {
            let waitForResult = async () => {
                return new Promise((resolve) => {
                    var getResult = async () => {
                        flagResponse = await shard.GetListCustomTokenBalance(cs.VOTERS_PAYMENT[i]);
                        if ((flagResponse.Error == null) && (flagResponse.Response.Error == null)) {
                            resolve(flagResponse.Response.Result)
                        } else {
                            setTimeout(() => {
                                getResult();
                            }, 3000)
                        }
                    }
                    getResult()
                })
            }
            let res = await waitForResult();
            let tmpNumber = null;
            res.ListCustomTokenBalance.forEach(customToken => {
                if (customToken.TokenID == cs.ID_DCB) {
                    tmpNumber = customToken.Amount;
                }
            });
            if ((tmpNumber)) {
                assert.ok(tmpNumber < numberOfDCBToken[i], "Why my value dont change dude?")
            }
            if (numberOfDCBToken[i] != null) {
                console.log("Account ", i, ": ", numberOfDCBToken[i]);
            }
            assert.ok(numberOfDCBToken != null, "Cannot find DCB token");
        }
    });
    it('Get list board', async function () {
        this.timeout(Number.MAX_SAFE_INTEGER);
        let waitForResult = async () => {
            return new Promise((resolve) => {
                var getResult = async () => {
                    flagResponse = await shard.GetListDCBBoard();
                    console.log(flagResponse.Response.Result.length);
                    if ((flagResponse.Response.Error == null) && (flagResponse.Response.Result.length >1)) {
                        resolve(flagResponse.Response.Result);
                    } else {
                        setTimeout(async () => {
                            let countResponse = await shard.GetBlockCount(0);
                            console.log("Block count: ", countResponse.Response.Result, "; List Board still null");
                            getResult()
                        }, 3000)
                    }
                }
                getResult()
            })
        }
        let res = await waitForResult();
        console.log(res);
    });
    it('Count',async function(){
        this.timeout(Number.MAX_SAFE_INTEGER);
        let currentBlockHeight = await shard.GetBlockCount(0);
        let waitForResult = async () => {
            return new Promise((resolve) => {
                var getResult = async () => {
                    flagResponse = await shard.GetBlockCount(0);
                    if (flagResponse.Response.Result - currentBlockHeight.Response.Result > 6) {
                        resolve(flagResponse.Response.Result);
                    } else {
                        setTimeout(async () => {
                            console.log("Still alive")
                            getResult()
                        }, 3000)
                    }
                }
                getResult()
            })
        }
        let res = await waitForResult();
        console.log(res);
    });
    it('Voting Board and return vote transaction', async function () {
        this.timeout(Number.MAX_SAFE_INTEGER);
        let waitForResult = async () => {
            return new Promise((resolve) => {
                var getResult = async () => {
                    console.log('Check EncryptionFlag')
                    flagResponse = await shard.GetEncryptionFlag(["dcb"])
                    console.log(flagResponse)
                    if ((flagResponse.Error == null) && (flagResponse.Response.Result.DCBFlag == cs.DCBVotingFlag)) {
                        resolve(flagResponse.Response.Result)
                    } else {
                        setTimeout(() => {
                            console.log('re-call after 5s')
                            getResult()
                        }, 3000)
                    }
                }
                getResult()
            })
        }
        let res = await waitForResult();
        for (let j = 0; j < numberOfVoter; j++) {
            let voteAmount = 5;
            let voteInfo = {
                "TokenAmount": 0,
                "TokenID": cs.ID_DCB,
                "TokenName": "",
                "TokenReceivers": JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(cs.BURN_ADDR, voteAmount)))),
                "TokenSymbol": "",
                "TokenTxType": 1,
                "PaymentAddress": cs.VOTERS_PAYMENT[j%3],
                "BoardIndex": 1
            }
            let voteResponse = await shard.CreateAndSendVoteDCBBoardTransaction(cs.VOTERS_SK[j], null, -1, -1, voteInfo)
            assert.ok(voteResponse.Error == null, "Vote false, error:" + voteResponse.Error);
            console.log("Account ", j, " -> ", j%3, ". TxID: ", voteResponse.Response.Result)
            waitForResult = async () => {
                return new Promise((resolve) => {
                    var getResult = async () => {
                        flagResponse = await shard.GetTransactionByHash(voteResponse.Response.Result);
                        if (flagResponse.Response.Error == null) {
                            resolve(flagResponse.Response.Result)
                        } else {
                            setTimeout(() => {
                                getResult()
                            }, 3000)
                        }
                    }
                    getResult()
                })
            }
            if (j == numberOfVoter - 1) {
                res = await waitForResult();
            }
        }
        assert.ok(true)
    });
    it('Get list board', async function () {
        this.timeout(Number.MAX_SAFE_INTEGER);
        let waitForResult = async () => {
            return new Promise((resolve) => {
                var getResult = async () => {
                    flagResponse = await shard.GetListDCBBoard();
                    console.log(flagResponse.Response.Result.length);
                    if ((flagResponse.Response.Error == null) && (flagResponse.Response.Result.length >1)) {
                        resolve(flagResponse.Response.Result);
                    } else {
                        setTimeout(async () => {
                            let countResponse = await shard.GetBlockCount(0);
                            console.log("Block count: ", countResponse.Response.Result, "; List Board still null");
                            getResult()
                        }, 3000)
                    }
                }
                getResult()
            })
        }
        let res = await waitForResult();
        console.log(res);
    });
    it('Set list board', async function(){
        
    });
    after(function () {
        //require('./level1/votingProposal-test');
    });
});
