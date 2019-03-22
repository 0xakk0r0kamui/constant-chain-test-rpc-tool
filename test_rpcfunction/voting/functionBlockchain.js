BBB = {}
DCBListB = {}
GOVListB = {}
DCBTokenB = {}
GOVTokenB = {}
MoB = {}
VoteProposalB = {}
VoteBoardB = {}
PrivateB = {}
PaymentB = {}
ConstitutionB = {}
ProposalTxIDB = {}

var ncp = require('ncp').ncp;
ncp.limit = 16;
sourceDir = '/Users/retina_2015/go/src/github.com/constant-money/constant-chain/'

exports.test = async function (params) {}

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

exports.compare = async function (params) {
    varName = params[0]
    value = params[1]
    if (WWW[varName] == value) {
        return true
    }
    console.log("wrong value! Expect " + varName + "=" + value + " actual=" + WWW[varName])
    return false
}

exports.saveCheckpoint = async function (params) {
    dataDir = sourceDir + 'data'
    checkpointDir = sourceDir + params[0]
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
    checkpointDir = sourceDir + params[0]
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
    return new Promise((resolve) => {
        var getResult = async () => {
            flagResponse = await shard.GetTransactionByHash(params);
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
    for (let i = 0; i < params.length; i++) {
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
}

SubmitTransaction = async function (params, fn) {
    let waitForResult = async () => {
        return new Promise((resolve) => {
            var getResult = async () => {
                flagResponse = await fn(params);
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
}



exports.submitGOVProposal = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendSubmitGOVProposalTx)
}

exports.voteDCBProposal = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendVoteProposal)
}

exports.voteGOVProposal = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendVoteProposal)
}

exports.voteDCBBoard = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendVoteDCBBoardTransaction)
}

exports.VoteGOVBoard = async function (params) {
    await SubmitTransaction(params, shard.CreateAndSendVoteGOVBoardTransaction)
}

exports.getListDCBBoard = async function (params) {
    await SubmitTransaction(params, shard.GetListDCBBoard)
}

exports.getListDCBBoard = async function (params) {
    let res = await shard.GetListDCBBoard();
    console.log(res.Response.Result);
}

exports.getListGOVBoard = async function (params) {
    let res = await shard.GetListGOVBoard();
    console.log(res.Response.Result);
}
let currentDCBConstitutionIndex = 0;
let currentGOVConstitutionIndex = 0;
waitForNewConstitution = async function (params, fn) {
    let waitForResult = async () => {
        return new Promise((resolve) => {
            var getResult = async () => {
                flagResponse = await fn(params);
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
}
exports.waitForNewGOVConstitution = async function (params) {
    currentGOVConstitutionIndex = await waitForNewConstitution(params,shard.GetGOVConstitution)
}