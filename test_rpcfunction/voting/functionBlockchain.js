// =========================money and Token
ListDCBBoardB = {}
ListGOVBoardB = {}
DCBTokenB = {}
GOVTokenB = {}
MoB = {}
PrivateB = {}
PaymentB = {}

//============================== Board
//[votee] = amount
VoteDCBBoardAmountB = {}
//[votee][voter] = amount
VoteDCBBoardTableB = {}
VoteGOVBoardAmountB = {}
VoteGOVBoardTableB = {}
OldVoteDCBBoardTableB = {}
OldVoteGOVBoardTableB = {}
OldListDCBBoardB = {}
OldListGOVBoardB = {}

//==========================Proposal
//[proposalId] = amount
VoteDCBProposalAmountB = {}
//[voter] = proposalId
VoteDCBProposalTableB = {}
VoteGOVProposalAmountB = {}
VoteGOVProposalTableB = {}
DCBConstitutionB = {}
GOVConstitutionB = {}
ProposalTxIDB = {}
ProposalSubmitter = {}

var ncp = require('ncp').ncp;
ncp.limit = 16;
sourceDir = '/Users/retina_2015/go/src/github.com/constant-money/constant-chain/'

let rpcfunc = require("../../constant-rpc/constant_rpc");
let shard = new rpcfunc("127.0.0.1", 9334);
let assert = require('assert');
let cs = require('./votingBoard-profile');
let helper = require('./helper');
mode = "SHARD"

exports.setNewUser = async function(params) {
    let userName = params[0]
    let privateKey = params[1]
    let paymentAddress = params[2]
    global['PrivateB'][userName] = privateKey
    global['PaymentB'][userName] = paymentAddress
    global['MoB'][userName] = 0
    global['DCBTokenB'][userName] = 0
    global['GOVTokenB'][userName] = 0
    return true
}

exports.setVarValue = async function (params) {
    varType = params[0] + 'B'
    varName = params[1]
    value = params[2]
    global[varName][varName] = value
    return true
}

exports.checkSingleValue = async function (params) {
    varType = params[0] + 'B'
    varName = params[1]
    return global[varType][varName]
}

exports.checkAllValue = async function(params) {
    return [DCBListB , GOVListB , DCBTokenB, GOVTokenB, MoB , VoteProposalB , VoteBoardB , PrivateB , PaymentB]
}

exports.saveCheckpoint = async function (params) {
    dataDir = sourceDir + 'data'
    checkpointDir = sourceDir + 'checkpoint/'+ params[0]
    err = rimraf.sync(checkpointDir);
    x = await new Promise(function (resolve, reject) {
        ncp(dataDir, checkpointDir, function (err) {
            if (err) {
                console.log("savecheckpoint error")
                console.log(err);
                resolve(false)
            } else {
                console.log('done!');
                resolve(true)
            }
        });
    })
    return x
}

exports.loadCheckpoint = async function (params) {
    dataDir = sourceDir + 'data'
    checkpointDir = sourceDir + 'checkpoint/' + params[0]
    rimraf.sync(dataDir);
    console.log(dataDir)
    f = await new Promise(function (resolve, reject) {
        ncp(checkpointDir, dataDir, function (err) {
            if (err) {
                console.log("loadcheckpoint error")
                console.log(err);
                resolve(false)
            } else {
                console.log('done')
                resolve(true)
            }
        });
    })
    return f
}

GetTransactionByHash = async function (params) {
    console.log(params.TxID)
    return new Promise((resolve) => {
        var getResult = async () => {
            flagResponse = await shard.GetTransactionByHash(params.TxID);
            if ((flagResponse.Error == null) && (flagResponse.Response.Error == null)) {
                resolve(flagResponse.Response.Result)
            } else {
                setTimeout(() => {
                    console.log("Spamming until get transaction by hash");
                    getResult();
                }, 5000)
            }
        }
        getResult()
    })
}

