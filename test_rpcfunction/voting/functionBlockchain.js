// =========================money and Token
ListDCBBoardB = {};
ListGOVBoardB = {};
DCBTokenB = {};
GOVTokenB = {};
MoB = {};
PrivateB = {};
PaymentB = {};

//============================== Board
//[votee] = amount
VoteDCBBoardAmountB = {};
//[votee][voter] = amount
VoteDCBBoardTableB = {};
VoteGOVBoardAmountB = {};
VoteGOVBoardTableB = {};
OldVoteDCBBoardTableB = {};
OldVoteGOVBoardTableB = {};
OldListDCBBoardB = {};
OldListGOVBoardB = {};

//==========================Proposal
//[proposalId] = amount
VoteDCBProposalAmountB = {};
//[voter] = proposalId
VoteDCBProposalTableB = {};
VoteGOVProposalAmountB = {};
VoteGOVProposalTableB = {};
DCBConstitutionB = {};
GOVConstitutionB = {};
ProposalTxIDB = {};
ProposalSubmitter = {};

var ncp = require('ncp').ncp;
ncp.limit = 16;
sourceDir = '/Users/retina_2015/go/src/github.com/constant-money/constant-chain/'

let rpcfunc = require("../../constant-rpc/constant_rpc");
let shard = new rpcfunc("127.0.0.1", 9334);
let assert = require('assert');
let cs = require('./votingBoard-profile');
let helper = require('./helper');
let rimraf = require('rimraf');
mode = "SHARD";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.waitSeconds = async function (params) {
    await sleep(parseInt(params[0]) * 500);
    return true
};

exports.setNewUser = async function (params) {
    let userName = params[0];
    let privateKey = params[1];
    let paymentAddress = params[2];
    global['PrivateB'][userName] = privateKey;
    global['PaymentB'][userName] = paymentAddress;
    global['MoB'][userName] = 0;
    global['DCBTokenB'][userName] = 0;
    global['GOVTokenB'][userName] = 0;
    return true
};

exports.checkAllValue = async function (params) {
    MoB['master'] = 0;
    return {
        'ListDCBBoard': ListDCBBoardB,
        'ListGOVBoard': ListGOVBoardB,
        'DCBToken': DCBTokenB,
        'GOVToken': GOVTokenB,
        'Mo': MoB,
        'Private': PrivateB,
        'Payment': PaymentB
    }
}

