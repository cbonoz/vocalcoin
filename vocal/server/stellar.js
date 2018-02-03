const library = (function () {

  const StellarSdk = require('stellar-sdk');
  const request = require('request');
  const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

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

  const getBalances = (pair, cb) => {
    // the JS SDK uses promises for most actions, such as retrieving an account
    server.loadAccount(pair.publicKey()).then(cb);
  }

  return {
    createKeyPair: createKeyPair,
    createAccount: createAccount,
    getBalances: getBalances
  };

})();
module.exports = library;