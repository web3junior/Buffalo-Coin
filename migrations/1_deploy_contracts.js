const BuffaloCoin = artifacts.require("BuffaloCoin");

module.exports = function(deployer) {
  deployer.deploy(BuffaloCoin);
};