exports.saveCheckpoint = async function (params) {
    dataDir = sourceDir + 'data';
    checkpointDir = sourceDir + 'checkpoint/' + params[0];
    err = rimraf.sync(checkpointDir);
    x = await new Promise(function (resolve, reject) {
        ncp(dataDir, checkpointDir, function (err) {
            if (err) {
                console.log("savecheckpoint error");
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
    checkpointDir = sourceDir + 'checkpoint/' + params[0];
    rimraf.sync(dataDir);
    console.log(dataDir);
    f = await new Promise(function (resolve, reject) {
        ncp(checkpointDir, dataDir, function (err) {
            if (err) {
                console.log("loadcheckpoint error");
                console.log(err);
                resolve(false)
            } else {
                console.log('done');
                resolve(true)
            }
        });
    });
    return f
};

GetTransactionByHash = async function (params) {
    let newParams = null;
    if (params.TxID) {
        newParams = params.TxID;
    } else {
        newParams = params
    }
    return new Promise((resolve) => {
        var getResult = async () => {
            flagResponse = await shard.GetTransactionByHash(newParams);
            if ((flagResponse !== null) && (flagResponse.Error === null) && (flagResponse.Response.Error === null)) {
                resolve(flagResponse.Response.Result)
            } else {
                setTimeout(() => {
                    console.log("Spamming until get transaction by hash");
                    getResult();
                }, 5000)
            }
        };
        getResult()
    })
};

exports.getNumberConstant = async function (params) {
    let rr = [];
    for (let i = 0; i < params.length; i++) {
        let waitForResult = async () => {
            return new Promise((resolve) => {
                var getResult = async () => {
                    flagResponse = await shard.GetBalanceByPrivatekey(PrivateB[params[i]]);
                    if ((flagResponse !== null) && (flagResponse.Error === null) && (flagResponse.Response.Error === null)) {
                        resolve(flagResponse.Response.Result)
                    } else {
                        setTimeout(() => {
                            getResult();
                        }, 3000)
                    }
                };
                getResult()
            })
        };
        let res = await waitForResult();
        MoB[params[i]] = res;
        console.log("Account ", params[i], ": ", res);
        assert.ok(res >= 0, "Balance cannot less than zero");
        rr.push(res)
    }
    return rr
}

SubmitTransaction = async function (params, fn) {
    let waitForResult = async () => {
        return new Promise((resolve) => {
            var getResult = async () => {
                flagResponse = await fn.call(shard, ...params);
                if ((flagResponse !== undefined) && (flagResponse.Error === null) && (flagResponse.Response.Error === null)) {
                    resolve(flagResponse.Response.Result)
                } else {
                    setTimeout(() => {
                        console.log("Spamming until get transaction hash");
                        getResult();
                    }, 5000)
                }
            };
            getResult()
        })
    };
    let res = await waitForResult();
    await GetTransactionByHash(res)
    if (res.TxID) {
        return res.TxID;
    } else {
        return res
    }
};

function buildSubmitDCBProposalParams(constitutionIndex, paymentAddress) {
    return utils.format('{"GOVParams":{"SalaryPerTx":0,"BasicSalary":0,"FeePerKbTx":0,"SellingBonds":{"BondName":"duc","BondSymbol":"duc","TotalIssue":0,"BondsToSell":0,"BondPrice":0,"Maturity":0,"BuyBackPrice":0,"StartSellingAt":0,"SellingWithin":0},"RefundInfo":{"ThresholdToLargeTx":0,"RefundAmount":0},"OracleNetwork":{"OraclePubKeys":[],"WrongTimesAllowed":0,"Quorum":0,"AcceptableErrorMargin":0,"UpdateFrequency":0,"OracleRewardMultiplier":0},"SellingGOVTokens":{"TotalIssue":0,"GOVTokensToSell":0,"GOVTokenPrice":0,"StartSellingAt":0,"SellingWithin":0}},"ExecuteDuration":100,"Explanation":"","PaymentAddress":"%s","ConstitutionIndex":%s}', paymentAddress, constitutionIndex)
}

function buildSubmitGOVProposalParams(constitutionIndex, paymentAddress) {
    return utils.format('{"DCBParams":{"ListSaleData":[{"SaleID":"0000000000000000000000000000000000000000000000000000000000000000","EndBlock":1000,"BuyingAsset":"601b465a22f872cc50ae1f0c8ed84a78de3d649ffc784fc10000000000000000","BuyingAmount":100,"DefaultBuyPrice":100,"SellingAsset":"0000000000000000000000000000000000000000000000000000000000000004","SellingAmount":150,"DefaultSellPrice":100},{"SaleID":"0000000000000000000000000000000000000000000000000000000000000000","EndBlock":2000,"BuyingAsset":"0000000000000000000000000000000000000000000000000000000000000004","BuyingAmount":250,"DefaultBuyPrice":100,"SellingAsset":"601b465a22f872cc50ae1f0c8ed84a78de3d649ffc784fc10000000000000000","SellingAmount":200,"DefaultSellPrice":100}],"MinLoanResponseRequire":0,"MinCMBApprovalRequire":0,"LateWithdrawResponseFine":0,"DividendAmount":0,"RaiseReserveData":{"0000000000000000000000000000000000000000000000000000000000000001":{"EndBlock":1000,"Amount":10}},"SpendReserveData":{"0000000000000000000000000000000000000000000000000000000000000001":{"EndBlock":1000,"ReserveMinPrice":100,"Amount":10}},"ListLoanParams":[{"InterestRate":0,"Maturity":0,"LiquidationStart":0}]},"ExecuteDuration":100,"Explanation":"","PaymentAddress":"%s","ConstitutionIndex":%s}', constitutionIndex, paymentAddress)
}

exports.submitDCBProposal = async function (params) {
    let proposalName = params[0];
    let constitutionIndex = parseInt(params[1]);
    let paymentAddress = PaymentB[params[2]];
    let submitter = params[3];
    let DCBParams = buildSubmitDCBProposalParams(constitutionIndex, paymentAddress);
    ProposalSubmitter[proposalName] = submitter;
    let newParams = [PrivateB[submitter], JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(cs.BURN_ADDR, 1)))), -1, -1, JSON.parse(DCBParams)];
    ProposalTxIDB[proposalName] = await SubmitTransaction(newParams, shard.CreateAndSendSubmitDCBProposalTx);
    return true
};

exports.submitGOVProposal = async function (params) {
    let proposalName = params[0];
    let constitutionIndex = parseInt(params[1]);
    let paymentAddress = PaymentB[params[2]];
    let submitter = params[3];
    let GOVParams = buildSubmitGOVProposalParams(constitutionIndex, paymentAddress);
    ProposalSubmitter[proposalName] = submitter;
    let newParams = [PrivateB[submitter], JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(cs.BURN_ADDR, 1)))), -1, -1, JSON.parse(GOVParams)];
    ProposalTxIDB[proposalName] = await SubmitTransaction(newParams, shard.CreateAndSendSubmitGOVProposalTx);
    return true
};

