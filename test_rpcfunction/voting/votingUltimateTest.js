let rpcfunc = require("../../constant-rpc/constant_rpc");
const fs = require('fs')
var ncp = require('ncp').ncp;
const rimraf = require('rimraf')
ncp.limit = 16;
sourceDir = '/Users/retina_2015/go/src/github.com/constant-money/constant-chain/'

/*
    sendMoney {
        input: user1 user2...
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
    setVar {
        input: varname value
        output: true/false
    }
    checkSingleValue{
        input: varname
        output: true/false
    }
    checkAllValue{
        input: none
        output: true/false
    }
    //res user1 user2 ...
    getNumberConstant{
        input: res user1 user2...
        output: true/false
        SIDEEFFECT: set value of res
    }
    getNumberDCB/GOVToken{
        input: res user1 user2...
        output: true/false
        SIDEEFFECT: set value of res
    }
    voteDCB/GOVBoard {
        input: voter votee
        output: true/false
        SIDEEFFECT: VoteBoard[votee], DCBB/GOVB/DCBG/GOVG[voter]
    }
    getListBoard{
        input: res
        output: true/false
        SIDEEFFECT: set value to res
    }
    getBlockCount{
        input: res
        output: true/false
        SIDEEFFECT: set value to res
    }
    submitDCB/GOVProposal {
        input: var
    }
    voteDCB/GOVProposal {
        input: user proposal
        SIDEEFFECT: VoteProposal[proposal]
    }
    waitForNewConstitution{
    }
    waitForNewBoard{
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
