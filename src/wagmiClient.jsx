import { chain, createClient } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains: [chain.bsc] }),
    new WalletConnectConnector({
      chains: [chain.bsc],
      options: {
        qrcode: true,
      },
    }),
  ],
})
