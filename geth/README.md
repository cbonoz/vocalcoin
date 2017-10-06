# geth workspace directory
---
This dir is used for eth experimentation on a local blockchain

### Dev Notes:


### Useful links:
Ethereum/Geth cli (basics): https://ethereum.org/cli
Creating a local geth blockchain (with genesis block) tutorial:https://media.consensys.net/how-to-build-a-private-ethereum-blockchain-fbf3904f337
JSON RPC commands for blockchain interaction: https://github.com/ethereum/wiki/wiki/JSON-RPC

### Useful commands:
geth init <genesis.json file>
geth removedb (clears the existing local blockchain)

geth console
geth --fast --cache=1024 console
geth attach

### Example commands:
// Note that eth.getBalance returns the balance of the account in Wei.
1000000000000000000 Wei = 1 eth
> eth.getBalance(x)/1000000000000000000<br/>
0.03151563838017541



