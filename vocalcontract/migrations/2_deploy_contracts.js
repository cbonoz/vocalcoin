var VocalToken = artifacts.require("./VocalToken.sol");

module.exports = function(deployer) {
  // deployer.deploy(VocalToken, {gas: 490000});
  deployer.deploy(VocalToken, {gas: 2900000});
};
