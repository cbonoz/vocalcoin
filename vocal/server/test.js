// Libraries.

const vocal = require('./vocal');
const neolib = require('./neolib');

// Variables.

const ISSUER_KEYPAIR = neolib.VOCAL_ISSUER_KEYPAIR;
const SOURCE_KEYPAIR = neolib.VOCAL_SOURCE_KEYPAIR;
const newUserPair = neolib.createKeyPair();

neolib.createAccount(ISSUER_KEYPAIR,
    (err1) => { console.error(err1); },
    (res1) => {
        neolib.createAccount(newUserPair,
            (err2) => { console.error(err2); },
            (res2) => {
                console.log('created', res2);
                neolib.trustToken(neolib.ASSET_NAME, ISSUER_KEYPAIR.publicKey(), newUserPair, function (error) {
                    if (error) { console.error('Error!', error); return; }

                    console.log("Sucessfully trusted.");
                });
            }
        );
    });


// sendPayment("SkyToken", SOURCE_KEYPAIR, newUserPair, "2", function(error) {
//     if (error) { console.error('Error!'); console.log(JSON.stringify(error)); return; }

//     console.log("Payment sent!")
// });


