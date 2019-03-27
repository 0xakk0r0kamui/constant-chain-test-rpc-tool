// =========================money and Token
ListDCBBoardG = [];
ListGOVBoardG = [];
DCBTokenG = {};
GOVTokenG = {};
MoG = {};
PrivateG = {};
PaymentG = {};
PubkeyG = {};

//============================== Board
//[votee] = amount
VoteDCBBoardAmountG = {};
//[votee][voter] = amount
VoteDCBBoardTableG = {};
VoteGOVBoardAmountG = {};
VoteGOVBoardTableG = {};
OldVoteDCBBoardTableG = {};
OldVoteGOVBoardTableG = {};
OldListDCBBoardG = {};
OldListGOVBoardG = {};

//==========================Proposal
//[proposalId] = amount
VoteDCBProposalAmountG = {};
//[voter] = proposalId
VoteDCBProposalTableG = {};
VoteGOVProposalAmountG = {};
VoteGOVProposalTableG = {};
DCBConstitutionG = {};
GOVConstitutionG = {};
ProposalTxIDG = {};
ProposalSubmitterG = {};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.waitSeconds = async function(params) {
    await sleep(parseInt(params[0])*500);
    return true;
};

exports.setVarValue = async function(params) {
    let varType = params[0] + 'G';
    let varName = params[1];
    let value = params[2];
    global[varType][varName] = value;
    return true
};

exports.setNewUser = async function(params) {
    let userName = params[0];
    let privateKey = params[1];
    let paymentAddress = params[2];
    let pubkey = params[3];
    global['PrivateG'][userName] = privateKey;
    global['PaymentG'][userName] = paymentAddress;
    global['PubkeyG'][userName] = pubkey;
    global['MoG'][userName] = 0;
    global['DCBTokenG'][userName] = 0;
    global['GOVTokenG'][userName] = 0;
    return true
};

function GetAllState() {
    return [ListDCBBoardG,
             ListGOVBoardG,
             DCBTokenG,
             GOVTokenG,
             MoG,
             PrivateG,
             PaymentG,
             PubkeyG,
             VoteDCBBoardAmountG ,
             VoteDCBBoardTableG ,
             VoteGOVBoardAmountG ,
             VoteGOVBoardTableG,
             OldVoteDCBBoardTableG,
             OldVoteGOVBoardTableG,
             OldListDCBBoardG,
             OldListGOVBoardG,
             VoteDCBProposalAmountG,
             VoteDCBProposalTableG,
             VoteGOVProposalAmountG,
             VoteGOVProposalTableG,
             DCBConstitutionG,
             GOVConstitutionG,
             ProposalTxIDG,
             ProposalSubmitterG];
};

function SetAllState(value) {
    [ListDCBBoardG, ListGOVBoardG, DCBTokenG, GOVTokenG, MoG, PrivateG, PaymentG, PubkeyG, VoteDCBBoardAmountG , VoteDCBBoardTableG , VoteGOVBoardAmountG , VoteGOVBoardTableG, OldVoteDCBBoardTableG, OldVoteGOVBoardTableG, OldListDCBBoardG, OldListGOVBoardG, VoteDCBProposalAmountG, VoteDCBProposalTableG, VoteGOVProposalAmountG, VoteGOVProposalTableG, DCBConstitutionG, GOVConstitutionG, ProposalTxIDG, ProposalSubmitterG] = value;
    return true;
};

exports.checkAllValue = async function(params) {
    MoG['master'] = 0;
    DCBTokenG['master'] = 0;
    GOVTokenG['master'] = 0;
    // return MoG;
    return {
        'ListDCBBoard': ListDCBBoardG,
        'ListGOVBoard': ListGOVBoardG,
        'DCBToken': DCBTokenG,
        'GOVToken': GOVTokenG,
        'Mo': MoG,
        'Private': PrivateG,
        'Payment': PaymentG,
        'Pubkey': PubkeyG,
    }
};

exports.sendMoney = async function(params) {
    sender = params[0];
    receiver = params[1];
    amount = params[2];
    MoG[sender] -=  parseInt(amount);
    MoG[receiver] += parseInt(amount);
    return true;
};

