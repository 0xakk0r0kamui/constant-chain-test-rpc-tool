// =========================money and Token
ListDCBBoardB = [];
ListGOVBoardB = [];
DCBTokenB = {};
GOVTokenB = {};
MoB = {};
PrivateB = {};
PaymentB = {};
PubkeyB = {};

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
ProposalSubmitterB = {};

var ncp = require('ncp').ncp;
ncp.limit = 16;
sourceDir = '/home/ag0st0/go/src/github.com/constant-money/constant-chain/'
var util = require('util');

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
    let pubkey = params[3];
    global['PrivateB'][userName] = privateKey;
    global['PaymentB'][userName] = paymentAddress;
    global['PubkeyB'][userName] = pubkey;
    global['MoB'][userName] = 0;
    global['DCBTokenB'][userName] = 0;
    global['GOVTokenB'][userName] = 0;
    return true
};

exports.checkAllValue = async function (params) {
    MoB['master'] = 0;
    DCBTokenB['master'] = 0;
    GOVTokenB['master'] = 0;
    return {
        'ListDCBBoard': ListDCBBoardB,
        'ListGOVBoard': ListGOVBoardB,
        'DCBToken': DCBTokenB,
        'GOVToken': GOVTokenB,
        'Mo': MoB,
        'Private': PrivateB,
        'Payment': PaymentB,
        'Pubkey': PubkeyB,
    }
}

function GetAllState() {
    return [ListDCBBoardB,
        ListGOVBoardB,
        DCBTokenB,
        GOVTokenB,
        MoB,
        PrivateB,
        PaymentB,
        PubkeyB,
        VoteDCBBoardAmountG,
        VoteDCBBoardTableG,
        VoteGOVBoardAmountG,
        VoteGOVBoardTableB,
        OldVoteDCBBoardTableB,
        OldVoteGOVBoardTableB,
        OldListDCBBoardB,
        OldListGOVBoardB,
        VoteDCBProposalAmountB,
        VoteDCBProposalTableB,
        VoteGOVProposalAmountB,
        VoteGOVProposalTableB,
        DCBConstitutionB,
        GOVConstitutionB,
        ProposalTxIDB,
        ProposalSubmitterB,
    ];
};

function SetAllState(value) {
    [
        ListDCBBoardB,
        ListGOVBoardB,
        DCBTokenB,
        GOVTokenB,
        MoB,
        PrivateB,
        PaymentB,
        PubkeyB,
        VoteDCBBoardAmountB,
        VoteDCBBoardTableB,
        VoteGOVBoardAmountB,
        VoteGOVBoardTableB,
        OldVoteDCBBoardTableB,
        OldVoteGOVBoardTableB,
        OldListDCBBoardB,
        OldListGOVBoardB,
        VoteDCBProposalAmountB,
        VoteDCBProposalTableB,
        VoteGOVProposalAmountB,
        VoteGOVProposalTableB,
        DCBConstitutionB,
        GOVConstitutionB,
        ProposalTxIDB,
        ProposalSubmitterG,
    ] = value;
    return true;
};
exports.saveCheckpoint = async function (params) {
    let dataDir = sourceDir + 'data';
    let checkpointDir = sourceDir + 'checkpoint/' + params[0];
    let err = rimraf.sync(checkpointDir);
    let x = await new Promise(function (resolve, reject) {
        ncp(dataDir, checkpointDir, function (err) {
            if (err) {
                console.log("savecheckpoint error");
                resolve(false)
            } else {
                console.log('done!');
                resolve(true)
            }
        });
    });
    if (x === false) {
        return false;
    }

    let fileName = sourceDir + 'checkpoint/W' + params[0];
    let fs = require('fs');
    let res = JSON.stringify({
        'res': GetAllState()
    });
    fs.writeFileSync(fileName, res);

    return true
};

exports.loadCheckpoint = async function (params) {
    let dataDir = sourceDir + 'data';
    let checkpointDir = sourceDir + 'checkpoint/' + params[0];
    rimraf.sync(dataDir);
    let f = await new Promise(function (resolve, reject) {
        ncp(checkpointDir, dataDir, function (err) {
            if (err) {
                console.log("loadcheckpoint error");
                console.log(err);
                resolve(false);
            } else {
                console.log('done');
                resolve(true);
            };
        });
    });
    if (f === false) {
        return false;
    }
    let fileName = sourceDir + 'checkpoint/W' + params[0];
    if (params[0] === 'c0') {
        console.log('c0');
        return true
    }
    let fs = require('fs');
    let res = JSON.parse(fs.readFileSync(fileName))['res'];
    SetAllState(res);
    console.log(res);
    return true
};

