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
    const ASSET_NAME = "VOC";
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
            url: STELLAR_FRIENDBOT_TEST_URL,
            qs: {addr: pair.publicKey()},
            json: true
        }, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                const errorMessage = error || body;
                console.error('createAccount error', errorMessage);
                failure(errorMessage);
            } else {
                // Add the default balance to the newly created account.
                sendTransaction(VOCAL_ISSUER_KEYPAIR, pair, vocal.DEFAULT_BALANCE, "Default Balance",
                    (defaultBalanceFailure) => {
                        "use strict";
                        console.error('submitTransaction defaultBalance error', defaultBalanceFailure);
                        failure(defaultBalanceFailure);
                    },
                    (defaultBalanceSuccess) => {
                        "use strict";
                        success(body);
                    },
                );

            }
        });
    };

    // https://www.stellar.org/developers/guides/issuing-assets.html
    // You don’t need to do anything to declare your asset on the network (see idea of trustline).
    const sendTransaction = (sendingKeys, receivingKeys, amount, memo, failure, success) => {

        // First, the receiving account must trust the asset
        server.loadAccount(receivingKeys.publicKey()).then(function (receiver) {
            const transaction = new StellarSdk.TransactionBuilder(receiver)
            // The `changeTrust` operation creates (or alters) a trustline
            // The `limit` parameter below is optional
                .addOperation(StellarSdk.Operation.changeTrust({
                    asset: vocalAsset
                    // limit: '1000'
                }))
                .build();
            transaction.sign(receivingKeys);
            return server.submitTransaction(transaction)
        })
        // Second, the issuing account actually sends a payment using the asset
            .then(function () {
                return server.loadAccount(sendingKeys.publicKey())
            })
            .catch(failure)
            .then(function (issuer) {
                const transaction = new StellarSdk.TransactionBuilder(issuer)
                    .addOperation(StellarSdk.Operation.payment({
                        destination: receivingKeys.publicKey(),
                        asset: vocalAsset,
                        amount: amount
                    }))
                    .build();
                transaction.sign(sendingKeys);
                return server.submitTransaction(transaction).then(success).catch(failure);
            }).catch(failure);
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


    function testSubmit(issuingKeys, receivingKeys, amount) {
        "use strict";
        amount = amount.toString();

        // First, the receiving account must trust the asset
        server.loadAccount(receivingKeys.publicKey())
            .then(function(receiver) {
                var transaction = new StellarSdk.TransactionBuilder(receiver)
                // The `changeTrust` operation creates (or alters) a trustline
                // The `limit` parameter below is optional
                    .addOperation(StellarSdk.Operation.changeTrust({
                        asset: vocalAsset,
                        limit: '1000'
                    }))
                    .build();
                transaction.sign(receivingKeys);
                return server.submitTransaction(transaction);
            })

            // Second, the issuing account actually sends a payment using the asset
            .then(function() {
                return server.loadAccount(issuingKeys.publicKey())
            })
            .then(function(issuer) {
                var transaction = new StellarSdk.TransactionBuilder(issuer)
                    .addOperation(StellarSdk.Operation.payment({
                        destination: receivingKeys.publicKey(),
                        asset: vocalAsset,
                        amount: amount
                    }))
                    .build();
                transaction.sign(issuingKeys);
                return server.submitTransaction(transaction);
            })
            .catch(function(error) {
                console.error('Error!', error);
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
        testSubmit: testSubmit,
        createKeyPair: createKeyPair,
        createAccount: createAccount,
        getBalances: getBalances,
        getKeyPairFromSecret: getKeyPairFromSecret,
        getVocalBalance: getVocalBalance,
        sendTransaction: sendTransaction
    };

})();
module.exports = library;