exports.sendDCBToken = async function(params) {
    sender = params[0];
    receiver = params[1];
    amount = params[2];
    DCBTokenG[sender]-=  parseInt(amount);
    DCBTokenG[receiver] += parseInt(amount);
    return true
};

exports.sendGOVToken = async function(params) {
    sender = params[0];
    receiver = params[1];
    amount = params[2];
    GOVTokenG[sender]-=  parseInt(amount);
    GOVTokenG[receiver] += parseInt(amount);
    return true
};

exports.saveCheckpoint = async function(params) {
    let fileName = './' + params[0];
    var fs = require('fs');
    let res = JSON.stringify({
        'res': GetAllState()
    });
    fs.writeFileSync(fileName,res);
    return true
};

exports.loadCheckpoint = async function(params) {
    let fileName = params[0];
    if (fileName === 'c0') {
        console.log('c0');
        return true
    }
    var fs = require('fs');
    let res = JSON.parse(fs.readFileSync(fileName))['res'];
    SetAllState(res);
    return true
};

exports.getNumberConstant = async function(params) {
    let res = [];
    for (let i = 0; i< params.length; i++) {
        let t = MoG[params[i]];
        res.push(t);
    }
    return res
};

exports.getNumberDCBToken = async function(params) {
    let res = {};
    for (let i = 0; i< params.length; i++) {
        res[params[i]] = DCBTokenG[params[i]];
        console.log(params[i], res[params[i]]);
    }
    return res;
};

exports.getNumberGOVToken = async function(params) {
    let res = {};
    for (let i = 0; i< params.length; i++) {
        res[params[i]] = GOVTokenG[params[i]];
        console.log(params[i], res[params[i]]);
    }
    return res
};

exports.voteDCBBoard = async function(params) {
    let voter = params[0];
    let votee = params[1];
    let amount = parseInt(params[2]);
    if (VoteDCBBoardAmountG[votee] === undefined) {
        VoteDCBBoardAmountG[votee] = 0;
        VoteDCBBoardTableG[votee] = {};
    }
    VoteDCBBoardAmountG[votee] += amount;
    if (VoteDCBBoardTableG[votee][voter] === undefined) {
        VoteDCBBoardTableG[votee][voter] = 0;
    }
    VoteDCBBoardTableG[votee][voter] += amount;
    DCBTokenG[voter] -= amount;
    return true;
};

exports.voteGOVBoard = async function(params) {
    let voter = params[0];
    let votee = params[1];
    let amount = parseInt(params[2]);
    if (VoteGOVBoardAmountG[votee] === undefined) {
        VoteGOVBoardAmountG[votee] = 0;
        VoteGOVBoardTableG[votee] = {};
    }
    VoteGOVBoardAmountG[votee] += amount;
    if (VoteGOVBoardTableG[votee][voter] === undefined) {
        VoteGOVBoardTableG[votee][voter] = 0;
    }
    VoteGOVBoardTableG[votee][voter] += amount;
    GOVTokenG[voter] -= amount;
    return true
};

exports.getListDCBBoard = async function(params) {
    console.log(ListDCBBoardG);
    return ListDCBBoardG;
};

exports.getListDCBBoard = async function(params) {
    return ListGOVBoardG;
};

exports.submitDCBProposal = async function(params){
    let proposalName = params[0];
    let proposalParams = params[1];
    let submitter =  params[2];
    ProposalSubmitterG[proposalName] = submitter;
    return true
};

exports.submitGOVProposal = async function(params){
    let proposalName = params[0];
    let proposalParams = params[1];
    let submitter =  params[2];
    console.log(ProposalSubmitterG);
    ProposalSubmitterG[proposalName] = submitter;
    return true
};

exports.voteDCBProposal = async function(params) {
    let voter = params[0];
    let proposalName = params[1];

    let oldproposal =  VoteDCBProposalTableG[voter];
    if (oldproposal != undefined) {
        VoteDCBProposalAmountG[oldproposal] -= 1
    }
    if (VoteDCBProposalAmountG[proposalName] === undefined) {
        VoteDCBProposalAmountG[proposalName] = 0
    }
    VoteDCBProposalAmountG[proposalName] += 1;
    VoteDCBProposalTableG[voter] = proposalName;
    return true
}

