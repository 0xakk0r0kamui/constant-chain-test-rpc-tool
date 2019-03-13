let assert = require('assert');
let rpcfunc = require("../../../constant-rpc/constant_rpc");
let shard = new rpcfunc("127.0.0.1", 9334);
describe('Voting Proposal', function(){
    let flagResponse = null;
    it('Get list Board', function(){
        this.timeout(Number.MAX_SAFE_INTEGER);
        let waitForResult = async () => {
            return new Promise((resolve) => {
                var getResult = async () => {
                    flagResponse = await shard.GetListDCBBoard();
                    console.log(flagResponse.Response.Result.length);
                    if ((flagResponse.Response.Error == null) && (flagResponse.Response.Result.length >1)) {
                        resolve(flagResponse.Response.Result);
                    } else {
                        setTimeout(async () => {
                            let countResponse = await shard.GetBlockCount(0);
                            console.log("Block count: ", countResponse.Response.Result, "; List Board still null");
                            getResult()
                        }, 3000)
                    }
                }
                getResult()
            })
        }
        let res = await waitForResult();
        console.log(res);
    });
    it('Test votion Proposal', function(){
        assert.ok(true);
    });
});