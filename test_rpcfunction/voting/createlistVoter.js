let cs = require('./votingBoard-profile');
let rpcfunc = require("../../constant-rpc/constant_rpc");
// let shard = new rpcfunc("192.168.0.143", 9334);
let shard = new rpcfunc("127.0.0.1", 9334);
let helper = require('./helper');
describe('Send money', async function () {
    let flagResponse = null;
    it('Send money to all my friends', async function(){
        this.timeout(Number.MAX_SAFE_INTEGER);
        for (let i=0;i<cs.VOTERS_PAYMENT.length; i++){
            let waitForResult = async () => {
                return new Promise((resolve) => {
                    var getResult = async () => {
                        console.log('Create transaction')
                        flagResponse = await shard.CreateAndSendTransaction(cs.SELF_SK,
                            JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(cs.VOTERS_PAYMENT[i], 100)))),
                            -1,-1);
                        if ((flagResponse.Error == null) && (flagResponse.Response.Error ==null)) {
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
            let txID = await waitForResult();
            txID = txID.TxID
            console.log("--------------------------------",txID);
        }
    });
    it('Send customtoken to all my friends', async function(){
        let tokenAmount = 100;
        this.timeout(Number.MAX_SAFE_INTEGER);
        for (let i=0;i<cs.VOTERS_PAYMENT.length; i++){
            let waitForResult = async () => {
                return new Promise((resolve) => {
                    var getResult = async () => {
                        console.log('Create transaction send custom token')
                        let txInfo = {
                            "TokenID": cs.ID_DCB,
                            "TokenName": "ABC",
                            "TokenSymbol": "ABC",
                            "TokenTxType": 1,
                            "TokenAmount": 0,
                            "TokenReceivers": JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(cs.VOTERS_PAYMENT[i], tokenAmount)))),
                        }
                        let flagResponse = await shard.CreateAndSendCustomTokenTransaction(cs.SELF_SK, null, -1, -1, txInfo)
                        if ((flagResponse.Error == null) && (flagResponse.Response.Result !=null)) {
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
            let txID = await waitForResult();
            console.log("--------------------------------",txID);
        }
    });
    it('Count',async function(){
        this.timeout(Number.MAX_SAFE_INTEGER);
        let currentBlockHeight = await shard.GetBlockCount(0);
        let waitForResult = async () => {
            return new Promise((resolve) => {
                var getResult = async () => {
                    flagResponse = await shard.GetBlockCount(0);
                    if (flagResponse.Response.Result - currentBlockHeight.Response.Result > 3) {
                        resolve(flagResponse.Response.Result);
                    } else {
                        setTimeout(async () => {
                            console.log("Still alive!")
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
    it('Save check point',async function(){
        this.timeout(Number.MAX_SAFE_INTEGER);
        flagResponse = await shard.SaveCheckPoint();
        console.log(flagResponse)
    });
});