GetTransactionByHash = async function (params) {
    let newParams = null;
    if (params.TxID) {
        newParams = params.TxID;
    } else {
        newParams = params
    }
    return new Promise((resolve) => {
        let getResult = async () => {
            let flagResponse = await shard.GetTransactionByHash(newParams);
            if ((flagResponse !== null) && (flagResponse.Error === null) && (flagResponse.Response.Error === null)) {
                resolve(flagResponse.Response.Result)
            } else {
                setTimeout(() => {
                    console.log("Spamming until get transaction by hash");
                    getResult();
                }, 500)
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
                        }, 500)
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
                    }, 500)
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

function buildSubmitDCBProposalParams(proposalName, constitutionIndex, paymentAddress) {
    return util.format('{"DCBParams":{"TradeBonds":[],"ListSaleData":[],"MinLoanResponseRequire":0,"MinCMBApprovalRequire":0,"LateWithdrawResponseFine":0,"DividendAmount":0,"RaiseReserveData":{"0000000000000000000000000000000000000000000000000000000000000001":{"EndBlock":1000,"Amount":10}},"SpendReserveData":{"0000000000000000000000000000000000000000000000000000000000000001":{"EndBlock":1000,"ReserveMinPrice":100,"Amount":10}},"ListLoanParams":[{"InterestRate":0,"Maturity":0,"LiquidationStart":0}]},"ExecuteDuration":100,"Explanation":"%s","PaymentAddress":"%s","ConstitutionIndex":%s}', proposalName, paymentAddress, constitutionIndex);
}

function buildSubmitGOVProposalParams(proposalName, constitutionIndex, paymentAddress) {
    return util.format('{"GOVParams":{"SalaryPerTx":0,"BasicSalary":0,"FeePerKbTx":0,"SellingBonds":{"BondName":"duc","BondSymbol":"duc","TotalIssue":0,"BondsToSell":0,"BondPrice":0,"Maturity":0,"BuyBackPrice":0,"StartSellingAt":0,"SellingWithin":0},"RefundInfo":{"ThresholdToLargeTx":0,"RefundAmount":0},"OracleNetwork":{"OraclePubKeys":[],"WrongTimesAllowed":0,"Quorum":0,"AcceptableErrorMargin":0,"UpdateFrequency":0,"OracleRewardMultiplier":0},"SellingGOVTokens":{"TotalIssue":0,"GOVTokensToSell":0,"GOVTokenPrice":0,"StartSellingAt":0,"SellingWithin":0}},"ExecuteDuration":100,"Explanation":"%s","PaymentAddress":"%s","ConstitutionIndex":%s}', proposalName, paymentAddress, constitutionIndex);
}

exports.submitDCBProposal = async function (params) {
    let proposalName = params[0];
    let constitutionIndex = params[1];
    let submitter = params[2];
    let DCBParams = buildSubmitDCBProposalParams(proposalName, constitutionIndex, PaymentB[submitter]);

    ProposalSubmitterB[proposalName] = submitter;
    let newParams = [PrivateB[submitter], JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(cs.BURN_ADDR, 1)))), -1, -1, JSON.parse(DCBParams)];
    ProposalTxIDB[proposalName] = await SubmitTransaction(newParams, shard.CreateAndSendSubmitDCBProposalTx);
    return true
};

