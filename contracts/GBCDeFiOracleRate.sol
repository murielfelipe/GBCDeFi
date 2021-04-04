// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract GBCDeFiOracleRate {
    address manager;
    uint256 public loanRate;

    constructor() {
        loanRate = 5;
        manager = msg.sender;
    }

    function getRate() public view returns (uint256) {
        return loanRate;
    }

    function setRate(uint256 valuerate) public onlyManager {
        require(valuerate > 0, "GBC DeFi: Value rate must be more the zero");
        loanRate = valuerate;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "GBC DeFi: You are not the manager");
        _;
    }
}