exports.voteGOVProposal = async function(params) {
    let voter = params[0];
    let proposalName = params[1];

    let oldproposal =  VoteGOVProposalTableG[voter];
    if (oldproposal != null) {
        VoteGOVProposalAmountG[oldproposal] -= 1
    }
    VoteGOVProposalAmountG[proposalName] += 1;
    VoteGOVProposalTableG[voter] = proposalName;
    return true
};

exports.waitForNewDCBBoard = async function(params) {
    let DCBGovernorsLowerBound = 3;
    let DCBGovernorsUpperBound = 6;

    let list = Object.keys(VoteDCBBoardAmountG).map(function(key){
        return [key,VoteDCBBoardAmountG[key]]
    } );
    list.sort(function(fs, sc){
        return sc[1] - fs[1]
    });
    let lenList = list.length;
    if (lenList < DCBGovernorsLowerBound ){
        return true
    }
    //send token to vote fail
    let newBoard = list.slice(0,(Math.max(lenList, DCBGovernorsUpperBound)));
    SendBackTokenVoteDCBBoardFail(newBoard);
    //send Token to oldBoard
    SendBackTokenOldDCBBoard();
    // update new list board && Set value for old value
    OldListDCBBoardG = JSON.parse(JSON.stringify(ListDCBBoardG));
    ListDCBBoardG = newBoard.map(x => x[0]);
    OldVoteDCBBoardTableG = JSON.parse(JSON.stringify(VoteDCBBoardTableG));
    VoteDCBBoardTableG = {};
    VoteDCBBoardAmountG = {};
    return true
};

exports.waitForNewGOVBoard = async function(params) {
    let GOVGovernorsLowerBound = 3;
    let GOVGovernorsUpperBound = 6;

    let list = Object.keys(VoteGOVBoardAmountG).map(function(key){
        return [key,VoteGOVBoardAmountG[key]]
    } );
    list.sort(function(fs, sc){
        return sc[1] - fs[1]
    });
    let lenList = list.length;
    if (lenList < GOVGovernorsLowerBound ){
        return true
    }
    //send token to vote fail
    let newBoard = list.slice(0,(Math.max(lenList, GOVGovernorsUpperBound)));
    SendBackTokenVoteGOVBoardFail(newBoard);
    //send Token to oldBoard
    SendBackTokenOldGOVBoard();
    // update new list board && Set value for old value
    OldListGOVBoardG = JSON.parse(JSON.stringify(ListGOVBoardG));
    ListGOVBoardG = newBoard.map(x => x[0]);
    OldVoteGOVBoardTableG = JSON.parse(JSON.stringify(VoteGOVBoardTableG));
    VoteGOVBoardTableG = {};
    VoteGOVBoardAmountG = {};
    return true
};

exports.waitForNewDCBConstitution = async function (params) {
    let list = Object.keys(VoteDCBProposalAmountG).map(function (key) {
        return [key, VoteDCBProposalAmountG[key]]
    } );
    list.sort(function(fs, sc) {
        return sc[1] - fs[1]
    });
    if (list.length === 0 ){
        return true
    }
    DCBConstitutionG = list[0][0];

    let reward = GetReward();
    SendRewardSubmitter(reward*0.3, DCBConstitutionG);
    SendRewardDCBProposalVoterAndSupporter(reward*0.7, DCBConstitutionG);
    //reset table and amount vote
    VoteDCBProposalAmountG = {};
    VoteDCBProposalTableG = {};
    return true
};

exports.waitForNewGOVConstitution = async function (params) {
    let list = Object.keys(VoteGOVProposalAmountG).map(function (key) {
        return [key, VoteGOVProposalAmountG[key]]
    } );
    list.sort(function(fs, sc) {
        return sc[1] - fs[1]
    });
    GOVConstitutionG = list[0][0];
    let reward = GetReward();
    SendRewardSubmitter(reward*0.3, GOVConstitutionG);
    SendRewardGOVProposalVoterAndSupporter(reward*0.7, GOVConstitutionG);
    //reset table and amount vote
    VoteGOVProposalAmountG = {};
    VoteGOVProposalTableG = {};
    return true
};

