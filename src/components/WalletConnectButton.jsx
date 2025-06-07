import React, { useEffect } from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { BrowserProvider } from 'ethers';
import './styles.css';

function WalletConnectButton({ setProvider, setAccount }) {
  // AppKit Hook'ları
  const { open } = useAppKit();
  const { address: appKitAddress, isConnected: isAppKitConnected } = useAppKitAccount();

  // Wagmi Hook'ları
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessage, isPending: isSigning } = useSignMessage();

  // Birleştirilmiş durum
  const activeAddress = appKitAddress || address;
  const activeIsConnected = isAppKitConnected || isConnected;

  // Mobil kontrolü
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    const updateProvider = async () => {
      if (activeIsConnected && activeAddress) {
        try {
          // Mobil için alternatif provider kontrolü
          const ethProvider = window.ethereum || (isMobile && await detectMobileProvider());
          const provider = new BrowserProvider(ethProvider);
          setProvider(provider);
          setAccount(activeAddress);
        } catch (error) {
          console.error("Provider error:", error);
        }
      } else {
        setProvider(null);
        setAccount(null);
      }
    };
    updateProvider();
  }, [activeIsConnected, activeAddress, isMobile]);

  // Mobil cüzdan provider'ı tespiti
  const detectMobileProvider = async () => {
    if (isMobile && !window.ethereum) {
      alert("Please connect via your wallet's in-app browser");
      return null;
    }
    return window.ethereum;
  };

  const handleConnect = async () => {
    try {
      if (isMobile && !window.ethereum) {
        alert("Please connect via your wallet's in-app browser");
        return;
      }
      await open({ view: "Connect", namespace: "eip155" });
    } catch (error) {
      console.error("Connection error:", error);
      alert(isMobile ? "Please confirm the connection in your wallet app" : "Wallet connection failed!");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      alert("Wallet disconnected!");
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  };

  const handleSign = async () => {
    try {
      if (isMobile) {
        // Mobil için alternatif imzalama
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const signature = await signer.signMessage("Verify Solium Presale");
        alert(`Signature: ${signature}`);
      } else {
        await signMessage({ message: "Verify Solium Presale" }, {
          onSuccess: (sig) => alert(`Signature: ${sig}`),
          onError: (err) => console.error("Sign error:", err)
        });
      }
    } catch (error) {
      console.error("Sign error:", error);
      alert(isMobile ? "Approve the signature in your wallet" : "Sign failed!");
    }
  };

  return (
    <div className={`wallet-connect-container ${isMobile ? 'mobile' : ''}`}>
      {!activeIsConnected ? (
        <button onClick={handleConnect} className="connect-button">
          {isMobile ? "Mobile Connect" : "Connect Wallet"}
        </button>
      ) : (
        <div className="wallet-connected">
          <span className="wallet-address">
            {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
          </span>
          <div className="button-group">
            <button onClick={handleDisconnect} className="disconnect-button">
              Disconnect
            </button>
            <button 
              onClick={handleSign} 
              disabled={isSigning}
              className="sign-button"
            >
              {isSigning ? "Signing..." : "Sign"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletConnectButton;
