const GBCDeFiOracleRate = artifacts.require("GBCDeFiOracleRate");
const truffleAssert = require("truffle-assertions");
const BigNumber = require("bignumber.js");

contract("GBCDeFiOracleRate", function (accounts){
    const manager = accounts[0]; //Manager account
    const account1 = accounts[1];
    const initRateExpected = 5; //Value init rate
    const setRateExpected = 3; //Set value 
    const setRateExpectedRevert = 0; //Set value revert


    describe("Contract GBCDeFiOracleRate", async () => {
        before(async () => {
          instanceContract = await GBCDeFiOracleRate.deployed();
        });
    
        it("Check deploy contract()", async function () {
            //Check status = Init
            let initvalueRate = await instanceContract.loanRate.call();
            assert.equal(initRateExpected,initvalueRate,"Init rate is not as expected");
        });

        it("Check setRate function", async function () {
            let setvalueRate = await instanceContract.setRate(new BigNumber(setRateExpected), { from: manager });
            assert.isTrue(new BigNumber(setRateExpected).isEqualTo(setRateExpected), `Rate  ${setvalueRate} is not as expected`);
        });

        it("Check getRate function", async function () {
            await instanceContract.setRate(new BigNumber(setRateExpected), { from: manager });
            let getvalueRate = await instanceContract.getRate.call();
            assert.equal(getvalueRate,setRateExpected,"Value rate is not as expected");
         });
    })
    describe("Reverts", () => {
        it("Value rate should be more than 0'", async () => {
          await truffleAssert.fails(
            instanceContract.setRate(new BigNumber(setRateExpectedRevert), { from: manager }),
            truffleAssert.ErrorType.REVERT,
            "GBC DeFi: Value rate must be more the zero"
          );
        });

        it("Account should be the manager'", async () => {
            await truffleAssert.fails(
              instanceContract.setRate(new BigNumber(setRateExpected), { from: account1 }),
              truffleAssert.ErrorType.REVERT,
              "GBC DeFi: You are not the manager"
            );
          });
    })
});