exports.getDCBConstitution = async function(params) {
    return DCBConstitutionG
};

exports.getGOVConstitution = async function(params) {
    return GOVConstitutionG
};

function SendRewardSubmitter(reward, constitution) {
    let submitter = ProposalSubmitterG[constitution];
    MoG[submitter] += reward;
    return true
}

function SendRewardDCBProposalVoterAndSupporter(reward, constitution) {
    let list = Object.keys(VoteDCBProposalTableG).map(
        x => [x, VoteDCBProposalTableG[x]]
    );
    let voteForConstitution = list.filter(
        x => x[1] == constitution
    ).map(
        x => x[0]
    );
    rewardForEach = reward / voteForConstitution.length;
    for (let candidate in voteForConstitution) {
        Mob[candidate] += reward*0.3;
        let rewardForSupporter = reward*0.7;
        let list = OldVoteDCBBoardTableG[candidate];
        let listSupporter = Object.keys(list).map(x => [x,list[x]]);
        let SumAmountVote = OldVoteDCBBoardAmountG;
        for (let i = 0; i < listSupporter.length; i++) {
            let supporter = listSupporter[i];
            MoG[supporter[0]] += rewardForSupporter*supporter[1]/SumAmountVote
        }
    }
    return true
}

function SendRewardGOVProposalVoterAndSupporter(reward, constitution) {
    let list = Object.keys(VoteGOVProposalTableG).map(
        x => (x, VoteGOVProposalTableG[x])
    );
    let voteForConstitution = list.filter(
        x => x[1] === constitution
    ).map(
        x => x[0]
    );
    rewardForEach = reward / voteForConstitution.length;
    for (let candidate in voteForConstitution) {
        Mob[candidate] += reward*0.3;
        let rewardForSupporter = reward*0.7;
        let list = OldVoteGOVBoardTableG[candidate];
        let listSupporter = Object.keys(list).map(x => [x,list[x]]);
        let SumAmountVote = OldVoteGOVBoardAmountG;
        for (let i = 0; i < listSupporter.length; i++) {
            let supporter = listSupporter[i];
            MoG[supporter[0]] += rewardForSupporter*supporter[1]/SumAmountVote
        }
    }
    return true
}

function GetReward() {
    let baseReward = 10000;
    let coefficient = 1;
    return baseReward * coefficient
}

SendBackTokenVoteDCBBoardFail = function(newBoard) {
    let votees = Object.keys(VoteDCBBoardTableG);
    for (let votee in votees)  if (!(votee in newBoard )) {
        let voters = Object.keys(VoteDCBBoardTableG[voter]);
        for (let voter in voters){
            let amount = VoteDCBBoardTableG[votee][voter];
            DCBTokenG[voter] += amount
        }
    }
};

SendBackTokenOldDCBBoard = function() {
    let votees = Object.keys(OldVoteDCBBoardTableG);
    for (let votee in votees)  if (votee in OldListDCBBoardG){
        let voters = Object.keys(OldVoteDCBBoardTableG[votee]);
        for (let voter in voters){
            let amount = OldVoteDCBBoardTableG[votee][voter];
            DCBTokenG[voter] += amount
        }
    }
};

SendBackTokenVoteGOVBoardFail = function(newBoard) {
    let voters = Object.keys(VoteGOVBoardTableG);
    for (let voter in voters) {
        let votees = Object.keys(VoteGOVBoardTableG[voter]);
        for (let votee in votees) if (!(votee in newBoard )) {
            let amount = VoteGOVBoardTableG[voter][votee];
            GOVTokenG[voter] += amount
        }
    }
};

SendBackTokenOldGOVBoard = function() {
    let voters = Object.keys(OldVoteGOVBoardTableG);
    for (let voter in voters) {
        let votees = Object.keys(OldVoteGOVBoardTableG[voter]);
        for (let votee in votees) if (votee in OldListGOVBoardG){
            let amount = OldVoteGOVBoardTableG[voter][votee];
            GOVTokenG[voter] += amount
        }
    }
};
