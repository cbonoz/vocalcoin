import Neon from '@cityofzion/neon-js';
import { rpc, tx } from '@cityofzion/neon-js';
import { wallet, api } from '@cityofzion/neon-js';

// https://github.com/CityOfZion/neon-js
const library = (function () {
    const neon = require('@cityofzion/neon-js')

    const NEO_NETWORK = 'TestNet';
    const VOCAL_NAME = "VOCAL";
    const RPC_URL = 'https://seed1.neo.org:20332';
    const TEST_SCRIPT_HASH = '5b7074e873973a6ed3708862f219a6fbf4d1c411'; // TestNet RPX

    // Neon.create.claimTx(...args):
    const query = Neon.create.query();

    // // Version for ES5.
    // const Neon = neon.default;
    // const query = Neon.create.query();
    // // Named imports are available too
    // const wallet = neon.wallet;
    // const tx = neon.tx;
    // const account = new wallet.Account(privateKey)

    function createVocalToken(success) {
        const scriptHash = TEST_SCRIPT_HASH;

        const name = 'Vocal Token'
        const decimals = 2
        const symbol = VOCAL_NAME
        const totalSupply = 100000000.00

        const getName = { scriptHash, operation: 'name', args: [name] }
        const getDecimals = { scriptHash, operation: 'decimals', args: [decimals] }
        const getSymbol = { scriptHash, operation: 'symbol', args: [symbol] }
        const getTotalSupply = { scriptHash, operation: 'totalSupply', args: [totalSupply] }

        const script = Neon.create.script([getName, getDecimals, getSymbol, getTotalSupply])

        rpc.Query.invokeScript(script)
            .execute(RPC_URL)
            .then(res => {
                success(res); // You should get a result with state: "HALT, BREAK"
            });
    }

    function getAssetBalance(address, assetName) {
        Neon.create.balance({ net: NEO_NETWORK, address: address })

        // This form is useless as it is an empty balance.
        const balance = new wallet.Balance({ net: NEO_NETWORK, address: address })
        // We get a useful balance that can be used to fill a transaction through api
        const filledBalance = api.getBalanceFrom('ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW', api.neonDB)
        // This contains all symbols of assets available in this balance
        const symbols = filledBalance.assetSymbols
        // We retrieve the unspent coins from the assets object using the symbol
        const coins = filledBalance.assets[assetName].unspent
        // We can verify the information retrieved using verifyAssets
        // NOTE: this is an expensive call.
        // filledBalance.verifyAssets(RPC_URL)

        return coins;
    }

    function createKeyPair() {
        const privateKey = Neon.create.privateKey();
        const account = Neon.create.account(privateKey)
        // let publicKey = account.publicKey
        // let address = account.address
        return account;
    }

    function sendTransaction(sourceAddress, sourceKey, destAddress, memo, amount, success, failure) {
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


    return {
        VOCAL_NAME: VOCAL_NAME,
        createKeyPair: createKeyPair,
        createVocalToken: createVocalToken,
        getAssetBalance: getAssetBalance,
        sendTransaction: sendTransaction,
    }

})();
module.exports = library;

