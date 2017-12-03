var VocalToken = artifacts.require("./VocalToken.sol");

module.exports = function(deployer) {
  deployer.deploy(VocalToken);
};
