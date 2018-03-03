// https://github.com/CityOfZion/neon-js

const library = (function () {
    const neonjs = require('@cityofzion/neon-js');

    const NEO_NETWORK = 'TestNet'; // Active network, MainNet or TestNet.
    const VOCAL_NAME = "Vocal Coin";
    const VOCAL_SYMBOL = "VOCAL";
    const NEO_ISSUER_ADDRESS = process.env.VOCAL_NEO_ISSUER_ADDRESS;
    const NEO_ISSUER_SECRET = process.env.VOCAL_NEO_ISSUER_SECRET;
    const NEO_ISSUER_PUBKEY = process.env.VOCAL_NEO_ISSUER_PUBKEY;
    const NEO_ENC_PASSWORD = process.env.VOCAL_NEO_ENC_PASSWORD;
    const RPC_URL = 'https://seed1.neo.org:20332';
    const TEST_SCRIPT_HASH = '5b7074e873973a6ed3708862f219a6fbf4d1c411'; // TestNet RPX

    // // Example code for ES5.

    // Semantic Style by using default import
    const Neon = neonjs.default;
    const query = Neon.create.query();

    // Named imports are available too
    const wallet = neonjs.wallet;
    const api = neonjs.api;
    const tx = neonjs.tx;

    // TODO: current plan is to deploy the contract from python using the wallet credentials specified in the env
    // and then invoke methods from javascript after the contract/coin has been deployed (such as transferring and
    // balance inquiries using the issuer account).
    function createNewToken(assetName, decimals, symbol, totalSupply, success, failure) {
        const scriptHash = TEST_SCRIPT_HASH;

        // TODO: args should be a hex string
        const getName = { scriptHash, operation: 'name', args: [assetName] };
        const getDecimals = { scriptHash, operation: 'decimals', args: [decimals] };
        const getSymbol = { scriptHash, operation: 'symbol', args: [symbol] };
        const getTotalSupply = { scriptHash, operation: 'totalSupply', args: [totalSupply] };

        const script = Neon.create.script([getName, getDecimals, getSymbol, getTotalSupply]);

        rpc.Query.invokeScript(script)
            .execute(RPC_URL)
            .then(res => {
                success(res); // You should get a result with state: "HALT, BREAK"
            })
            .catch(err => {
                failure(err);
            });
    }

    // Synchronous method.
    function getAssetBalance(address, assetName, success, failure) {
        console.log('getBalance', address, assetName);
        // This form is useless as it is an empty balance.
        const balance = new wallet.Balance({ net: NEO_NETWORK, address: address });
        // We get a useful balance that can be used to fill a transaction through api
        // const filledBalance = api.getBalanceFrom(address, api.neonDB);
        const filledBalance = api.getBalanceFrom(balance, api.neonDB);
        filledBalance.then((res) => {
            "use strict";
            success(res);
        }).catch((err) => {
            "use strict";
            failure(err);
        })
        // This contains all symbols of assets available in this balance
        const symbols = filledBalance.assetSymbols;
        // We retrieve the unspent coins from the assets object using the symbol
        const coins = undefined;
        // const coins = filledBalance.assets[assetName].unspent;
        // We can verify the information retrieved using verifyAssets. NOTE: this is an expensive call.
        // filledBalance.verifyAssets(RPC_URL)

        return coins;
    }

    function createAccount(pair, success, failure) {
        // TODO: determine if action required to create account after calling createKeyPair
        if (wallet.isAddress(pair.address)) {
            success(pair);
        } else {
            failure(pair);
        }
    }

    function createAccountFromPrivateKey(key, success, failure) {
        const account = Neon.create.account(key);
        if (wallet.isAddress(account.address)) {
            success(account);
        } else {
            failure(account);
        }
    }

    function createPrivateKey() {
        return Neon.create.privateKey();
    }

    function createKeyPair(privateKey) {
        const account = Neon.create.account(privateKey);
        // let publicKey = account.publicKey
        // let address = account.address
        return account;
    }

    function sendTransaction(sourceAddress, sourceKey, destAddress, amount, memo, success, failure) {
        // We want to send 1 NEO and 1 GAS to ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
        const intent = api.makeIntent({ NEO: amount, GAS: 1 }, destAddress);
        console.log(intent) // This is an array of 2 Intent objects, one for each asset

        const config = {
            net: NEO_NETWORK, // The network to perform the action, MainNet or TestNet.
            address: sourceAddress,  // This is the address which the assets come from.
            privateKey: sourceKey,
            intents: intent
        };

        Neon.sendAsset(config)
            .then(config => {
                success(config.response)
            })
            .catch(config => {
                failure(config)
            });
    }

    // Decrypting neo private key.
    const decryptKey = (key) => {
        return Neon.decrypt.privateKey(key, NEO_ENC_PASSWORD);
    };

    // Encrypting neo private key.
    const encryptKey = (key) => {
        return Neon.encrypt.privateKey(key, NEO_ENC_PASSWORD);
    };

    return {
        VOCAL_SYMBOL: VOCAL_SYMBOL,
        VOCAL_NAME: VOCAL_NAME,
        NEO_ISSUER_ADDRESS: NEO_ISSUER_ADDRESS,
        NEO_ISSUER_SECRET: NEO_ISSUER_SECRET,
        NEO_ISSUER_PUBKEY: NEO_ISSUER_PUBKEY,
        createAccount: createAccount,
        createAccountFromPrivateKey: createAccountFromPrivateKey,
        createKeyPair: createKeyPair,
        createPrivateKey: createPrivateKey,
        createNewToken: createNewToken,
        decryptKey: decryptKey,
        encryptKey: encryptKey,
        getAssetBalance: getAssetBalance,
        sendTransaction: sendTransaction,
    }

})();
module.exports = library;

