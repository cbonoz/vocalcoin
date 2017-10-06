from web3 import Web3, HTTPProvider, IPCProvider

class Vocal:

    def __init__(self, contract_addr, abi_file='abi.json'):
        self.web3 = Web3(HTTPProvider('http://localhost:8545'))
        self.contract_addr = contract_addr
        with open(abi_file, 'r') as abi_definition:
            abi = json.load(abi_definition)
        print("Current block number: %d" % self.web3.eth.blockNumber)
        self.contract = self.web3.eth.contract(abi,contractAddress)

    # TODO: define methods that interact with the blockchain.


