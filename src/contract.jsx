import { ethers, formatEther, parseEther } from 'ethers';

const CONTRACT_ADDRESS = '0x42395Db998595DC7256aF2a6f10DC7b2E6006993';
const CONTRACT_ABI = [
  {
    inputs: [],
    name: 'buyTokens',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'saleEnded',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'salePaused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalRaised',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'hardCap',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRemainingTokens',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokensPerUnit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export async function buyTokens(provider, account, bnbAmount) {
  try {
    if (!provider || !account) {
      throw new Error('Wallet not connected');
    }

    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const value = parseEther(bnbAmount.toString());

    // Check contract state
    const saleEnded = await contract.saleEnded();
    if (saleEnded) {
      throw new Error('Presale has ended.');
    }
    const salePaused = await contract.salePaused();
    if (salePaused) {
      throw new Error('Presale is paused.');
    }
    const totalRaisedRaw = await contract.totalRaised();
    const hardCapRaw = await contract.hardCap();
    // Convert to BigInt
    const totalRaised = BigInt(totalRaisedRaw);
    const hardCap = BigInt(hardCapRaw);
    if (totalRaised + value > hardCap) {
      throw new Error('Presale hardcap reached.');
    }
    const tokenPriceRaw = await contract.tokenPrice();
    const tokenPrice = BigInt(tokenPriceRaw);
    if (value < tokenPrice) {
      throw new Error(`Minimum ${formatEther(tokenPrice)} BNB required.`);
    }
    const tokensPerUnitRaw = await contract.tokensPerUnit();
    const tokensPerUnit = BigInt(tokensPerUnitRaw);
    const units = value / tokenPrice;
    const totalTokens = units * tokensPerUnit;
    const remainingTokensRaw = await contract.getRemainingTokens();
    const remainingTokens = BigInt(remainingTokensRaw);
    if (remainingTokens < totalTokens) {
      throw new Error('Not enough tokens available in presale.');
    }

    // Gas limit and price
    const gasLimit = 750000;
    const gasPrice = ethers.parseUnits('15', 'gwei');

    const txOptions = {
      value,
      gasLimit,
      gasPrice,
    };

    const tx = await contract.buyTokens(txOptions);
    const receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.error('buyTokens error:', error.message);
    if (error.message.includes('Failed to fetch') || error.code === 'UNKNOWN_ERROR' || error.code === 'NETWORK_ERROR') {
      throw new Error(
        'Network error. In Trust Wallet, go to Settings > Networks > Binance Smart Chain and set RPC URL to https://bsc-dataseed1.binance.org/ or https://bsc-dataseed2.ninicoin.io/. If issue persists, try a VPN or switch networks.'
      );
    }
    if (error.code === 4001 || error.message.includes('User denied')) {
      throw new Error('Transaction rejected by user');
    }
    if (error.message.includes('insufficient funds')) {
      throw new Error('Insufficient BNB: Add more BNB to your wallet.');
    }
    if (error.message.includes('gas') || error.message.includes('underpriced')) {
      throw new Error('Gas error. Transaction may require higher gas limit or price.');
    }
    if (error.message.includes('balanceOf failed') || error.message.includes('Token transfer failed')) {
      throw new Error('Presale contract failed to process token transfer. Contact support.');
    }
    if (error.message.includes('add is not a function')) {
      throw new Error('Internal error: Invalid data format from contract. Contact support.');
    }
    throw new Error(`Transaction failed: ${error.message}`);
  }
}

export function detectWalletType() {
  if (window.trustwallet || window.ethereum?.isTrust) {
    return 'TrustWallet';
  }
  if (window.ethereum?.isMetaMask) {
    return 'MetaMask';
  }
  if (window.web3 || window.ethereum) {
    return 'WalletConnect';
  }
  return 'Unknown';
}