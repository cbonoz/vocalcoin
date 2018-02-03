const library = (function () {

  const StellarSdk = require('stellar-sdk');
  const request = require('request');
  const ASSET_NAME = "Vocal";
  StellarSdk.Network.useTestNetwork();
  const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

  // 4 Key Methods:
  // createKeyPair: Create Key Pair for a wallet.
  // createAccount: Create Account (containing potentially multiple asset types).
  // submitTransaction: Submit Transaction between the source and the destination.
  // getBalances: Get Balances (amongst different stellar asset types) for the provided keyPair.

  // create a completely new and unique pair of keys
  // see more about KeyPair objects: https://stellar.github.io/js-stellar-sdk/Keypair.html

  const createKeyPair = () => {
    const pair = StellarSdk.Keypair.random();
    // pair.secret();
    // pair.publicKey();
    return pair;
  }

  const createAccount = (pair, cb) => {
    request.get({
      url: 'https://horizon-testnet.stellar.org/friendbot',
      qs: { addr: pair.publicKey() },
      json: true
    }, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        console.error('ERROR!', error || body);
      }
      else {

        cb(body);
      }
    });
  }

  const submitTransaction = (sourceKeys, destinationId, amount, memo, success, failure) => {

    // First, check to make sure that the destination account exists.
    // You could skip this, but if the account does not exist, you will be charged
    // the transaction fee when the transaction fails.
    server.loadAccount(destinationId)
      // If the account is not found, surface a nicer error message for logging.
      .catch(StellarSdk.NotFoundError, function (error) {
        throw new Error('The destination account does not exist!');
      })
      // If there was no error, load up-to-date information on your account.
      .then(function () {
        return server.loadAccount(sourceKeys.publicKey());
      })
      .then(function (sourceAccount) {
        // Start building the transaction.
        transaction = new StellarSdk.TransactionBuilder(sourceAccount)
          .addOperation(StellarSdk.Operation.payment({
            destination: destinationId,
            // Because Stellar allows transaction in many currencies, you must
            // specify the asset type. The special "native" asset represents Lumens.
            // asset: StellarSdk.Asset.native(),
            asset: ASSET_NAME,
            amount: amount
          }))
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text(memo)) // 'Test Transaction'
          .build();
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);
        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction);
      })
      .then(success).catch(failure);
  }

  const getBalances = (pair, cb) => {
    // the JS SDK uses promises for most actions, such as retrieving an account
    server.loadAccount(pair.publicKey()).then(cb);
  }

  return {
    ASSET_NAME: ASSET_NAME,
    createKeyPair: createKeyPair,
    createAccount: createAccount,
    getBalances: getBalances,
    submitTransaction: submitTransaction
  };

})();
module.exports = library;