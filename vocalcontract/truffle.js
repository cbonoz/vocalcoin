// TODO: Clean up env variables and wallet in this file
var HDWalletProvider = require("../vocal/server/node_modules/truffle-hdwallet-provider");

// Test Ethereum Network (INFURAnet)
const infuraTestNet = "https://infuranet.infura.io/";
const ropstenTestNet = "https://ropsten.infura.io/";
const infuraAccessToken = process.env.INFURA_ACCESS_TOKEN;
const infuraMnemonic = process.env.INFURA_MNEMONIC;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    infuranet: {
      provider: new HDWalletProvider(infuraMnemonic, infuraTestNet + infuraAccessToken),
      network_id: "*"
    },
    ropsten: {
      provider: new HDWalletProvider(infuraMnemonic, ropstenTestNet + infuraAccessToken),
      network_id: "3",
      // gas: 4700000
      gas: '0x5208',
      gasPrice: '0x4A817C800'
    }
  }
};
