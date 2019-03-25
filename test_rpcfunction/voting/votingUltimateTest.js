let rpcfunc = require("../../constant-rpc/constant_rpc");
const fs = require('fs')
const rimraf = require('rimraf')

// todo subtract tx fee for each tx in ground truth @____@
/*
    checkSingleValue{
        input: typename varname
        output: value
    }
    checkAllValue{
        input:
        output: value
    }
    setNewUser {
        input: username privateKey paymentAddress
        SIDEEFFECT: change PrivateB/G[username]  PaymentB/G[username]
    }
    sendMoney {
        input: sender receiver
        SIDEEFFECT: change MoG[user]/ MoB[user]
    }
    sendDCBToken{
        input: user1 user2...
        SIDEEFFECT: change DCBG[user]/ DCBB[user]
    }
    sendGOVToken{
        input: user1 user2...
        SIDEEFFECT: change GOVG[user]/ GOVB[user]
    }
    saveCheckpoint {
        input: checkpointname
        output: true/false
    }
    loadCheckpoint{
        input: checkpointname
        output: true/false
    }
    getNumberConstant{
        input: user1 user2...
        output: res[]= [amountofuser1, amountofuser2,...]
        SIDEEFFECT: set MoB[user]
    }
    getNumberDCB/GOVToken{
        input: user1 user2...
        output: res[]= [amountofuser1, amountofuser2,...]
        SIDEEFFECT: set DCBBoardB/GOVBoardB[user]
    }
    voteDCB/GOVBoard {
        input: voter votee amount
        output: true/false
        SIDEEFFECT: VoteBoard[votee], DCBTokenB/GOVTokenB/DCBTokenG/GOVTokenG[voter]
    }
    getListDCB/GOVBoard{
        output: [payment1, payment2,...] //sort
        SIDEEFFECT: set DCB/GOVBoardB
    }
    submitDCB/GOVProposal {
        input: proposalname proposalparams submitter
    }
    voteDCB/GOVProposal {
        input: voter proposalname
        SIDEEFFECT: VoteProposal[proposal],
    }
    waitForNewDCB/GOVConstitution{
        SIDEEFFECT: set DCB/GOVTokenG[alluser], DCB/GOVConstitutionB/G
    }
    waitForNewDCB/GOVBoard{
        SIDEEFFECT: set DCB/GOVTokenG[alluser], ListDCB/GOVBoardB/G
    }
    getDCB/GOVConstitution{
        output: params
    }
*/


// let shard = new rpcfunc("192.168.0.143", 9334);
let shard = new rpcfunc("127.0.0.1", 9334);
let assert = require('assert');
let cs = require('./votingBoard-profile');
let helper = require('./helper');
mode = "SHARD"

blockchainFunc = require('./functionBlockchain');
groundTruthFunc = require('./groundTruthFunc');

describe('Test voting Board', async function () {
    let text
    text = fs.readFileSync("test1.txt",'utf8');
    text = text.split("\n");
    let i
    for (i = 0; i< text.length-2; i++) {
        (function(a){
             it('test' + a,async function () {
                 this.timeout(Number.MAX_SAFE_INTEGER);
                 let sttm = text[a].split(' ')
                 console.log(sttm)
                 let res =  await blockchainFunc[sttm[0]](sttm.slice(1))
                 let res2 =  await groundTruthFunc[sttm[0]](sttm.slice(1))

                 console.log(res + " zzz " + res2)
                 assert.ok(res == res2)
            });
        })(i);
    }
});