exports.voteDCBProposal = async function (params) {
    let voteParams = {
        "BoardType": "dcb",
        "VoteProposalData": {
            "ProposalTxID": ProposalTxIDB[params[1]],
            "ConstitutionIndex": 1,
            "VoterPayment": PaymentB[params[0]]
        }
    };
    let newParams = [PrivateB[params[0]], null, -1, -1, voteParams]
    await SubmitTransaction(newParams, shard.CreateAndSendVoteProposal);
    return true
};

exports.voteGOVProposal = async function (params) {
    let voteParams = {
        "BoardType": "gov",
        "VoteProposalData": {
            "ProposalTxID": ProposalTxIDB[param[1]],
            "ConstitutionIndex": 1,
            "VoterPayment": PaymentB[params[0]]
        }
    };
    let newParams = [PrivateB[params[0]], null, -1, -1, voteParams]
    await SubmitTransaction(params, shard.CreateAndSendVoteProposal);
    return true
};

exports.voteDCBBoard = async function (params) {
    let voteInfo = {
        "TokenAmount": 0,
        "TokenID": cs.ID_DCB,
        "TokenName": "",
        "TokenReceivers": JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(cs.BURN_ADDR, Number(params[2]))))),
        "TokenSymbol": "",
        "TokenTxType": 1,
        "PaymentAddress": PaymentB[params[1]],
        "BoardIndex": 1
    }
    let newParams = [PrivateB[params[0]], null, -1, -1, voteInfo]
    await SubmitTransaction(newParams, shard.CreateAndSendVoteDCBBoardTransaction)
    return true
};

exports.voteGOVBoard = async function (params) {
    let voteInfo = {
        "TokenAmount": 0,
        "TokenID": cs.ID_GOV,
        "TokenName": "",
        "TokenReceivers": JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(cs.BURN_ADDR, Number(params[2]))))),
        "TokenSymbol": "",
        "TokenTxType": 1,
        "PaymentAddress": PaymentB[params[1]],
        "BoardIndex": 1
    }
    let newParams = [PrivateB[params[0]], null, -1, -1, voteInfo]
    await SubmitTransaction(newParams, shard.CreateAndSendVoteGOVBoardTransaction)
    return true
};

