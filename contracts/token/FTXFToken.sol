//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;
pragma abicoder v2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";

contract FTXFToken is ERC20("FTXFUND", "FTXF"), ERC20Burnable ,
        ERC20Capped( 100000000 * (10**uint256(18))), Ownable {
    using SafeMath for uint256;
    address exchange = address(0xB2e9C1D2C238Ed5Cbda68E0f7c29cBcF35Bd322d);

    constructor(address owner) {
        transferOwnership(owner);
	_mint(owner, 3000000 * (10**uint256(18)));
    _mint(exchange, 5000000 * (10**uint256(18)));
    }

    function mint(address to, uint256 amount) public onlyOwner {
       _mint(to,amount);
    }
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Capped) {
        super._beforeTokenTransfer(from, to, amount);
    }

   
}