import { publicProvider } from '@wagmi/core/providers/public';
import { InjectedConnector } from '@wagmi/core';
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi';
import { createPublicClient, defineChain, http } from 'viem';

import { isProd } from './common';
import { holesky, sepolia } from 'viem/chains';

// disable wss, which is not available
const _holesky = defineChain({
  id: 17000,
  network: 'holesky',
  name: 'Holesky',
  nativeCurrency: { name: 'Holesky Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://ethereum-holesky.publicnode.com'],
    },
    public: {
      http: ['https://ethereum-holesky.publicnode.com'],
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 77,
    },
  },
  testnet: true,
});

export const chainId = isProd ? [_holesky, sepolia, mainnet] : [_holesky, sepolia, mainnet];

export const injectedConnector = new InjectedConnector({
  chains: [...chainId],
});

const { chains, publicClient } = configureChains([...chainId], [publicProvider()]);

const config = createConfig({
  autoConnect: true,
  connectors: [injectedConnector],
  publicClient,
});
;

export const mainnetTxPublicClient = createPublicClient({
  chain: mainnet,
  // transport,
  transport: http(),
});
export const holeskyTxPublicClient = createPublicClient({
  chain: holesky,
  // transport,
  transport: http(),
});

export const sepoliaTxPublicClient = createPublicClient({
  chain: sepolia,
  // transport,
  transport: http(),
});

export const txPublicClients = {
  [sepolia.id.toString()]: sepoliaTxPublicClient,
  [mainnet.id.toString()]: mainnetTxPublicClient,
  [holesky.id.toString()]: holeskyTxPublicClient,
};

export { config, WagmiConfig as WagmiProvider, publicClient };
