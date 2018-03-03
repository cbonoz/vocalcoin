// Libraries.

const vocal = require('./vocal');
const neolib = require('./neolib');

// Variables.

const newUserPrivateKey = neolib.createPrivateKey();
const newUserPair = neolib.createKeyPair(newUserPrivateKey);
console.log(JSON.stringify(newUserPair));

neolib.createAccountFromPrivateKey(neolib.NEO_ISSUER_SECRET,
    (account) => {
        console.log('created', JSON.stringify(account));

        const address = account.address;
        const vocalBalance = neolib.getAssetBalance(address, neolib.VOCAL_NAME,
            (res) => {
                "use strict";
                console.log('getAssetBalance', address, JSON.stringify(res));
            },
            (err) => {
                "use strict";
            });
    },
    (err) => {
        console.error("Error creating account", err);
    }
);


