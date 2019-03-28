const DCBVotingFlag = 0;
const ID_DCB="0000000000000000000000000000000000000000000000000000000000000001";
const ID_GOV="0000000000000000000000000000000000000000000000000000000000000002";
const SELF_SK = "112t8rqGc71CqjrDCuReGkphJ4uWHJmiaV7rVczqNhc33pzChmJRvikZNc3Dt5V7quhdzjWW9Z4BrB2BxdK5VtHzsG9JZdZ5M7yYYGidKKZV";
const SELF_PAYMENT = "1Uv3VB24eUszt5xqVfB87ninDu7H43gGxdjAUxs9j9JzisBJcJr7bAJpAhxBNvqe8KNjM5G9ieS1iC944YhPWKs3H2US2qSqTyyDNS4Ba";
const BURN_ADDR = "1NHnxeKaZD5tMCzWR3yKXeQYh6o9XaskNhYb7WsWacwcUxB92GnoNGJTMHf1";
const PAYMENT_INFO = "1Uv3tEY5pG6by7t6DKMX8NcnEbf4aAbT6tZCyYsq4wRWTpCDVHZcnmBwqgV2VPuWgv9UEuMy7ArPvAZAow622QUxABLxvRZkRviyZ5cj3";
let VOTERS_PAYMENT = [
    "1Uv33mvQk68NWyDqsXcHh2jcao9HZzbA9MrKrb49npYjreLZkEGcmA85AZuRji7ZwQBUzv3JfbqxxSSZHH5oBJTBbpMMWCfDq5XtV4XLh",
    "1Uv4CtusMLW1GZpMS2HwqJ5fp654J6VUxUPEm8CpgkqDmKRbKuSH2dvBrrq4P75GNZdbCW3QGXmMQDRqpLnpyHrESqKvawLX7Ju29HjaD",
    "1Uv2QKmy3UgFrhJ14ZWZvxRGDGSB1GTh2M77Gzed4QHUjXcGaYLJ9ePrsVgqva8nRohy7zRnnGBy6GPsT6bBUqv61NGA6LMpP7LitAtFr",
    "1Uv3QesEsWvWSwWra71qjCdttSTur4skEuYuSywRY4brkiKf4LqX8REAZz63C36A18KAD7Z9JM193mQ1KvfZ1P7NCpxVuPaiRRuSEbxKC",
    "1Uv2dBpmwj696w9U1wTgv3m5secAf5ARRVXqKuyhSaZGzWy3S5ug3reRuKNivC1SU9gzbZQ9bhfLygx5gUyAjzNRayqZixikffHv4q59x",
    "1Uv2SKS1S3nqwo7cDkcHWaPtfW46z3SaHnTVpsd3NyNxSAU28qxeJXwA71Uo9taLyk6A6riMb5GeNR9q4Em5w9GJJLPL4XgthMYEQEv43",
    "1Uv3hv2ZucADHQmCtrw896pgx2r6QQN1SGDz2mnD9PgzxGAbh9B5j646EjoX3NDh56fnLBsTfA4YvxrnKPkzDiYwpAQ7eYQ5WWz3Yrw57",
    "1Uv3mPwEYSCvvtUfUnNr6YoSWLhMV787ck4y4MUgHkHibBLgdPiJn84gNw7SFFVaUxPZpSuhj5yQBRpZ8M514CzzRQ1uWuPHMQZnn5xiE",
    "1Uv2GTpJFAxwNSwd7CNRhmLZbPNmuXedSV2YWSUwMi1SvUJ68wfL5rHUgEtRHcBUkEcZ7rvQoLz21oTYiorPawFmB5MFt8AJMek5gMEak",
    "1Uv33883YS2hPf5SXiargYL52Gu11N155Sv9tmWMkEcU2euoj5RsXHyEaHDW6f5feXriCdNQDqMm367WUcCvM3tKdrvGbD32iPbdtGpmy",
    "1Uv4P84WCUNMzsfkcpm1YGiaz2XJeaEvoBqkUFneKMyR6KmWMQtRDVotF72ktS1YMJuqLyZyCP73g3Re1cCnpoEwDSuNr7ecDFtHt5kfU"];   
