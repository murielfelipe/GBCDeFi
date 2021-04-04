const GBCDeFi = artifacts.require("GBCDeFi");
const truffleAssert = require("truffle-assertions");
const BigNumber = require("bignumber.js");
const ZEROADDRESS = "0x0000000000000000000000000000000000000000";

contract("GBCDeFi", function (accounts){
    const manager = accounts[0]; //Manager account
    const account1 = accounts[1];
    const loanAmount = 30000
    const initRateExpected = 5; //Value init rate
    const valurInterestLoan = 15;  
    const tokenIdExp = 0;
    const statusToken = 0;

    describe("Contract GBCDeFi", async () => {
        before(async () => {
          instanceContract = await GBCDeFi.deployed();
        });
    
        it("Check deploy contract()", async function () {
            //Check status = Init
            let initManager = await instanceContract.manager.call();
            assert.equal(manager,initManager,"Manager is not as expected");
        });

        it("Check createTokenLoan function", async function () {
            let tokenId;
            const tx = await instanceContract.createTokenLoan(account1, new BigNumber(loanAmount), { from: manager})
              .then(data => {
                tokenId = data.logs[0].args.tokenId;
                return data;
              })
            ;
            assert.isTrue(new BigNumber(tokenId).isEqualTo(new BigNumber(tokenIdExp)), `Token id '${tokenId}' is not as expected.`);
            const valueToken = await instanceContract.tokens.call(account1)
                .then(data => ({
                    id: data.id,
                    amount: data.amount,
                    rate: data.rate,
                    initDate: data.initDate,
                    status: data.status,
                    owner: data.owner
                }))
            ;
            assert.equal(valueToken.amount, loanAmount, `Amooun loan '${valueToken.amount}' is not as expected.`);
            assert.equal(valueToken.rate, initRateExpected, `Rate loan '${valueToken.rate}' is not as expected.`);
            assert.isTrue(valueToken.initDate > 0, `Init date '${valueToken.initDate}' is not as expected.`);
            assert.equal(valueToken.status, statusToken, `Status token '${valueToken.status}' is not as expected.`);
            assert.equal(valueToken.owner, account1, `Loan borrower '${valueToken.owner}' is not as expected.`);
        });

        it("Check getvalueInterestLoan function", async function () {
            const valuetTX = await instanceContract.getvalueInterestLoan.call(account1)
            assert.equal(valuetTX, valurInterestLoan, `Interest value loan '${valuetTX}' is not as expected.`);
        });

        it("Check getTotalValuePayTokenLoan function", async function () {
          const valuetTX = await instanceContract.getTotalValuePayTokenLoan.call(account1)
          assert.equal(valuetTX, (valurInterestLoan+loanAmount), `Total value loan '${valuetTX}' is not as expected.`);
      });
    })

    describe("Reverts", () => {
        it("Account should be the manager'", async () => {
            await truffleAssert.fails(
              instanceContract.createTokenLoan(account1,new BigNumber(loanAmount), { from: account1}),
              truffleAssert.ErrorType.REVERT,
              "GBC DeFi: You are not the manager"
            );
        });
        it("Account should not be zero address'", async () => {
            await truffleAssert.fails(
              instanceContract.createTokenLoan(ZEROADDRESS,new BigNumber(loanAmount), { from: manager}),
              truffleAssert.ErrorType.REVERT,
              "GBC DeFi: detected zero address"
            );
        });
        it("Amount should be more than zero'", async () => {
            await truffleAssert.fails(
              instanceContract.createTokenLoan(account1,new BigNumber(0), { from: manager}),
              truffleAssert.ErrorType.REVERT,
              "GBC DeFi: cannot borrow zero"
            );
        });
        it("Borrower should not have a loan'", async () => {
            //await instanceContract.createTokenLoan(account1, new BigNumber(loanAmount), { from: manager})
            await truffleAssert.fails(
            instanceContract.createTokenLoan(account1,new BigNumber(loanAmount), { from: manager}),
              truffleAssert.ErrorType.REVERT,
              "GBC DeFi: The borrower already has a loan"
            );
        });
        it("Borrower should have a loan'", async () => {
            await truffleAssert.fails(
            instanceContract.getvalueInterestLoan.call(manager),
              truffleAssert.ErrorType.REVERT,
              "GBC DeFi: The borrower does not have a loan"
            );
        });

        it("Borrower should have a loan'", async () => {
          await truffleAssert.fails(
          instanceContract.getTotalValuePayTokenLoan.call(manager),
            truffleAssert.ErrorType.REVERT,
            "GBC DeFi: The borrower does not have a loan"
          );
      });
    })
});