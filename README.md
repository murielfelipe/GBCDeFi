# GBCDeFi
The project has two contracts: GBCDeFi and GBCDeFiOracleRate.

### GBCDeFiOracleRate: 
* is the contract that sets and gets the interest rate that will be used by the contract GBCDeFi.
* gas used:286780
* I did not use Loops to prevent the gas limit.
* I used modifiers on the function setRate to impede another user that is not a manager changes the values or tries to use reentrancy-attacks.

### GBCDeFiOracleRate: 
is the contract that creates a loan to a borrower by NFT. The NFT will generate interest throw the days the borrower has the token. 
* gas used: 3773470
* I used "require function" to avoid Data truncation.
* I did not use Loops to prevent the gas limit.
* I used modifiers on the functions createTokenLoan, getvalueInterestLoan and getTotalValuePayTokenLoan to impede another * user that is not a manager changes the values or tries to use reentrancy-attacks.

## Run project
```sh
git clone https://github.com/murielfelipe/GBCDeFi.git
npm install
run ganache-cli
truffle test
```

![GBC DeFi - Deploy Contracts](https://github.com/murielfelipe/GBCDeFi/blob/main/documents/deployContracts.PNG?raw=true)
![GBC DeFi - Test](https://github.com/murielfelipe/GBCDeFi/blob/main/documents/infoTest.PNG?raw=true)