let VOTERS_SK = [
    "112t8rqNbkbxGCfHHaTEzk72QugyTfqgemGHNGiSmt6c7LzaQVK2qEv6NHXq3HdgA7W2bcAe1HMm8rzaF6ib65mMy4Korva12SMgU8MUMvbS",
    "112t8rr5qUxtV4m9NDmcAg8ksMkHLw2emZ3igc5v1fUyfmBhkS2kPX28L8BEpSXf8dNbCd1RqsmfLoNbDdSPqeX73UkBi2wm22QfD2JiThrm",
    "112t8rueWYYix2qECUDHvnkVGa4VzmZHVWt3qjzeY4pXucHN42axQfQBYivGgn4je4b4nbi2dBvMoD69Y8UCiKp3asmtGnhvR4AVatKxe7YK",
    "112t8rpRqbHhvJttAYnuS3STbHgtFeTyAM77kRLbnSnoQsc6T5ubf8qbRSN8MEQa9eHuV42r5U8ina57vjMfzmR1VKZwfGtS7CHwma5Pc5T3",
    "112t8rrHxr4GiLeKMUbRA6Vu73fnTcbcACEf5x2H9ZuynE4T75YvacYqkrAHhWXE1LmRShXxcuoKRpCoeZHgmw9u7wrayjkNquLRoiJkVtZi",
    "112t8rt6kfHn3rGaY7fjeMerFRRctT6Afwa6hMCrFAFEXDAwA9Z33oW7iFC1dFjiojBKfk9TJi4UcydjJktrg2meZENYphCnM9fKCZyYvHBH",
    "112t8ryR2Rv2zec93Nv9Z3P1FRZrEb73bcdq5cmdae6DfdPc4AmpFotZLpixZih1hccmw2QM1WTzZ1trpL28DYXhGnYAJDuTJk7yH3EEV9tP",
    "112t8s6Sm8HFeyz1fCdEate6UjaodC1jR6pMSm9jGeNEDSeuDJhHueKKc4WNh9UDAXtRqv8XFeDRrfB7hMN7BMh9ZJWjdccWo46n9ArpAbe8",
    "112t8ro2siKwUPC77DJfWb4z1Q7bsdUhwhmkmR99oWPkrrMMjiK59dEmsScVqiBow7M7kUynBnvASRFJ55zAGWxkuvrjVB8CJifekf4PgCBr",
    "112t8rrLtCRVUWyptvLhvKJnxKfzut6k3giJ29bqcaFufkNYSSWtaZzHB1Hb4hnUaBoustpiDPLMNLZvA7ktTPBubHKR9pcr82jUy9UMptVd",
    "112t8rrNTBxmr2Q8ztjgvFCgMegbmEmfuwcP2fpfAFm4FE5a5PCRoDwvSLeJBqxqRibfwewh1htFBBTSxU5tA89wrB1njbJLbeoehQbdj21T"];
