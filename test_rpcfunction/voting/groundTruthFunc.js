// =========================money and Token
ListDCBBoardG = {}
ListGOVBoardG = {}
DCBTokenG = {}
GOVTokenG = {}
MoG = {}
PrivateG = {}
PaymentG = {}

//============================== Board
//[votee] = amount
VoteDCBBoardAmountG = {}
//[votee][voter] = amount
VoteDCBBoardTableG = {}
VoteGOVBoardAmountG = {}
VoteGOVBoardTableG = {}
OldVoteDCBBoardTableG = {}
OldVoteGOVBoardTableG = {}
OldListDCBBoardG = {}
OldListGOVBoardG = {}

//==========================Proposal
//[proposalId] = amount
VoteDCBProposalAmountG = {}
//[voter] = proposalId
VoteDCBProposalTableG = {}
VoteGOVProposalAmountG = {}
VoteGOVProposalTableG = {}
DCBConstitutionG = {}
GOVConstitutionG = {}
ProposalTxIDG = {}
ProposalSubmitter = {}


exports.test = async function(params) {
    console.log(global)
    console.log(global['GGG']['a'])
}

exports.setVarValue = async function(params) {
    let varType = params[0] + 'G'
    let varName = params[1]
    let value = params[2]
    global[varType][varName] = value
    return true
}

exports.setNewUser = async function(params) {
    let userName = params[0]
    let privateKey = params[1]
    let paymentAddress = params[2]
    global[PrivateG][userName] = privateKey
    global[PaymentG][userName] = paymentAddress
    return true
}

exports.checkSingleValue = async function(params) {
    varType = params[0] + 'G'
    varName = params[1]
    return  global[varType][varName]
}

function GetAllState() {
    return [DCBListG , GOVListG , DCBTokenG , GOVTokenG , MoG , VoteProposalG , VoteBoardG , PrivateG , PaymentG]
}

function SetAllState() {

}

exports.checkAllValue = async function(params) {
    return GetAllState()
}

exports.sendMoney = async function(params) {
    sender = params[0]
    receiver = params[1]
    amount = params[2]
    MoG[sender]-=  amount
    MoG[receiver] += amount
}

exports.sendDCBToken = async function(params) {
    sender = params[0]
    receiver = params[1]
    amount = params[2]
    DCBTokenG[sender]-=  amount
    DCBTokenG[receiver] += amount
}

exports.sendGOVToken = async function(params) {
    sender = params[0]
    receiver = params[1]
    amount = params[2]
    GOVTokenG[sender]-=  amount
    GOVTokenG[receiver] += amount
}

exports.saveCheckpoint = async function(params) {
    let fileName = params[0]
    var fs = require('fs')
    fs.writeFileSync(fileName, GetAllState())
    return true
}

exports.loadCheckpoint = async function(params) {
    let fileName = params[0]
    var fs = require('fs')
    res = fs.readFileSync(fileName)
    SetAllState(res)
    return true
}

exports.getNumberOfConstant = async function(params) {
    res = {}
    for (let i = 0; i< params.length; i++) {
        res[params[i]] = global[MoG][params[i]]
    }
    return res
}

exports.getNumberOfDCBToken = async function(params) {
    res = {}
    for (let i = 0; i< params.length; i++) {
        res[params[i]] = global[DCBTokenG][params[i]]
    }
    return res
}

exports.getNumberOfGOVToken = async function(params) {
    res = {}
    for (let i = 0; i< params.length; i++) {
        res[params[i]] = global[GOVTokenG][params[i]]
    }
    return res
}

exports.voteDCBBoard = async function(params) {
    let voter = params[0]
    let votee = params[1]
    let amount = params[2]
    VoteDCBBoardAmountG[votee] += amount
    VoteDCBBoardTableG[votee][voter] += amount
    DCBTokenG[voter] -= amount
}

exports.voteGOVBoard = async function(params) {
    let voter = params[0]
    let votee = params[1]
    let amount = params[2]
    VoteGOVBoardAmountG[votee] += amount
    VoteGOVBoardTableG[votee][voter] += amount
    GOVTokenG[voter] -= amount
}

exports.getListDCBBoard = async function(params) {
    return DCBListG
}

exports.getListDCBBoard = async function(params) {
    return GOVListG
}

exports.submitDCBProposal = async function(params){
    let proposalName = params[0]
    let proposalParams = params[1]
    let submitter =  params[2]
    ProposalSubmitter[proposalName] = submitter
}

exports.submitGOVProposal = async function(params){
    let proposalName = params[0]
    let proposalParams = params[1]
    let submitter =  params[2]
    ProposalSubmitter[proposalName] = submitter
}

exports.voteDCBProposal = async function(params) {
    let voter = params[0]
    let proposalName = params[1]

    let oldproposal =  VoteDCBProposalTableG[voter]
    if (oldproposal != null) {
        VoteDCBProposalAmountG[oldproposal] -= 1
    }
    VoteDCBProposalAmountG[proposalName] += 1
    VoteDCBProposalTableG[voter] = proposalName
}

