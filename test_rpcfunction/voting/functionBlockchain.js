WWW = {}
exports.setVar = async function (params) {
    varName = params[0]
    value = params[1]
    WWW[varName] = value
    return true
}

exports.compare = async function compare(params) {
    varName = params[0]
    value = params[1]
    if (WWW[varName] == value) {
        return true
    }
    console.log("wrong value! Expect " + varName+ "="+ value+ " actual=" + WWW[varName])
    return false
}

async function saveCheckpoint(params) {
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

async function loadCheckpoint(params) {
    dataDir = sourceDir + 'data'
    checkpointDir = sourceDir + params[0]
    rimraf.sync(dataDir);
    console.log(dataDir)
    f = await new Promise( function(resolve, reject) {
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

async function GetNumberConstant(params) {
    for (let i = 0; i< params.length; i++){
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