module.exports = {
    DCBVotingFlag,
    ID_DCB,
    ID_GOV,
    SELF_SK,
    SELF_PAYMENT,
    BURN_ADDR,
    PAYMENT_INFO,
    VOTERS_SK,
    VOTERS_PAYMENT
}
//  paymentAddress: 1Uv2dBpmwj696w9U1wTgv3m5secAf5ARRVXqKuyhSaZGzWy3S5ug3reRuKNivC1SU9gzbZQ9bhfLygx5gUyAjzNRayqZixikffHv4q59x
// privateKey: 
// Acc 1125:
//  paymentAddress: 1Uv2SKS1S3nqwo7cDkcHWaPtfW46z3SaHnTVpsd3NyNxSAU28qxeJXwA71Uo9taLyk6A6riMb5GeNR9q4Em5w9GJJLPL4XgthMYEQEv43
// privateKey: 
// Acc 2197:
//  paymentAddress: 1Uv3hv2ZucADHQmCtrw896pgx2r6QQN1SGDz2mnD9PgzxGAbh9B5j646EjoX3NDh56fnLBsTfA4YvxrnKPkzDiYwpAQ7eYQ5WWz3Yrw57
// privateKey: 
// Acc 3615:
//  paymentAddress: 
// privateKey: 
// Acc 103:
//  paymentAddress: 
// privateKey: 
// Acc 771:
//  paymentAddress: 
// privateKey: 
// Acc 777:
//  paymentAddress: 
// privateKey: 
// Acc 575:
//  paymentAddress: 
// privateKey: 
// Acc 719:
//  paymentAddress: 
// privateKey: 
// Acc 1437:
//  paymentAddress: 
// privateKey: 
// Acc 385:
//  paymentAddress: 1Uv3QesEsWvWSwWra71qjCdttSTur4skEuYuSywRY4brkiKf4LqX8REAZz63C36A18KAD7Z9JM193mQ1KvfZ1P7NCpxVuPaiRRuSEbxKC
// privateKey: 112t8rpRqbHhvJttAYnuS3STbHgtFeTyAM77kRLbnSnoQsc6T5ubf8qbRSN8MEQa9eHuV42r5U8ina57vjMfzmR1VKZwfGtS7CHwma5Pc5T3
// Acc 491:
//  paymentAddress: 1Uv2iZwyy9VUzS34QDJc4EzSQUNcaKjvtQ4aSzGb7WDRwUDorBqriBrZ12vboDs59EnjJo4RVXAiRMZA4SQSAV3WyNmowrcqAXWuMq7KA
// privateKey: 112t8rpxVGRutb9BZ9vsu9oUXgkshLUYoiiYyfjGfSmx1jnYDm5bUCvia1EMKYEVBW9icg6trjHMD7eheCynKe17YEKywx4geUoeKGwVqyyc
// Acc 761:
//  paymentAddress: 1Uv2dBpmwj696w9U1wTgv3m5secAf5ARRVXqKuyhSaZGzWy3S5ug3reRuKNivC1SU9gzbZQ9bhfLygx5gUyAjzNRayqZixikffHv4q59x
// privateKey: 112t8rrHxr4GiLeKMUbRA6Vu73fnTcbcACEf5x2H9ZuynE4T75YvacYqkrAHhWXE1LmRShXxcuoKRpCoeZHgmw9u7wrayjkNquLRoiJkVtZi
// Acc 1125:
//  paymentAddress: 1Uv2SKS1S3nqwo7cDkcHWaPtfW46z3SaHnTVpsd3NyNxSAU28qxeJXwA71Uo9taLyk6A6riMb5GeNR9q4Em5w9GJJLPL4XgthMYEQEv43
// privateKey: 112t8rt6kfHn3rGaY7fjeMerFRRctT6Afwa6hMCrFAFEXDAwA9Z33oW7iFC1dFjiojBKfk9TJi4UcydjJktrg2meZENYphCnM9fKCZyYvHBH
// Acc 2197:
//  paymentAddress: 1Uv3hv2ZucADHQmCtrw896pgx2r6QQN1SGDz2mnD9PgzxGAbh9B5j646EjoX3NDh56fnLBsTfA4YvxrnKPkzDiYwpAQ7eYQ5WWz3Yrw57
// privateKey: 112t8ryR2Rv2zec93Nv9Z3P1FRZrEb73bcdq5cmdae6DfdPc4AmpFotZLpixZih1hccmw2QM1WTzZ1trpL28DYXhGnYAJDuTJk7yH3EEV9tP
// Acc 3615:
//  paymentAddress: 1Uv3mPwEYSCvvtUfUnNr6YoSWLhMV787ck4y4MUgHkHibBLgdPiJn84gNw7SFFVaUxPZpSuhj5yQBRpZ8M514CzzRQ1uWuPHMQZnn5xiE
// privateKey: 112t8s6Sm8HFeyz1fCdEate6UjaodC1jR6pMSm9jGeNEDSeuDJhHueKKc4WNh9UDAXtRqv8XFeDRrfB7hMN7BMh9ZJWjdccWo46n9ArpAbe8
// Acc 103:
//  paymentAddress: 1Uv2GTpJFAxwNSwd7CNRhmLZbPNmuXedSV2YWSUwMi1SvUJ68wfL5rHUgEtRHcBUkEcZ7rvQoLz21oTYiorPawFmB5MFt8AJMek5gMEak
// privateKey: 112t8ro2siKwUPC77DJfWb4z1Q7bsdUhwhmkmR99oWPkrrMMjiK59dEmsScVqiBow7M7kUynBnvASRFJ55zAGWxkuvrjVB8CJifekf4PgCBr
// Acc 771:
//  paymentAddress: 1Uv33883YS2hPf5SXiargYL52Gu11N155Sv9tmWMkEcU2euoj5RsXHyEaHDW6f5feXriCdNQDqMm367WUcCvM3tKdrvGbD32iPbdtGpmy
// privateKey: 112t8rrLtCRVUWyptvLhvKJnxKfzut6k3giJ29bqcaFufkNYSSWtaZzHB1Hb4hnUaBoustpiDPLMNLZvA7ktTPBubHKR9pcr82jUy9UMptVd
// Acc 777:
//  paymentAddress: 1Uv4P84WCUNMzsfkcpm1YGiaz2XJeaEvoBqkUFneKMyR6KmWMQtRDVotF72ktS1YMJuqLyZyCP73g3Re1cCnpoEwDSuNr7ecDFtHt5kfU
// privateKey: 112t8rrNTBxmr2Q8ztjgvFCgMegbmEmfuwcP2fpfAFm4FE5a5PCRoDwvSLeJBqxqRibfwewh1htFBBTSxU5tA89wrB1njbJLbeoehQbdj21T