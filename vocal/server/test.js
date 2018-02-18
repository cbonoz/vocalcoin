const escape = require('pg-escape');
const StellarSdk = require('stellar-sdk');

// My Custom libraries
const stellar = require('./stellar');
const STARTING_BALANCE = "1000000000.00";

// const keyPairObj = {'type': "ed25519", 'secretKey': issuerSecret, 'publicKey': issuerPublicKey};
// console.log(keyPairObj.secretKey, keyPairObj.publicKey);
// const issuerPair = new StellarSdk.Keypair(keyPairObj);
// const keyPair = issuerPair;


// function testAccountCreation() {

//     stellar.createAccount(keyPair, (body) => {
//         account = body;
//         console.log('Account: ' + JSON.stringify(account));

//         // Get balances for the newly created account.
//         stellar.getBalances(keyPair, (account) => {
//             console.log('Balances for account: ' + keyPair.publicKey());
//             account.balances.forEach(function (balance) {
//                 console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
//             })
//         });;
//     });
// }

const vocalCoin = new StellarSdk.Asset(stellar.ASSET_NAME, stellar.VOCAL_ISSUER_KEYPAIR.publicKey());
trustTransaction(vocalCoin);

function trustTransaction(customAsset) {
    "use strict";
    const server = stellar.server;
    const receivingKeys = stellar.VOCAL_ISSUER_KEYPAIR;

    // First, the receiving account must trust the asset
    server.loadAccount(receivingKeys.publicKey()).then(function (receiver) {
        // The `changeTrust` operation creates (or alters) a trustline
        // The `limit` parameter below is optional
        const transaction = new StellarSdk.TransactionBuilder(receiver)
            .addOperation(StellarSdk.Operation.changeTrust({
                asset: customAsset,
                limit: STARTING_BALANCE
            }))
            .build();
        transaction.sign(receivingKeys);
        return server.submitTransaction(transaction);
    }).catch((err) => {
        console.error(err);
    });
}


// createNewAsset(stellar.ASSET_NAME);

// testAccountCreation();

// const destinationId = "dfasfsadf";

// stellar.submitTransaction(issuerPair, destinationId, 10, 'Test Transaction', 
//     (success) => {
//         console.log('tx success', success);
//     },
//     (failure) => {
//         console.log('tx failure', failure);
//     }
// );


