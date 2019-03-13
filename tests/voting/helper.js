function strMapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
}
async function waittt(rpcFn, bool1, bool2){
    return new Promise((resolve) => {
        var getResult = async () => {
            console.log('Check EncryptionFlag')
            flagResponse = await rpcFn;
            if ((flagResponse.Error == null) && bool1 && bool2) {
                resolve(flagResponse.Response.Result)
            } else {
                setTimeout(() => {
                    console.log('re-call after 5s')
                    getResult()
                }, 3000)
            }
        }
        getResult()
    })
}
module.exports={
    strMapToObj,
    waittt
}