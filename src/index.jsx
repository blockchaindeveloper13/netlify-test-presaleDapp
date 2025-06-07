import React from 'react';
import ReactDOM from 'react-dom/client';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { bsc } from '@reown/appkit/networks';
import App from './App';

const queryClient = new QueryClient();

// 1. Wagmi Adapter oluştur
const wagmiAdapter = new WagmiAdapter({
  networks: [bsc],
  projectId: process.env.REACT_APP_PROJECT_ID,
  ssr: false
});

// 2. AppKit yapılandırması
createAppKit({
  adapters: [wagmiAdapter],
  networks: [bsc],
  projectId: process.env.REACT_APP_PROJECT_ID ,
  metadata: {
    name: "BSC Presale Site",
    description: "Solium Coin Presale - Powered by Reown AppKit",
    url: window.location.origin,
    icons: ["https://soliumcoin.com/logo.png"]
  },
  features: {
    analytics: false,
    swaps: true,
    onramp: true
  },
  defaultNetwork: bsc,
  enableWalletConnect: true,
  debug: process.env.NODE_ENV === 'development'
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
