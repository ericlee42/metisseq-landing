import { createPublicClient, defineChain, http, type Chain, type PublicClient } from 'viem';
import { createConfig, WagmiProvider } from 'wagmi';
import { injected } from 'wagmi/connectors';
const _mainnet = defineChain({
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

const _sepolia = defineChain({
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
      http: ['https://1rpc.io/sepolia'],
    },
    public: {
      http: ['https://1rpc.io/sepolia'],
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
export const network: readonly [Chain, ...Chain[]] = [_mainnet, _sepolia];
export const config = createConfig({
  chains: network,
  connectors: [injected()],
  multiInjectedProviderDiscovery: false,
  transports: {
    [_mainnet.id]: http(),
    [_sepolia.id]: http(),
  },
});
export const injectedConnector = config.connectors[0];
export const txPublicClients: Record<number, PublicClient> = Object.fromEntries(
  network.map((chain) => [chain.id, createPublicClient({ chain, transport: http() })]),
);
export { WagmiProvider };
