// Libraries.

const vocal = require('./vocal');
const neolib = require('./neolib');

// Variables.
const newUserPrivateKey = neolib.createPrivateKey();
// const newUserPair = neolib.createKeyPair(newUserPrivateKey);

neolib.createNewToken(neolib.VOCAL_NAME, 8, neolib.VOCAL_SYMBOL, 100000000,
    (createSuccess) => {
        neolib.createAccountFromPrivateKey(neolib.NEO_ISSUER_SECRET,
            (account) => {
                console.log('created', JSON.stringify(account));

                const address = account.address;
                neolib.getAssetBalance(address, neolib.VOCAL_SYMBOL).then((filledBalance) => {
                    "use strict";
                    console.log('getAssetBalance', address, JSON.stringify(filledBalance));
                }).catch((err) => {
                    "use strict";
                    console.log('error getting balance', address, JSON.stringify(err));
                    throw err;
                });
            },
            (err) => {
                console.error("Error creating account", err);
            }
        );
    },
    (err) => {
        "use strict";
        console.error("createNewToken error", err);
    }
);