function GetNameFromPayment(payment) {
    let res = Object.keys(PaymentB).map(
        x => [x, PaymentB[x]]
    ).filter(
        x => x[1] === payment
    )[0]
    return res
}

exports.getListDCBBoard = async function (params) {
    let res = await shard.GetListDCBBoard();
    console.log(res.Response.Result);
    let name = res.map(
        x => GetNameFromPayment(x)
    );
    ListDCBBoardB = name;
    return name
};

exports.getListGOVBoard = async function (params) {
    let res = await shard.GetListGOVBoard();
    console.log(res.Response.Result);
    let name = res.map(
        x => GetNameFromPayment(x)
    );
    ListGOVBoardB = name;
    return name
};

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
    };
    return await waitForResult();
};

exports.getDCBConstitution = async function (params) {
    let res = await shard.GetDCBConstitution()
    return (res) ? ((res.Error != null) ? (res.Error) : ((res.Response.Error != null) ? (res.Response.Error) : (res.Response.Result))) : null
};

exports.getGOVConstitution = async function (params) {
    let res = await shard.GetGOVConstitution()
    return (res) ? ((res.Error != null) ? (res.Error) : ((res.Response.Error != null) ? (res.Response.Error) : (res.Response.Result))) : null
};

exports.waitForNewDCBConstitution = async function (params) {
    currentDCBConstitutionIndex = await waitForNewConstitution(params, shard.GetDCBConstitution);
    return true
};

exports.waitForNewGOVConstitution = async function (params) {
    currentGOVConstitutionIndex = await waitForNewConstitution(params, shard.GetGOVConstitution);
    return true
};

exports.sendMoney = async function (params) {
    let newParams = [PrivateB[params[0]], JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(PaymentB[params[1]], Number(params[2]))))), -1, -1]
    await SubmitTransaction(newParams, shard.CreateAndSendTransaction)
    return true
}

exports.sendDCBToken = async function (params) {
    let txInfo = {
        "TokenID": cs.ID_DCB,
        "TokenName": "ABC",
        "TokenSymbol": "ABC",
        "TokenTxType": 1,
        "TokenAmount": 0,
        "TokenReceivers": JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(PaymentB[params[1]], Number(params[2]))))),
    };
    let newParams = [PrivateB[params[0]], null, -1, -1, txInfo]
    await SubmitTransaction(newParams, shard.CreateAndSendCustomTokenTransaction)
    return true
};

exports.sendGOVToken = async function (params) {
    let txInfo = {
        "TokenID": cs.ID_GOV,
        "TokenName": "ABC",
        "TokenSymbol": "ABC",
        "TokenTxType": 1,
        "TokenAmount": 0,
        "TokenReceivers": JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(PaymentB[params[1]], Number(params[2]))))),
    };
    let newParams = [PrivateB[params[0]], null, -1, -1, txInfo];
    await SubmitTransaction(newParams, shard.CreateAndSendCustomTokenTransaction);
    return true
};

exports.waitForNewDCBBoard = async function (params) {
    while (ListDCBBoardB != await exports.getListDCBBoard(params)) {}
}

exports.waitForNewGOVBoard = async function (params) {
    while (ListDCBBoardB != await exports.getListGOVBoard(params)) {}
}

getNumberToken = async function (params, tokenID) {
    let Res = 0;
    let waitForResult = async () => {
        return new Promise((resolve) => {
            var getResult = async () => {
                let flagResponse = await shard.GetListCustomTokenBalance(params);
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
        if (customToken.TokenID == tokenID) {
            Res = customToken.Amount;
        }
    });
    return Res
}

exports.getNumberDCBToken = async function (params) {
    return await getNumberToken(params[0], cs.ID_DCB)
}

exports.getNumberGOVToken = async function (params) {
    return await getNumberToken(params[0], cs.ID_GOV)
}