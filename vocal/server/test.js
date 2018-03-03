// Libraries.

const vocal = require('./vocal');
const neolib = require('./neolib');

// Variables.

const newUserPrivateKey = neolib.createPrivateKey();
const newUserPair = neolib.createKeyPair(newUserPrivateKey);
console.log(JSON.stringify(newUserPair));

neolib.createAccountFromPrivateKey(neolib.NEO_ISSUER_SECRET,
    (err) => { console.error("Error creating account", err); },
    (account) => {
        console.log('created', JSON.stringify(account));

        const address = account.address;
        const vocalBalance = neolib.getAssetBalance(address);
        console.log('vocalBalance', address, vocalBalance)
    });


