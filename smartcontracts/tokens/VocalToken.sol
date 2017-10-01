
pragma solidity 0.4.11;

import "./UnlimitedAllowanceToken.sol";

contract VocalToken is UnlimitedAllowanceToken {

    uint8 constant public decimals = 18;
    uint public totalSupply = 10**27; // 1 billion tokens, 18 decimal places
    string constant public name = "0x Protocol Token";
    string constant public symbol = "Vocal";

    function VocalToken() {
        balances[msg.sender] = totalSupply;
    }
}
