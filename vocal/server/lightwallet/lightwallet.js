"use strict";
const library = (function () {

    const lightwallet = require('eth-lightwallet');
    const Web3 = require('web3');
    const HookedWeb3Provider = require('hooked-web3-provider');
    const async = require('async');

    let web3 = new Web3();
    let global_keystore = lightwallet.keystore;

    let setWeb3Provider = function (keystore) {
        let web3Provider = new HookedWeb3Provider({
            host: "https://ropsten.infura.io/",
            transaction_signer: keystore
        });
        web3.setProvider(web3Provider);
    }

    let newAddresses = function (password) {
        // if (password === '') {
        //     throw err;
        // }
        //
        // let numAddr = 1;
        // global_keystore.keyFromPassword(password, function(err, pwDerivedKey) {
        //     global_keystore.generateNewAddress(pwDerivedKey, numAddr);
        //     let addresses = global_keystore.getAddresses();
        //     let sendFrom = '';
        //     let functionCaller = '';
        //     for (var i=0; i<addresses.length; ++i) {
        //         sendFrom += addresses[i];
        //         functionCaller += addresses[i];
        //     }
        //
        //     getBalances();
        // })
    }

    let getBalances = function (address) {
        // var addresses = global_keystore.getAddresses();
        let addresses = ["0x7f21D215d58bb924e716FDB38dA5C75e1946954A"];
        let addr = 'Retrieving for addresses...';
        // async.map(addresses, web3.eth.getBalance, function(err, balances) {
        //     async.map(addresses, web3.eth.getTransactionCount, function(err, nonces) {
        //         for (var i=0; i<addresses.length; ++i) {
        //             // addr += addresses[i] + ' (Bal: ' + (balances[i] / 1.0e18) + ' ETH, Nonce: ' + nonces[i] + ')';
        //             // addr += addresses[i] + ' (Bal: ' + (balances[i]) + ' ETH, Nonce: ' + nonces[i] + ')';
        //             addr += addresses[i] + ' (Bal: ' + (balances[i]) + ')';
        //         }
        //     })
        // })
        let web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/u8QTQ18822xkl2KR59Ha"));
        let balance = web3.eth.getBalance(address)/1.0e18;
        return balance;
    }

    let setSeed = function (seed) {
        // var password = prompt('Enter Password to encrypt your seed', 'Password');
        // lightwallet.keystore.createVault({
        //     password: password,
        //     seedPhrase: seed,
        //     //random salt
        //     hdPathString: "m/0'/0'/0'"
        // }, function (err, ks) {
        //     global_keystore = ks;
        //
        //     newAddresses(password);
        //     setWeb3Provider(global_keystore);
        //
        //     getBalances();
        // })
    }

    let newWallet = function () {
        // let extraEntropy = "testEntropyValue";
        // let userEntropy = '';
        // var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
        // var infoString = 'Your new wallet seed is: "' + randomSeed +
        //     '". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. ' +
        //     'Please enter a password to encrypt your seed while in the browser.'
        // var password = prompt(infoString, 'Password');
        // lightwallet.keystore.createVault({
        //     password: password,
        //     seedPhrase: randomSeed,
        //     //random salt
        //     hdPathString: "m/0'/0'/0'"
        // }, function (err, ks) {
        //     global_keystore = ks
        //
        //     newAddresses(password);
        //     setWeb3Provider(global_keystore);
        //     getBalances();
        // })
    }

    let showSeed = function () {
        // var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', 'Password');
        // global_keystore.keyFromPassword(password, function(err, pwDerivedKey) {
        //     var seed = global_keystore.getSeed(pwDerivedKey);
        //     alert('Your seed is: "' + seed + '". Please write it down.');
        // });
    }

    let sendEth = function (sendFrom, sendTo, sendValueAmount) {
        var sendFrom = "0x7f21D215d58bb924e716FDB38dA5C75e1946954A";
        var sendTo = "0x8ef3b9ae3765a007b38e971c6d7bd67be63fc07b";
        var fromAddr = sendFrom;
        var toAddr = sendTo;
        var valueEth = sendValueAmount;
        var value = parseFloat(valueEth)*1.0e18;
        var gasPrice = 18000000000;
        var gas = 50000;
        web3.eth.sendTransaction({from: fromAddr, to: toAddr, value: value, gasPrice: gasPrice, gas: gas}, function (err, txhash) {
            console.log('error: ' + err);
            console.log('txhash: ' + txhash);
        })
    }

    let functionCall = function () {
        // var fromAddr = document.getElementById('functionCaller').value
        // var contractAddr = document.getElementById('contractAddr').value
        // var abi = JSON.parse(document.getElementById('contractAbi').value)
        // var contract = web3.eth.contract(abi).at(contractAddr)
        // var functionName = document.getElementById('functionName').value
        // var args = JSON.parse('[' + document.getElementById('functionArgs').value + ']')
        // var valueEth = document.getElementById('sendValueAmount').value
        // var value = parseFloat(valueEth)*1.0e18
        // var gasPrice = 50000000000
        // var gas = 4541592
        // args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
        // var callback = function(err, txhash) {
        //     console.log('error: ' + err)
        //     console.log('txhash: ' + txhash)
        // }
        // args.push(callback)
        // contract[functionName].apply(this, args)
    }

    return {
        newAddresses: newAddresses,
        getBalances: getBalances,
        setSeed: setSeed,
        newWallet: newWallet,
        showSeed: showSeed,
        sendEth: sendEth,
        functionCall: functionCall
    }

})();
module.exports = library;
