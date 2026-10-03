import ADDRESS_MANAGER_ABI from '@/configs/abi/addressManager.json';
import LOCK_INFO_ABI from '@/configs/abi/lockInfo.json';
import LOCK_V2_ABI from '@/configs/abi/lockV2.json';
import SEQUENCER_SET_ABI from '@/configs/abi/sequencerset.json';
import { getL2ChainIdByL1ChainId } from '@/utils/tools';
import { type Abi, type Address, createPublicClient, erc20Abi as erc20ABI, http, type PublicClient } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

export const defaultExpectedApr = 0.1; // 10%

export const MAX_ALLOWANCE = 2n ** 256n - 1n;
export const defaultRewardRecipient = '0x0000000000000000000000000000000000000000';

export const isProd = import.meta.env.MODE === 'production';
export const isDev = import.meta.env.MODE === 'development';

export const {
  VITE_APP_ASSET_BASE,
  VITE_APP_METIS_TOKEN,
  VITE_APP_LOCK_CONTRACT,
  VITE_APP_LOCK_INFO_CONTRACT,
  VITE_APP_LOCK_ADDRESS_MANAGER_CONTRACT,
  VITE_APP_SEPOLIA_METIS_TOKEN,
  VITE_APP_SEPOLIA_LOCK_CONTRACT,
  VITE_APP_SEPOLIA_LOCK_INFO_CONTRACT,
  VITE_APP_SEPOLIA_LOCK_ADDRESS_MANAGER_CONTRACT,
  VITE_APP_L2_CHAIN_ID,
  VITE_APP_L2_RPC,
  VITE_APP_L2_SEQ_SET_CONTRACT,
  VITE_APP_SEPOLIA_L2_CHAIN_ID,
  VITE_APP_SEPOLIA_L2_RPC,
  VITE_APP_SEPOLIA_L2_SEQ_SET_CONTRACT,
} = import.meta.env;

type ContractConfig = { address: Address; abi: Abi };
export const contracts: Record<
  'lockAddressManager' | 'lock' | 'lockInfo' | 'deposit' | 'metisSequencerSet',
  Record<string, ContractConfig>
> = {
  lockAddressManager: {
    [mainnet.id.toString()]: { address: VITE_APP_LOCK_ADDRESS_MANAGER_CONTRACT, abi: ADDRESS_MANAGER_ABI as Abi },
    [sepolia.id.toString()]: {
      address: VITE_APP_SEPOLIA_LOCK_ADDRESS_MANAGER_CONTRACT,
      abi: ADDRESS_MANAGER_ABI as Abi,
    },
  },
  lock: {
    [mainnet.id.toString()]: { address: VITE_APP_LOCK_CONTRACT, abi: LOCK_V2_ABI as Abi },
    [sepolia.id.toString()]: { address: VITE_APP_SEPOLIA_LOCK_CONTRACT, abi: LOCK_V2_ABI as Abi },
  },
  lockInfo: {
    [mainnet.id.toString()]: { address: VITE_APP_LOCK_INFO_CONTRACT, abi: LOCK_INFO_ABI as Abi },
    [sepolia.id.toString()]: { address: VITE_APP_SEPOLIA_LOCK_INFO_CONTRACT, abi: LOCK_INFO_ABI as Abi },
  },
  deposit: {
    [mainnet.id.toString()]: { address: VITE_APP_METIS_TOKEN, abi: erc20ABI },
    [sepolia.id.toString()]: { address: VITE_APP_SEPOLIA_METIS_TOKEN, abi: erc20ABI },
  },
  metisSequencerSet: {
    [VITE_APP_L2_CHAIN_ID.toString()]: { address: VITE_APP_L2_SEQ_SET_CONTRACT, abi: SEQUENCER_SET_ABI as Abi },
    [VITE_APP_SEPOLIA_L2_CHAIN_ID.toString()]: {
      address: VITE_APP_SEPOLIA_L2_SEQ_SET_CONTRACT,
      abi: SEQUENCER_SET_ABI as Abi,
    },
  },
};

export const defaultChainId = isProd ? mainnet.id.toString() : sepolia.id.toString();
export const defaultChain = isProd ? mainnet : sepolia;
export let serviceUrl: string | undefined;
export let l2Provider: PublicClient;

export const setL2Provider = (rpcUrl: string, chainId: number | string) => {
  l2Provider = createPublicClient({ transport: http(rpcUrl), pollingInterval: 60_000 });
  serviceUrl = `${VITE_APP_ASSET_BASE}${getL2ChainIdByL1ChainId(+chainId)}`;
};

export const explorer = {
  [mainnet.id.toString()]: 'https://etherscan.io',
  [sepolia.id.toString()]: 'https://sepolia.etherscan.io',
};

export const l2explorer = {
  [mainnet.id.toString()]: 'https://explorer.metis.io',
  [sepolia.id.toString()]: 'https://sepolia-explorer.metisdevops.link',
};

export const explorerName = {
  [mainnet.id.toString()]: 'Etherscan',
  [sepolia.id.toString()]: 'Sepolia',
};
