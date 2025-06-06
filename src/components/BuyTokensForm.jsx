import React, { useState, useEffect } from 'react';
import { buyTokens, detectWalletType } from '../contract';
import './BuyTokensForm.css';

const BuyTokensForm = ({ provider, account }) => {
  console.log("BuyTokensForm props:", { provider: !!provider, account });
  const [bnbAmount, setBnbAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletType, setWalletType] = useState('');
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    if (provider && account) {
      const type = detectWalletType();
      setWalletType(type);
      console.log("Wallet type detected:", type, { provider, account });
    } else {
      setWalletType('');
      console.log("No wallet type detected:", { provider: !!provider, account });
    }
  }, [provider, account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTxHash('');

    if (!provider || !account) {
      setError('Please connect your wallet first!');
      console.log("Submit blocked: missing provider or account");
      return;
    }

    if (!bnbAmount || isNaN(bnbAmount)) {
      setError('Please enter a valid BNB amount');
      console.log("Submit blocked: invalid BNB amount");
      return;
    }

    const amount = parseFloat(bnbAmount);
    if (amount < 0.01) {
      setError('Minimum purchase amount is 0.01 BNB');
      console.log("Submit blocked: amount below minimum");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Submitting buyTokens:", { provider, account, amount });
      const receipt = await buyTokens(provider, account, amount);
      setBnbAmount('');
      setTxHash(receipt.transactionHash);
      console.log("Transaction successful:", { txHash: receipt.transactionHash });

      alert(walletType === 'WalletConnect' || walletType === 'MetaMask'
        ? 'Purchase successful! Tokens will arrive shortly. Check your wallet.'
        : 'Purchase successful! Tokens will be sent to your wallet.');
    } catch (error) {
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch') || error.code === 'UNKNOWN_ERROR') {
        errorMessage = 'Network error. Try changing RPC in wallet settings (Settings > Network > Smart Chain)';
      } else if (error.code === 4001 || error.message.includes('User denied')) {
        errorMessage = 'Transaction was cancelled by user';
      } else if (error.message.includes('gas') || error.message.includes('underpriced')) {
        errorMessage = 'Gas error. Please try again with higher gas limit';
      }
      setError(`Transaction failed: ${errorMessage}`);
      console.error("Transaction failed:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBnbAmount(value);
    }
  };

  return (
    <form className="buy-tokens-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Purchase SLM Tokens</h2>
        {walletType && (
          <div className={`wallet-badge ${walletType.toLowerCase().replace(' ', '-')}`}>
            {walletType}
          </div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="bnb-amount">BNB Amount (Min 0.01 BNB)</label>
      <div className="input-wrapper">
        <input
          type="text"
          id="bnb-amount"
          value={bnbAmount}
          onChange={handleAmountChange}
          placeholder="0.00"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          disabled={isLoading}
        />
        <span className="currency">BNB</span>
      </div>
    </div>
    {error && (
      <div className="error-message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    )}
    {txHash && (
      <div className="success-message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
        <a
          href={`https://bscscan.com/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View transaction on BscScan
        </a>
      </div>
    )}
    <button
      type="submit"
      className={`buy-button ${isLoading ? 'loading' : ''}`}
      disabled={isLoading || !provider || !account}
    >
      {isLoading ? (
        <>
          <span className="spinner"></span>
          Processing...
        </>
      ) : !provider || !account ? (
        'Connect Wallet to Buy'
      ) : (
        `Buy SLM Tokens (1 BNB = 10,000 SLM)`
      )}
    </button>
    <div className="notice">
      <div className="notice-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <p>Tokens will be distributed automatically after purchase</p>
      </div>
      <div className="notice-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <p>Minimum purchase: 0.01 BNB</p>
      </div>
      {walletType === 'WalletConnect' && (
        <div className="notice-item trust-wallet-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p>Using WalletConnect? Make sure you're on Binance Smart Chain network</p>
        </div>
      )}
    </div>
  </form>
);
};

export default BuyTokensForm;