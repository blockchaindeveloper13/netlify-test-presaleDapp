import React, { useEffect } from 'react';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { BrowserProvider } from 'ethers';
import './WalletConnectButton.css';

function WalletConnectButton({ setProvider, setAccount }) {
  const { open } = useAppKit();
  const { address: appKitAddress, isConnected: isAppKitConnected } = useAppKitAccount();
  const { address, isConnected } = useAccount();
  const { walletProvider } = useAppKitProvider('eip155'); // WalletConnect provider
  const { disconnect } = useDisconnect();
  const { signMessage, isPending: isSigning } = useSignMessage();

  const activeAddress = appKitAddress || address;
  const activeIsConnected = isAppKitConnected || isConnected;
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    const updateProvider = async () => {
      console.log("Checking connection:", { activeIsConnected, activeAddress, walletProvider });
      if (activeIsConnected && activeAddress) {
        try {
          let ethProvider = null;
          // Trust Wallet dokümantasyonundan uyarlama: injected provider kontrolü
          if (window.ethereum && window.ethereum.isMetaMask) {
            ethProvider = window.ethereum;
            console.log("Using window.ethereum (MetaMask)");
          } else if (window.ethereum && window.ethereum.isTrust) {
            ethProvider = window.ethereum;
            console.log("Using window.ethereum (Trust Wallet)");
          } else if (window.trustwallet) {
            ethProvider = window.trustwallet;
            console.log("Using window.trustwallet");
          } else if (walletProvider) {
            ethProvider = walletProvider;
            console.log("Using WalletConnect provider from AppKit");
          } else {
            console.error("No provider available: walletProvider is null");
            alert(isMobile ? "Please open in Trust Wallet or MetaMask in-app browser" : "Please install MetaMask, Trust Wallet, or use WalletConnect");
            setProvider(null);
            setAccount(null);
            return;
          }

          // Ağ kontrolü
          const provider = new BrowserProvider(ethProvider);
          const network = await provider.getNetwork();
          console.log("Network check:", { chainId: network.chainId, name: network.name });
          if (network.chainId !== 56n) { // BSC Mainnet chainId
            console.error("Wrong network, expected BSC (56), got:", network.chainId);
            alert("Please switch to Binance Smart Chain");
            setProvider(null);
            setAccount(null);
            return;
          }

          console.log("Setting provider and account:", { provider, address: activeAddress });
          setProvider(provider);
          setAccount(activeAddress);
        } catch (error) {
          console.error("Provider setup error:", error.message);
          setProvider(null);
          setAccount(null);
        }
      } else {
        console.log("Not connected or no address:", { activeIsConnected, activeAddress, walletProvider });
        setProvider(null);
        setAccount(null);
      }
    };
    updateProvider();
  }, [activeIsConnected, activeAddress, walletProvider, setProvider, setAccount]);

  const handleConnect = async () => {
    try {
      console.log("Initiating wallet connection");
      await open({ view: "Connect", namespace: "eip155" });
      console.log("Wallet connect initiated");
    } catch (error) {
      console.error("Connection error:", error.message);
      alert(isMobile ? "Please confirm the connection in your wallet app" : "Wallet connection failed!");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setProvider(null);
      setAccount(null);
      console.log("Wallet disconnected");
      alert("Wallet disconnected!");
    } catch (error) {
      console.error("Disconnection error:", error.message);
    }
  };

  const handleSign = async () => {
    try {
      const providerSource = walletProvider || window.ethereum || window.trustwallet;
      if (providerSource) {
        const provider = new BrowserProvider(providerSource);
        const signer = await provider.getSigner();
        const signature = await signer.signMessage("Verify Solium Presale");
        console.log("Sign success:", signature);
        alert(`Signature: ${signature}`);
      } else {
        await signMessage({ message: "Verify Solium Presale" }, {
          onSuccess: (sig) => {
            console.log("Sign success:", sig);
            alert(`Signature: ${sig}`);
          },
          onError: (err) => console.error("Sign error:", err.message),
        });
      }
    } catch (error) {
      console.error("Sign error:", error.message);
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
            {activeAddress?.slice(0, 6)}...{activeAddress?.slice(-4)}
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