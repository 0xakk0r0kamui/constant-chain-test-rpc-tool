
GGG = {}
DCBG = {}
DCB = {}
MoG = {}
VoteProposalG = {}
VoteBoardG = {}

exports.setVar = async function setVar(params) {
    varName = params[0]
    value = params[1]
    GGG[varName] = value
    return true
}

exports.compare = async function compare(params) {
    varName = params[0]
    value = params[1]
    if (GGG[varName] == value) {
        return true
    }
    console.log("wrong value! Expect " + varName+ "="+ value+ " actual=" + WWW[varName])
    return false
}

