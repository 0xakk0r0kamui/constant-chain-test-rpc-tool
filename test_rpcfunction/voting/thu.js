function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
var i = 0

describe('thu', async function () {
    (function(a) {
        it('test1', async function() {
            console.log('1');
            i+=1;
            console.log(i);

            await sleep(1003)
            console.log('1');
            i+=1;
            console.log(i)
        } );
    })(0);
    (function(a) {
        it('test2', async function () {
            console.log('2');
            i+=1;
            console.log(i);
            await sleep(103);
            console.log('2');
            i+=1;
            console.log(i)
        });
    })(0);
    (function(a) {
            it('test3', async function () {
                console.log('3');
                i+=1;
                console.log(i)

            })
        })(0);
    (function(a) {
                it('test4', async function () {
                    console.log('4');
                    i+=1;
                    console.log(i)
                })
            })(0);
} );