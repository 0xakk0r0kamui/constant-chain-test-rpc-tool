GGG = {'a': 4}
DCBListG = {}
GOVListG = {}
DCBTokenG = {}
GOVTokenG = {}
MoG = {}
VoteProposalG = {}
VoteBoardG = {}
PrivateG = {}
PaymentG = {}
ConstitutionG = {}
ProposalTxIDG = {}

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
j
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
    VoteBoard[votee] += amount
    DCBTokenG[voter] -= amount
}

exports.voteGOVBoard = async function(params) {
    let voter = params[0]
    let votee = params[1]
    let amount = params[2]
    VoteBoard[votee] += amount
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
}

exports.submitGOVProposal = async function(params){
    let proposalName = params[0]
    let proposalParams = params[1]
}

exports.waitForNewConstitution = async function (params) {

}

exports.waitForNewBoard = async function(params) {

}
