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

## Example CURL route 
curl -v -H "Authorization: Bearer 123456789" -X POST  http://127.0.0.1:9007/api/vote