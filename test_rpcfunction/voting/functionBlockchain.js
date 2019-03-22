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

var ncp = require('ncp').ncp;
ncp.limit = 16;
sourceDir = '/Users/retina_2015/go/src/github.com/constant-money/constant-chain/'

exports.test = async function(params) {
}

exports.setVarValue = async function(params) {
    varType = params[0] + 'B'
    varName = params[1]
    value = params[2]
    global[varName][varName] = value
    return true
}

exports.checkSingleValue = async function(params) {
    varType = params[0] + 'B'
    varName = params[1]
    return  global[varType][varName]
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

exports.GetNumberConstant = async function (params) {
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
exports.SubmitDCBProposal = async function (params) {
    for (let i = 0; i< params.length; i++) {
        let waitForResult = async () => {
            return new Promise((resolve) => {
                var getResult = async () => {
                    flagResponse = await shard.CreateAndSendSubmitDCBProposalTx(params);
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
    }
}