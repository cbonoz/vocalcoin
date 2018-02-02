const HDWalletProvider = require("truffle-hdwallet-provider");

// Test Ethereum Network (INFURAnet)
const infuraTestNet = "https://infuranet.infura.io/";
const ropstenTestNet = "https://ropsten.infura.io/";
const infuraAccessToken = process.env.INFURA_ACCESS_TOKEN;
const infuraMnemonic = process.env.INFURA_MNEMONIC;

console.log('infuraData', infuraAccessToken, infuraMnemonic);

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
      // gas: 290000,
      gas: 2900000,
      gasPrice: '0x4A817C800'
    }
  }
};
