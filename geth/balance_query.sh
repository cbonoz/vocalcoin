#!/bin/bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x594947acf09d77fd0e19409904da07dc23ac6a14", "latest"],"id":1}' http://localhost:8545
