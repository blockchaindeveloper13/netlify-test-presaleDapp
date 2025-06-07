import './BuyTokensForm.css'; // Dosyanın en üstüne ekleyin
import React, { useState } from 'react';
import { buyTokens } from '../contract';

const BuyTokensForm = ({ provider, account }) => {
  const [bnbAmount, setBnbAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!provider || !account) {
      setError('Please connect your wallet first!');
      return;
    }
    
    if (!bnbAmount || isNaN(bnbAmount)) {
      setError('Please enter a valid BNB amount');
      return;
    }
    
    const amount = parseFloat(bnbAmount);
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setIsLoading(true);
    try {
      await buyTokens(provider, account, amount);
      setBnbAmount('');
      alert('Purchase successful! Tokens will be sent to your wallet.');
    } catch (error) {
      let errorMessage = error.reason || error.message;
      if (error.info && error.info.error) {
        errorMessage = error.info.error.message;
      }
      setError(`Transaction failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="buy-tokens-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="bnb-amount">BNB Amount (Min 0.01 BNB)</label>
        <input
          type="number"
          id="bnb-amount"
          value={bnbAmount}
          onChange={(e) => setBnbAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          disabled={isLoading}
        />
      </div>
      
      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        className="buy-button"
        disabled={isLoading || !provider || !account}
      >
        {!provider || !account 
          ? "Connect Wallet to Buy"
          : isLoading 
            ? "Processing Transaction..."
            : "Buy SLM Tokens Now"}
      </button>
      
      <div className="notice">
        <p>Tokens will be automatically distributed to your wallet immediately after purchase confirmation.</p>
        <p>1 BNB = 10,000 SLM</p>
      </div>
    </form>
  );
};

export default BuyTokensForm;
