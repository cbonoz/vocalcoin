// Libraries.

const vocal = require('./vocal');
const stellar = require('./stellar');

// Variables.

const ISSUER_KEYPAIR = stellar.VOCAL_ISSUER_KEYPAIR;
const newUserPair = stellar.createKeyPair();

function testCreateAccount() {
    stellar.createAccount(newUserPair,
        (err) => {
            "use strict";
            console.error(err)
        },
        (res) => {
            "use strict";
            stellar.testSubmit(ISSUER_KEYPAIR, newUserPair, "10.0");
            // stellar.sendTransaction(ISSUER_KEYPAIR, newUserPair, 100, "test amount",
            //
            //     (defaultBalanceFailure) => {
            //         "use strict";
            //         console.error('submitTransaction defaultBalance error', defaultBalanceFailure);
            //     },
            //     (defaultBalanceSuccess) => {
            //         "use strict";
            //         console.log('success', defaultBalanceSuccess)
            //     },
            // );
        }
    );
}

testCreateAccount()