exports.getNumberConstant = async function (params) {
    let rr = []
    for (let i = 0; i < params.length; i++) {
        let waitForResult = async () => {
            return new Promise((resolve) => {
                var getResult = async () => {
                    flagResponse = await shard.GetBalanceByPrivatekey(PrivateB[params[0]]);
                    if ((flagResponse !=null) && (flagResponse.Error == null) && (flagResponse.Response.Error == null)) {
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
        rr.push(res)
    }
    return  rr
}

SubmitTransaction = async function (params, fn) {
    console.log(params)
    let waitForResult = async () => {
        return new Promise((resolve) => {
            var getResult = async () => {

                flagResponse = await fn.call(shard, ...params);
                if ((flagResponse.Error == null) && (flagResponse.Response.Error == null)) {
                    resolve(flagResponse.Response.Result)
                } else {
                    setTimeout(() => {
                        console.log("Spamming until get transaction hash");
                        getResult();
                    }, 5000)
                }
            }
            getResult()
        })
    }
    let res = await waitForResult();
    await GetTransactionByHash(res)
}

exports.submitDCBProposal = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendSubmitDCBProposalTx)
    return true
}

exports.submitGOVProposal = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendSubmitGOVProposalTx)
    return true
}

exports.voteDCBProposal = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendVoteProposal)
    return true
}

exports.voteGOVProposal = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendVoteProposal)
    return true
}

exports.voteDCBBoard = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendVoteDCBBoardTransaction)
    return true
}

exports.VoteGOVBoard = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendVoteGOVBoardTransaction)
    return true
}

exports.getListDCBBoard = async function (params) {
    let res = await shard.GetListDCBBoard();
    console.log(res.Response.Result);
    return res.Response.Result
}

exports.getListGOVBoard = async function (params) {
    let res = await shard.GetListGOVBoard();
    console.log(res.Response.Result);
    return res.Response.Result
}
let currentDCBConstitutionIndex = 0;
let currentGOVConstitutionIndex = 0;
waitForNewConstitution = async function (params, fn) {
    let waitForResult = async () => {
        return new Promise((resolve) => {
            var getResult = async () => {
                flagResponse = await fn.call(shard, params);
                if ((flagResponse.Error == null) && (flagResponse.Response.Error == null) && ((flagResponse.Response.Result.ConstitutionInfo.ConstitutionIndex > currentConstitutionIndex))) {
                    resolve(flagResponse.Response.Result.ConstitutionInfo.ConstitutionIndex)
                } else {
                    setTimeout(() => {
                        console.log("Spamming until get transaction hash");
                        getResult();
                    }, 5000)
                }
            }
            getResult()
        })
    }
    return await waitForResult();
}

exports.waitForNewDCBConstitution = async function (params) {
    currentDCBConstitutionIndex = await waitForNewConstitution(params,shard.GetDCBConstitution)
    return true
}

exports.waitForNewGOVConstitution = async function (params) {
    currentGOVConstitutionIndex = await waitForNewConstitution(params,shard.GetGOVConstitution)
    return true
}

exports.sendMoney = async function (params) {
    let newParams = [PrivateB[params[0]], JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(PaymentB[params[1]], Number(params[2]))))),-1,-1]
    console.log(newParams)
    await SubmitTransaction(newParams, shard.CreateAndSendTransaction)
    return true
}

exports.sendDCBToken = async function (params) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaa")
    let txInfo = {
        "TokenID": cs.ID_DCB,
        "TokenName": "ABC",
        "TokenSymbol": "ABC",
        "TokenTxType": 1,
        "TokenAmount": 0,
        "TokenReceivers": JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(PaymentB[params[1]], Number(params[2]))))),
    }
    let newParams = [PrivateB[params[0]], null, -1, -1, txInfo]
    await SubmitTransaction(newParams, shard.CreateAndSendCustomTokenTransaction)
    return true
}

exports.sendGOVToken = async function (params) {
    let txInfo = {
        "TokenID": cs.ID_GOV,
        "TokenName": "ABC",
        "TokenSymbol": "ABC",
        "TokenTxType": 1,
        "TokenAmount": 0,
        "TokenReceivers": JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(PaymentB[params[1]], Number(params[2]))))),
    }
    let newParams = [PrivateB[params[0]], null, -1, -1, txInfo]
    await SubmitTransaction(newParams, shard.CreateAndSendCustomTokenTransaction)
    return true
}

