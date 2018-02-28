// Libraries.

const vocal = require('./vocal');
const stellar = require('./stellar');

// Variables.

const ISSUER_KEYPAIR = stellar.VOCAL_ISSUER_KEYPAIR;
const SOURCE_KEYPAIR = stellar.VOCAL_SOURCE_KEYPAIR;
const newUserPair = stellar.createKeyPair();

stellar.createAccount(ISSUER_KEYPAIR,
    (err1) => { console.error(err1); },
    (res1) => {
        stellar.createAccount(newUserPair,
            (err2) => { console.error(err2); },
            (res2) => {
                console.log('created', res2);
                stellar.trustToken(stellar.ASSET_NAME, ISSUER_KEYPAIR.publicKey(), newUserPair, function (error) {
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


