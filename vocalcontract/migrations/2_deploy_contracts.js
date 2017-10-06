var ConvertLib = artifacts.require("./ConvertLib.sol");
var VocalToken = artifacts.require("./VocalToken.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, VocalToken);
  deployer.deploy(VocalToken);
};
