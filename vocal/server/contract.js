const library = (function () {


  const INFURA_TOKEN = process.env.INFURA_ACCESS_TOKEN;
  const VOCAL_ADDR = process.env.VOCAL_ADDR
  const VOCAL_PASS = process.env.VOCAL_PASS

  // TODO: replace with actual contract address
  const CONTRACT_ADDR = '0x6135004c5b2b44493779ce86d6739f57dde674e0';
  // TODO: replace with ropsten (test net).
  const INFURA_PROVIDER = `https://ropsten.infura.io/${INFURA_TOKEN}`
  console.log('provider', INFURA_PROVIDER);
  // TODO: replace with actual compiled contract abi.
  const CONTRACT_ABI = "./VocalToken.json";

  const fs = require("fs");
  const Web3 = require('web3'); // https://www.npmjs.com/package/web3
  const Accounts = require('web3-eth-accounts');

  // Create a web3 connection to a running geth node over JSON-RPC running at
  // http://localhost:8545
  // For geth VPS server + SSH tunneling see
  // https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
  const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_PROVIDER));

  // Fetch ABI
  const source = fs.readFileSync(CONTRACT_ABI);
  const jsonSource = JSON.parse(source);
  // console.log(jsonSource);
  const abi = jsonSource.abi;
  // const abi = JSON.parse(contract);
  // Get a proxy on our Ropsten contract
  const VocalContract = web3.eth.contract(abi);
  const vocalContract = VocalContract.at(CONTRACT_ADDR);

  web3.eth.getBlock("latest", (error, result) => {
    if (error) {
      console.error('error getting latest block:', error);
    } else {
      console.log('latest block', result);
    }
  });

  // Perform a transaction using ETH from the geth coinbase account
  // web3.personal.unlockAccount(web3.eth.coinbase, "");
  console.log(VOCAL_ADDR, VOCAL_PASS);
  // web3.personal.unlockAccount(web3.eth.coinbase, VOCAL_ADDR, VOCAL_PASS);
  // web3.personal.unlockAccount(web3.eth.coinbase, VOCAL_ADDR, VOCAL_PASS, function (error, result) {
  //   if (error) {
  //     console.error('unlock error', JSON.stringify(error));
  //   } else {
  //     console.log('unlock success', JSON.stringify(result));
  //   }
  // });

  // Set the account from where we perform out contract transactions
  // web3.eth.defaultAccount = web3.eth.coinbase;

  // Ex: Invoke a contract method
  // const tx = vocalContract.setValue(3000, { gas: 200000 });
  // console.log("Our tx is https://testnet.etherscan.io/tx/" + tx);

  return {
    vocalContract: vocalContract,
    web3: web3
  };

})();
module.exports = library;