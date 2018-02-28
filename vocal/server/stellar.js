const library = (function () {
    /*
     stellar.js - Helper library for stellar blockchain transaction / query methods.

     4 Key Methods:
     createKeyPair: Create Key Pair for a wallet.
     createAccount: Create Account (containing potentially multiple asset types).
     submitTransaction: Submit Transaction between the source and the destination.
     getBalances: Get Balances (amongst different stellar asset types) for the provided keyPair.
     */

    const StellarSdk = require('stellar-sdk');
    const request = require('request');
    const ASSET_NAME = "VOCAL";
    const STARTING_BALANCE = "1000000000.00";
    const STELLAR_FRIENDBOT_TEST_URL = 'https://horizon-testnet.stellar.org/friendbot';
    // To use the live network, set the hostname to 'horizon.stellar.org'
    // const STELLAR_URL = 'horizon.stellar.org';
    const STELLAR_TEST_URL = 'https://horizon-testnet.stellar.org';
    const server = new StellarSdk.Server(STELLAR_TEST_URL);

    const vocal = require('./vocal');

    // Uncomment the following line to build transactions for the live network. Be
    // sure to also change the horizon hostname.
    // StellarSdk.Network.usePublicNetwork();
    StellarSdk.Network.useTestNetwork();

    const getKeyPairFromSecret = (seed) => {
        console.log('keypair.fromSecret', seed);
        return StellarSdk.Keypair.fromSecret(seed);
    };

    const VOCAL_ISSUER_SEED = process.env.VOCAL_ISSUER_SECRET;
    const VOCAL_ISSUER_KEYPAIR = getKeyPairFromSecret(VOCAL_ISSUER_SEED);

    const VOCAL_SOURCE_SEED = process.env.VOCAL_SOURCE_SECRET;
    const VOCAL_SOURCE_KEYPAIR = getKeyPairFromSecret(VOCAL_SOURCE_SEED);

    const vocalAsset = new StellarSdk.Asset(ASSET_NAME, VOCAL_ISSUER_KEYPAIR.publicKey());
    console.log('Vocal Issuer', VOCAL_ISSUER_SEED, VOCAL_ISSUER_KEYPAIR);

    /**
     * Create a completely new and unique pair of keys.
     * See more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html
     */
    const createKeyPair = () => {
        return StellarSdk.Keypair.random();
    };

    const createAccount = (pair, failure, success) => {
        request.get({
            url: STELLAR_TEST_URL,
            qs: { addr: pair.publicKey() },
            json: true
        }, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                const errorMessage = error || body;
                console.error('createAccount error', errorMessage);
                failure(errorMessage);
            } else {
                console.log('create acc success');
                success(pair.publicKey(), body);
                // Add the default balance to the newly created account.
                // sendPayment(VOCAL_ISSUER_KEYPAIR, pair, vocal.DEFAULT_BALANCE, "Default Balance",
                //     (defaultBalanceFailure) => {
                //         "use strict";
                //         console.error('submitTransaction defaultBalance error', defaultBalanceFailure);
                //         failure(defaultBalanceFailure);
                //     },
                //     (defaultBalanceSuccess) => {
                //         "use strict";
                //         success(body);
                //     },
                // );

            }
        });
    };

    const getBalances = (pair, cb) => {
        // the JS SDK uses promises for most actions, such as retrieving an account
        server.loadAccount(pair.publicKey()).then(cb);
    };

    const getVocalBalance = (balances) => {
        balances.map((balance) => {
            const asset = balance.asset_type;
            if (asset === ASSET_NAME) {
                return balance.balance;
            }
        });
        return 0;
    };

    // Make it so that the receiving account "trusts" our custom asset
    function trustToken(assetName, issuingAccountPublicKey, receivingAccountKeyPair, callback) {
        // Create an object to represent the new asset
        var customToken = new StellarSdk.Asset(assetName, issuingAccountPublicKey);

        // First, the receiving account must trust the asset
        server.loadAccount(receivingAccountKeyPair.publicKey())
            .then(function (receiver) {
                var transaction = new StellarSdk.TransactionBuilder(receiver)

                    // The `changeTrust` operation creates (or alters) a trustline
                    // The `limit` parameter below is optional
                    .addOperation(StellarSdk.Operation.changeTrust({
                        asset: customToken,
                        limit: STARTING_BALANCE
                    }))
                    .build();

                transaction.sign(receivingAccountKeyPair);

                return server.submitTransaction(transaction);
            })
            .then(function () {
                callback();
            })
            .catch(function (error) {
                callback(error);
            });
    }

    // amount must be a string
    function sendPayment(assetName, fromKeys, receivingKeyPair, amount, failure, success) {
        var asset;
        if (assetName == "Lumens" || assetName == "XLM") {
            asset = StellarSdk.Asset.native(); // Lumens.
        } else if (assetName == ASSET_NAME) {
            const issuerPublicKey = VOCAL_ISSUER_KEYPAIR.publicKey();
            if (issuerPublicKey == undefined) {
                console.log("Cannot handle payment with " + assetName + ". Input their issuer public key into the config.json file.");
                return;
            }
            asset = new StellarSdk.Asset(assetName, issuerPublicKey);
        } else {
            console.error('unexpected asset', assetName)
        }

        // Could be a custom asset
        // var asset = new StellarSdk.Asset(assetName, test1KeyPair.public);

        server.loadAccount(fromKeys.publicKey())
            .then(function (issuer) {
                var transaction = new StellarSdk.TransactionBuilder(issuer)
                    .addOperation(StellarSdk.Operation.payment({
                        destination: receivingKeyPair.publicKey(),
                        asset: asset,
                        amount: amount
                    }))
                    .build();

                transaction.sign(fromKeys);

                return server.submitTransaction(transaction);
            })
            .then(function () {
                success();
            })
            .catch(function (error) {
                failure(error);
            });
    }

function logBalances(publicKey, callback) {
    server.loadAccount(publicKey).then(function (acct) {
        var balances = acct.balances;
        console.log("----------------")
        console.log(acct._baseAccount._accountId); // 
        for (var i in balances) {

            console.log(""); // extra newline

            var b = balances[i];
            if (b.asset_type == 'native') {
                // Lumens
                console.log("Lumens");
                console.log("Balance: " + b.balance);
            }
            else {
                console.log(b.asset_code);
                console.log("Balance: " + b.balance);
                console.log("Limit: " + b.limit);
                console.log("Issuer: " + b.asset_issuer);
            }
        }

        if (callback) callback();
    });
}

    return {
        ASSET_NAME: ASSET_NAME,
        VOCAL_ISSUER_KEYPAIR: VOCAL_ISSUER_KEYPAIR,
        VOCAL_ISSUER_SEED: VOCAL_ISSUER_SEED,
        VOCAL_SOURCE_KEYPAIR: VOCAL_SOURCE_KEYPAIR,
        VOCAL_SOURCE_SEED: VOCAL_SOURCE_SEED,
        STELLAR_TEST_URL: STELLAR_TEST_URL,
        server: server,
        vocalAsset: vocalAsset,
        trustToken: trustToken,
        sendPayment: sendPayment,
        createKeyPair: createKeyPair,
        createAccount: createAccount,
        getBalances: getBalances,
        logBalances: logBalances,
        getKeyPairFromSecret: getKeyPairFromSecret,
        getVocalBalance: getVocalBalance,
    };

})();
module.exports = library;