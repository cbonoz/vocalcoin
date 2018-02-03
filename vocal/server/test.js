
const escape = require('pg-escape');
const StellarSdk = require('stellar-sdk');

// My Custom libraries
const stellar = require('./stellar');


const issuerSecret = process.env.VOCAL_ISSUER_SECRET;
const issuerPublicKey = process.env.VOCAL_ISSUER_PUBKEY;
const keyPairObj = {'type': "ed25519", 'secretKey': issuerSecret, 'publicKey': issuerPublicKey};
console.log(keyPairObj.secretKey, keyPairObj.publicKey);
const issuerPair = new StellarSdk.Keypair(keyPairObj);
const keyPair = issuerPair;

// var sql = escape("INSERT INTO issues(user_id, description, title, lat, lng, place, active, time) values('EQo9MtWq9wWd3LmPJaJUX8F25rG2', 'test', 'test title', 41.87515838725938, -87.6318856454468, %L, true, 1514591624548", "Boston Blackie's");
// console.log(sql);

// const keyPair = stellar.createKeyPair();
console.log('keyPair', keyPair.secret(), keyPair.publicKey())
var account = null;

function testAccountCreation() {

    stellar.createAccount(keyPair, (body) => {
        account = body;
        console.log('Account: ' + JSON.stringify(account));

        // Get balances for the newly created account.
        stellar.getBalances(keyPair, (account) => {
            console.log('Balances for account: ' + keyPair.publicKey());
            account.balances.forEach(function (balance) {
                console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
            })
        });;
    });
}

function createNewAsset(assetName, issuerSecret) {


    // Keys for accounts to issue and receive the new asset
    var issuingKeys = StellarSdk.Keypair.fromSecret(issuerSecret);
    var receivingKeys = StellarSdk.Keypair.fromSecret(issuerSecret);

    const vocalCoin = new StellarSdk.Asset(assetName, issuingKeys.publicKey());
}

createNewAsset(stellar.ASSET_NAME);

testAccountCreation();

const destinationId = "dfasfsadf";

stellar.submitTransaction(issuerPair, destinationId, 10, 'Test Transaction', 
    (success) => {
        console.log('tx success', success);
    },
    (failure) => {
        console.log('tx failure', failure);
    }
);


