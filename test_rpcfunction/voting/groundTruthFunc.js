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

exports.test = async function(params) {
    console.log(global)
    console.log(global['GGG']['a'])
}

exports.setVarValue = async function(params) {
    varType = params[0] + 'G'
    varName = params[1]
    value = params[2]
    global[varType][varName] = value
    return true
}

exports.checkSingleValue = async function(params) {
    varType = params[0] + 'G'
    varName = params[1]
    return  global[varType][varName]
}

exports.checkAllValue = async function(params) {
    return
}

exports.compare = async function(params) {
    varName = params[0]
    value = params[1]
    if (GGG[varName] == value) {
        return true
    }
    console.log("wrong value! Expect " + varName+ "="+ value+ " actual=" + WWW[varName])
    return false
}

exports.sendMoney = async function(params) {
    sender = params[0]
}

