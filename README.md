# Vocal Repository

---

## Contents:
* geth (abi for contract - experimental folder)
* whitepaper (vocal whitepaper tex and build output files such as the pdf)
* vocal (website code)
* vocalcontract (smart contracts)


## Additional Notes:

## Truffle Instructions:

Instructions to deploy contract to testnet

```
cd vocal/vocalcontract
truffle compile
truffle migrate --network ropsten
```

## Vocal Contract Address:
0x6135004c5b2b44493779ce86d6739f57dde674e0

## Example CURL command to test blockchain routes: 
curl -v -H "Authorization: Bearer 123456789" -X POST  http://127.0.0.1:9007/api/vote

## Instructions for Users:
* Sign up for a wallet at https://www.myetherwallet.com/ (on the Ropsten network) or use existing wallet if you have one . 
![Ropsten](assets/ropsten.png)
* Please make sure to remember your password and seed when signing up for one. If you lose your password, your coins will be lost forever.
* Signing up for your wallet should give you a wallet address similar to 0xefb202e9a3cdf87bdefc19928920d06555f64d75. It should start 0x and be a mix of letters and numbers.
* The wallet address should be entered when signing up for an account on Vocal. It is needed to be able to receive VocalCoins for participation.
