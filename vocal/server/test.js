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
        neolib.getAssetBalance(address, neolib.VOCAL_NAME,
            (filledBalance) => {
                "use strict";
                console.log('getAssetBalance', address, JSON.stringify(filledBalance));
            },
            (err) => {
                "use strict";
                console.log('error getting balance', address, JSON.stringify(err));
                throw err;
            });
    },
    (err) => {
        console.error("Error creating account", err);
    }
);


