const GBCDeFi = artifacts.require("GBCDeFi");
const GBCDeFiOracleRate = artifacts.require("GBCDeFiOracleRate");

module.exports = async function(deployer) {
  deployer.deploy(GBCDeFiOracleRate);
  deployer.deploy(GBCDeFi);
}