exports.voteGOVProposal = async function(params) {
    let voter = params[0]
    let proposalName = params[1]

    let oldproposal =  VoteGOVProposalTableG[voter]
    if (oldproposal != null) {
        VoteGOVProposalAmountG[oldproposal] -= 1
    }
    VoteGOVProposalAmountG[proposalName] += 1
    VoteGOVProposalTableG[voter] = proposalName
}

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
    ListDCBBoardG = newBoard.map(newBoard.map(x => x[0]));
    OldVoteDCBBoardTableG = JSON.parse(JSON.stringify(VoteDCBBoardTableG));
    VoteDCBBoardTableG = {}
    VoteDCBBoardAmountG = {}
}

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
    ListGOVBoardG = newBoard.map(newBoard.map(x => x[0]));
    OldVoteGOVBoardTableG = JSON.parse(JSON.stringify(VoteGOVBoardTableG));
    VoteGOVBoardTableG = {}
    VoteGOVBoardAmountG = {}
}

exports.waitForNewDCBConstitution = async function (params) {
    let list = Object.keys(VoteDCBProposalAmountG).map(function (key) {
        return [key, VoteDCBProposalAmountG[key]]
    } );
    list.sort(function(fs, sc) {
        return sc[1] - fs[1]
    });
    DCBConstitutionG = list[0][0]
    let reward = GetReward()
    SendRewardSubmitter(reward*0.3, DCBConstitutionG)
    SendRewardDCBProposalVoterAndSupporter(reward*0.7, DCBConstitutionG)
    //reset table and amount vote
    VoteDCBProposalAmountG = {}
    VoteDCBProposalTableG = {}
};

exports.waitForNewGOVConstitution = async function (params) {
    let list = Object.keys(VoteGOVProposalAmountG).map(function (key) {
        return [key, VoteGOVProposalAmountG[key]]
    } );
    list.sort(function(fs, sc) {
        return sc[1] - fs[1]
    });
    GOVConstitutionG = list[0][0]
    let reward = GetReward()
    SendRewardSubmitter(reward*0.3, GOVConstitutionG)
    SendRewardGOVProposalVoterAndSupporter(reward*0.7, GOVConstitutionG)
    //reset table and amount vote
    VoteGOVProposalAmountG = {}
    VoteGOVProposalTableG = {}
};

function SendRewardSubmitter(reward, constitution) {
    let submitter = ProposalSubmitter[constitution];
    MoG[submitter] += reward
}

function SendRewardDCBProposalVoterAndSupporter(reward, constitution) {
    let list = Object.keys(VoteDCBProposalTableG).map(
        x => (x, VoteDCBProposalTableG[x])
    );
    let voteForConstitution = list.filter(
        x => x[1] == constitution
    ).map(
        x => x[0]
    );
    rewardForEach = reward / voteForConstitution.length;
    for (let candidate in voteForConstitution) {
        Mob[candidate] += reward*0.3
        let rewardForSupporter = reward*0.7
        let list = OldVoteDCBBoardTableG[candidate];
        let listSupporter = Object.keys(list).map(x => [x,list[x]]);
        let SumAmountVote = OldVoteDCBBoardAmountG;
        for (let i = 0; i < listSupporter.length; i++) {
            let supporter = listSupporter[i]
            MoG[supporter[0]] += rewardForSupporter*supporter[1]/SumAmountVote
        }
    }
}

function SendRewardGOVProposalVoterAndSupporter(reward, constitution) {
    let list = Object.keys(VoteGOVProposalTableG).map(
        x => (x, VoteGOVProposalTableG[x])
    );
    let voteForConstitution = list.filter(
        x => x[1] == constitution
    ).map(
        x => x[0]
    );
    rewardForEach = reward / voteForConstitution.length;
    for (let candidate in voteForConstitution) {
        Mob[candidate] += reward*0.3
        let rewardForSupporter = reward*0.7
        let list = OldVoteGOVBoardTableG[candidate];
        let listSupporter = Object.keys(list).map(x => [x,list[x]]);
        let SumAmountVote = OldVoteGOVBoardAmountG;
        for (let i = 0; i < listSupporter.length; i++) {
            let supporter = listSupporter[i]
            MoG[supporter[0]] += rewardForSupporter*supporter[1]/SumAmountVote
        }
    }
}

function GetReward() {
    let baseReward = 1000
    let coefficient = 1
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
}

SendBackTokenOldDCBBoard = function() {
    let votees = Object.keys(OldVoteDCBBoardTableG);
    for (let votee in votees)  if (votee in OldListDCBBoardG){
        let voters = Object.keys(OldVoteDCBBoardTableG[votee]);
        for (let voter in voters){
            let amount = OldVoteDCBBoardTableG[votee][voter];
            DCBTokenG[voter] += amount
        }
    }
}

SendBackTokenVoteGOVBoardFail = function(newBoard) {
    let voters = Object.keys(VoteGOVBoardTableG);
    for (let voter in voters) {
        let votees = Object.keys(VoteGOVBoardTableG[voter]);
        for (let votee in votees) if (!(votee in newBoard )) {
            let amount = VoteGOVBoardTableG[voter][votee];
            GOVTokenG[voter] += amount
        }
    }
}

SendBackTokenOldGOVBoard = function() {
    let voters = Object.keys(OldVoteGOVBoardTableG);
    for (let voter in voters) {
        let votees = Object.keys(OldVoteGOVBoardTableG[voter]);
        for (let votee in votees) if (votee in OldListGOVBoardG){
            let amount = OldVoteGOVBoardTableG[voter][votee];
            GOVTokenG[voter] += amount
        }
    }
}
