// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./GBCDeFiOracleRate.sol";


contract GBCDeFi is ERC721Enumerable {
    enum borrowNFTStatus {BORROWED, PAYED}
    address public manager;
    uint256 private _tokenIndexCursor;

    struct borrowNFT { 
        uint256 id;
        uint256 amount;
        uint256 rate;
        uint256 initDate;
        borrowNFTStatus status;
        address owner;
    }

    mapping(address => borrowNFT) public tokens;
    GBCDeFiOracleRate valueOracle;

    constructor() public ERC721("GBC DeFi", "GBCDeFi") {
        valueOracle = new GBCDeFiOracleRate();
        manager = msg.sender;
    }

    //Function to create loan token by borrower  
    function createTokenLoan(address _addborrower, uint256 _amount) 
        public payable
        onlyManager
        returns (uint256)
    {
        // Checks:
        require(
            _addborrower != address(0) && msg.sender != address(0),
            "GBC DeFi: detected zero address"
        );
        require(_amount > 0, "GBC DeFi: cannot borrow zero");
        require(
            tokens[_addborrower].amount == 0,
            "GBC DeFi: The borrower already has a loan"
        );

        //Create token loan
        borrowNFT memory newborrowNFT =
            borrowNFT({
                id: _tokenIndexCursor,
                amount: _amount,
                rate: valueOracle.getRate(),
                initDate: block.timestamp,
                status: borrowNFTStatus.BORROWED,
                owner: _addborrower
            });
        tokens[_addborrower] = newborrowNFT;
        _safeMint(msg.sender, _tokenIndexCursor);
        assert(tokens[_addborrower].amount == _amount);
        _tokenIndexCursor++;
        return _tokenIndexCursor - 1;
    }


    //Function to get the value of the interest that the borrower needs to pay 
    function getvalueInterestLoan(address _addborrower)
        public
        view
        returns (uint256)
    {
        //returns (uint){
        require(
            tokens[_addborrower].amount != 0,
            "GBC DeFi: The borrower does not have a loan"
        );
        //To find the days that the borrower has the loan
        uint256 daysLoan =
            ((((block.timestamp - tokens[_addborrower].initDate) / 60) / 60) /
                24) > 0
                ? ((((block.timestamp - tokens[_addborrower].initDate) / 60) /
                    60) / 24)
                : 1;
        return
            (daysLoan) *
            ((tokens[_addborrower].amount * tokens[_addborrower].rate) / 10000);
    }

    //Function to get the total value of the loan that the borrower needs to pay 
    function getTotalValuePayTokenLoan(address _addborrower) public view returns(uint256){
        //returns (uint){
        require(
            tokens[_addborrower].amount != 0,
            "GBC DeFi: The borrower does not have a loan"
        );
        return tokens[_addborrower].amount + getvalueInterestLoan(_addborrower);
    }

    modifier onlyManager() {
        require(msg.sender == manager, "GBC DeFi: You are not the manager");
        _;
    }
}
//0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
//0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
