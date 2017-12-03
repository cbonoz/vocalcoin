const library = (function () {

  // TODO: replace with actual contract address
  const CONTRACT_ADDR = '0xe0b79b3d705cd09435475904bf54520929eae4e8';
  // TODO: replace with ropsten (test net).
  const WEB3_PROVIDER = "http://localhost:8545";
  // TODO: replace with actual compiled contract abi.
  const CONTRACT_ABI = "contracts/contracts.json";

  const fs = require("fs");
  const Web3 = require('web3'); // https://www.npmjs.com/package/web3

  // Create a web3 connection to a running geth node over JSON-RPC running at
  // http://localhost:8545
  // For geth VPS server + SSH tunneling see
  // https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
  const web3 = new Web3();

  // https://tokenmarket.net/blog/creating-ethereum-smart-contract-transactions-in-client-side-javascript/
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));
  }

  // Fetch ABI
  const source = fs.readFileSync(CONTRACT_ABI);
  const contracts = JSON.parse(source)["contracts"];
  const abi = JSON.parse(contracts.SampleContract.abi);

  // Get a proxy on our Ropsten contract
  const SampleContract = web3.eth.contract(abi);
  const vocalContract = SampleContract.at(CONTRACT_ADDR);

  // Perform a transaction using ETH from the geth coinbase account
  web3.personal.unlockAccount(web3.eth.coinbase, "");

  // Set the account from where we perform out contract transactions
  web3.eth.defaultAccount = web3.eth.coinbase;

  // Ex: Invoke a contract method
  // const tx = vocalContract.setValue(3000, { gas: 200000 });
  // console.log("Our tx is https://testnet.etherscan.io/tx/" + tx);

  return {
    vocalContract: vocalContract,
    web3: web3
  };

})();
module.exports = library;