exports.submitGOVProposal = async function (params) {
    let proposalName = params[0];
    let constitutionIndex = params[1];
    let submitter = params[2];
    let GOVParams = buildSubmitGOVProposalParams(proposalName, constitutionIndex, PaymentB[submitter]);
    console.log(GOVParams);
    ProposalSubmitterB[proposalName] = submitter;
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
    let newParams = [PrivateB[params[0]], null, -1, -1, voteParams];
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
    await SubmitTransaction(newParams, shard.CreateAndSendVoteProposal);
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

function GetNameFromPubkey(pubkey) {
    let res = Object.keys(PubkeyB).map(
        x => [x, PubkeyB[x]]
    ).filter(
        x => x[1] === pubkey
    )[0]
    return res
}

function GetNameFromPayment(payment) {
    let res = Object.keys(PaymentB).map(
        x => [x, PaymentB[x]]
    ).filter(
        x => x[1] === payment
    );
    console.log(res);
    return res.map(
        x => x[0]
    )[0];
}

exports.getListDCBBoard = async function (params) {
    let waitForResult = async () => {
        return new Promise((resolve) => {
            var getResult = async () => {
                flagResponse = await shard.GetListDCBBoardPayment();
                if ((flagResponse !== null) && (flagResponse.Error === null) && (flagResponse.Response.Error === null)) {
                    resolve(flagResponse.Response.Result)
                } else {
                    setTimeout(() => {
                        console.log("Spamming until get transaction hash");
                        getResult();
                    }, 500)
                }
            };
            getResult()
        })
    };

    let res = await waitForResult();
    let name = res.map(
        x => GetNameFromPayment(x)
    ).sort();
    ListDCBBoardB = name;
    console.log(name);
    return name
};

exports.getListGOVBoard = async function (params) {
    let waitForResult = async () => {
        return new Promise((resolve) => {
            var getResult = async () => {
                flagResponse = await shard.GetListDCBBoardPayment();
                if ((flagResponse !== null) && (flagResponse.Error === null) && (flagResponse.Response.Error === null)) {
                    resolve(flagResponse.Response.Result)
                } else {
                    setTimeout(() => {
                        console.log("Spamming until get transaction hash");
                        getResult();
                    }, 500)
                }
            }
            getResult()
        })
    };

    let res = await waitForResult();
    let name = res.map(
        x => GetNameFromPayment(x)
    ).sort();
    ListGOVBoardB = name;
    return name
};

var currentDCBConstitutionIndex = 1;
var currentGOVConstitutionIndex = 1;
waitForNewConstitution = async function (params, fn, currentConstitutionIndex) {
    let waitForResult = async () => {
        return new Promise((resolve) => {
            var getResult = async () => {
                flagResponse = await fn.call(shard, params);
                console.log(flagResponse);
                if ((flagResponse.Error === null) && (flagResponse.Response.Error === null) && ((flagResponse.Response.Result.ConstitutionIndex > currentConstitutionIndex))) {
                    resolve(flagResponse.Response.Result.ConstitutionIndex)
                } else {
                    setTimeout(() => {
                        console.log("Spamming until get transaction hash");
                        getResult();
                    }, 500)
                }
            }
            getResult()
        })
    };
    return await waitForResult();
};

exports.getDCBConstitution = async function (params) {
    let res = await shard.GetDCBConstitution()
    let rr = (res) ? ((res.Error != null) ? (res.Error) : ((res.Response.Error != null) ? (res.Response.Error) : (res.Response.Result))) : null
    console.log(res);
    console.log(rr);
    return rr.Explanation
};

exports.getGOVConstitution = async function (params) {
    let res = await shard.GetGOVConstitution()
    let rr = (res) ? ((res.Error != null) ? (res.Error) : ((res.Response.Error != null) ? (res.Response.Error) : (res.Response.Result))) : null
    return rr.Explanation
};

exports.waitForNewDCBConstitution = async function (params) {
    console.log(currentDCBConstitutionIndex);
    currentDCBConstitutionIndex = await waitForNewConstitution(params, shard.GetDCBConstitution, currentDCBConstitutionIndex);
    console.log(currentDCBConstitutionIndex);
    return false
};

exports.waitForNewGOVConstitution = async function (params) {
    currentGOVConstitutionIndex = await waitForNewConstitution(params, shard.GetGOVConstitution, currentGOVConstitutionIndex);
    return true
};

exports.sendMoney = async function (params) {
    let newParams = [PrivateB[params[0]], JSON.parse(JSON.stringify(helper.strMapToObj(new Map().set(PaymentB[params[1]], Number(params[2]))))), 10, -1];
    await SubmitTransaction(newParams, shard.CreateAndSendTransaction);
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
    let newParams = [PrivateB[params[0]], null, 10, -1, txInfo];
    await SubmitTransaction(newParams, shard.CreateAndSendCustomTokenTransaction);
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
    let newParams = [PrivateB[params[0]], null, 10, -1, txInfo];
    await SubmitTransaction(newParams, shard.CreateAndSendCustomTokenTransaction);
    return true
};

exports.waitForNewDCBBoard = async function (params) {
    let tmp = ListDCBBoardB.slice();
    let tmp2 = tmp.slice();
    while (compareArrayAtomic(tmp, tmp2)) {
        tmp2 = await exports.getListDCBBoard(params);
        await sleep(200);
    }
    return true;
};

exports.waitForNewGOVBoard = async function (params) {
    let tmp = ListGOVBoardB.slice();
    console.log(tmp);
    let tmp2 = tmp.slice();
    while (compareArrayAtomic(tmp, tmp2)) {
        tmp2 = await exports.getListGOVBoard(params);
        console.log(tmp, 'wtffffff', tmp2);
        await sleep(200);
    }
    return true;
};

function compareArrayAtomic(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }
    return true
}


getNumberToken = async function (params, tokenID) {
    let Res = 0;
    let waitForResult = async () => {
        return new Promise((resolve) => {
            var getResult = async () => {
                let flagResponse = await shard.GetListCustomTokenBalance(params);
                if ((flagResponse !== null) && (flagResponse.Response !== undefined) && (flagResponse.Response.Result !== null) && (flagResponse.Error === null) && (flagResponse.Response.Error === null)) {
                    resolve(flagResponse.Response.Result)
                } else {
                    setTimeout(() => {
                        getResult();
                    }, 200)
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
};

exports.getNumberDCBToken = async function (params) {
    let res = {};
    console.log(PaymentB);
    for (let i = 0; i < params.length; i++) {
        res[params[i]] = await getNumberToken(PaymentB[params[i]], cs.ID_DCB);
        DCBTokenB[params[i]] = res[params[i]];
    }
    return res
};

exports.getNumberGOVToken = async function (params) {
    let res = {};
    for (let i = 0; i < params.length; i++) {
        res[params[i]] = await getNumberToken(PaymentB[params[i]], cs.ID_GOV)
        GOVTokenB[params[i]] = res[params[i]];
    }
    return res
};