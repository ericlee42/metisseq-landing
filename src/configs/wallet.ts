import { InjectedConnector } from '@wagmi/core';
import { publicProvider } from '@wagmi/core/providers/public';
import { createPublicClient, defineChain, http } from 'viem';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';

import { isProd } from './common';

export const _mainnet = defineChain({
  id: 1,
  network: 'homestead',
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: ['https://eth-mainnet.g.alchemy.com/v2'],
      webSocket: ['wss://eth-mainnet.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://mainnet.infura.io/v3'],
      webSocket: ['wss://mainnet.infura.io/ws/v3'],
    },
    default: {
      http: ['https://eth-mainnet.token.im'],
    },
    public: {
      http: ['https://eth-mainnet.token.im'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62',
      blockCreated: 16966585,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
  },
});

export const _sepolia = defineChain({
  id: 11_155_111,
  network: 'sepolia',
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: ['https://eth-sepolia.g.alchemy.com/v2'],
      webSocket: ['wss://eth-sepolia.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://sepolia.infura.io/v3'],
      webSocket: ['wss://sepolia.infura.io/ws/v3'],
    },
    default: {
      http: ['https://eth-sepolia.public.blastapi.io'],
    },
    public: {
      http: ['https://eth-sepolia.public.blastapi.io'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 751532,
    },
    ensRegistry: { address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' },
    ensUniversalResolver: {
      address: '0x21B000Fd62a880b2125A61e36a284BB757b76025',
      blockCreated: 3914906,
    },
  },
  testnet: true,
});

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

export const network = isProd ? [_mainnet, _sepolia] : [_mainnet, _sepolia, _holesky];

export const injectedConnector = new InjectedConnector({
  chains: [...network],
});

const { chains, publicClient } = configureChains([...network], [publicProvider()]);

const config = createConfig({
  autoConnect: true,
  connectors: [injectedConnector],
  publicClient,
});

export const mainnetTxPublicClient = createPublicClient({
  chain: _mainnet,
  // transport,
  transport: http(),
});
export const holeskyTxPublicClient = createPublicClient({
  chain: _holesky,
  // transport,
  transport: http(),
});

export const sepoliaTxPublicClient = createPublicClient({
  chain: _sepolia,
  // transport,
  transport: http(),
});

export const txPublicClients = {
  [_sepolia.id.toString()]: sepoliaTxPublicClient,
  [_mainnet.id.toString()]: mainnetTxPublicClient,
  [_holesky.id.toString()]: holeskyTxPublicClient,
};

export { WagmiConfig as WagmiProvider, config, publicClient };
