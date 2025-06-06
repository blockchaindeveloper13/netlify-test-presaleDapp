export const config = {
  chainId: 56, // BSC
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  contractAddress: '0x42395Db998595DC7256aF2a6f10DC7b2E6006993',
  contractABI: [
    {
      "inputs": [],
      "name": "buyTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalBNB",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRemainingTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        }
      ],
      "name": "withdrawForeignTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
};
