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

    // SmartContract address for Vocal.
    const VOCAL_SCRIPT_HASH = process.env.VOCAL_NEO_SCRIPT_HASH || '5b7074e873973a6ed3708862f219a6fbf4d1c411';

    // Semantic Style by using default import
    const Neon = neonjs.default;
    const query = Neon.create.query();
    // Named imports are available too
    const wallet = neonjs.wallet;
    const api = neonjs.api;
    const rpc = neonjs.rpc;
    const tx = neonjs.tx;

    // TODO: current plan is to deploy the contract from python using the wallet credentials specified in the env
    // and then invoke methods from javascript after the contract/coin has been deployed (such as transferring and
    // balance inquiries using the issuer account).
    function createNewToken(assetName, decimals, symbol, totalSupply, success, failure) {
        const scriptHash = VOCAL_SCRIPT_HASH;

        // These operations are invoked on the contract address for vocal on either the testnet or mainnet.
        const getName = {scriptHash, operation: 'name', args: []};
        const getDecimals = {scriptHash, operation: 'decimals', args: []};
        const getSymbol = {scriptHash, operation: 'symbol', args: []};
        const getTotalSupply = {scriptHash, operation: 'totalSupply', args: []};

        const script = Neon.create.script([getName, getDecimals, getSymbol, getTotalSupply]);

        rpc.Query.invokeScript(script).execute(RPC_URL)
            .then(res => {
                success(res); // You should get a result with state: "HALT, BREAK"
            })
            .catch(err => {
                failure(err);
            });
    }

    // Synchronous method.
    function getAssetBalance(address, assetName) {
        console.log('getBalance', address, assetName);
        const balance = new wallet.Balance({net: NEO_NETWORK, address: address});
        return api.getBalanceFrom(balance, api.neonDB);
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
        // account.publicKey, account.address
        return Neon.create.account(privateKey);
    }

    function sendTransaction(sourceAddress, sourceKey, destAddress, amount, memo, success, failure) {
        // We want to send 1 NEO and 1 GAS to ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
        const intent = api.makeIntent({NEO: amount, GAS: 1}, destAddress);
        console.log(intent); // This is an array of 2 Intent objects, one for each asset

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

