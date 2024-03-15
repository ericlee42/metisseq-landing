/* eslint-disable max-len */
/* eslint-disable no-negated-condition */
import LOCK_V2_ABI from '@/configs/abi/lockV2.json';
import LOCK_INFO_ABI from '@/configs/abi/lockInfo.json';
import ADDRESS_MANAGER_ABI from '@/configs/abi/addressManager.json';
import SEQUENCER_SET_ABI from '@/configs/abi/sequencerset.json';
import { erc20ABI, mainnet } from 'wagmi';
import { holesky, sepolia } from 'viem/chains';
import { ethers } from 'ethers';
import { getL2ChainIdByL1ChainId, getL2RpcByL1ChainId } from '@/utils/tools';

export const defaultExpectedApr = 0.2; // 20%

export const MAX_ALLOWANCE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const defaultRewardRecipient = '0x0000000000000000000000000000000000000000';

export const isProd = import.meta.env.MODE === 'production';
export const isDev = import.meta.env.MODE === 'development';

export const {
  // github
  VITE_APP_ASSET_BASE,
  // mainnet
  VITE_APP_METIS_TOKEN,
  VITE_APP_LOCK_CONTRACT,
  VITE_APP_LOCK_INFO_CONTRACT,
  VITE_APP_LOCK_ADDRESS_MANAGER_CONTRACT,
  // holesky
  VITE_APP_HOLESKY_METIS_TOKEN,
  VITE_APP_HOLESKY_LOCK_CONTRACT,
  VITE_APP_HOLESKY_LOCK_INFO_CONTRACT,
  VITE_APP_HOLESKY_LOCK_ADDRESS_MANAGER_CONTRACT,
  // sepolia
  VITE_APP_SEPOLIA_METIS_TOKEN,
  VITE_APP_SEPOLIA_LOCK_CONTRACT,
  VITE_APP_SEPOLIA_LOCK_INFO_CONTRACT,
  VITE_APP_SEPOLIA_LOCK_ADDRESS_MANAGER_CONTRACT,
  // l2-mainnet
  VITE_APP_L2_CHAIN_ID,
  VITE_APP_L2_RPC,
  VITE_APP_L2_SEQ_SET_CONTRACT,
  // l2-holesky-testnet
  VITE_APP_HOLESKY_L2_CHAIN_ID,
  VITE_APP_HOLESKY_L2_RPC,
  VITE_APP_HOLESKY_L2_SEQ_SET_CONTRACT,
  // l2-sepolia-testnet
  VITE_APP_SEPOLIA_L2_CHAIN_ID,
  VITE_APP_SEPOLIA_L2_RPC,
  VITE_APP_SEPOLIA_L2_SEQ_SET_CONTRACT,
} = import.meta.env;

export const contracts = {
  lockAddressManager: {
    [mainnet.id.toString()]: { address: VITE_APP_LOCK_ADDRESS_MANAGER_CONTRACT, abi: ADDRESS_MANAGER_ABI },
    [holesky.id.toString()]: { address: VITE_APP_HOLESKY_LOCK_ADDRESS_MANAGER_CONTRACT, abi: ADDRESS_MANAGER_ABI },
    [sepolia.id.toString()]: { address: VITE_APP_SEPOLIA_LOCK_ADDRESS_MANAGER_CONTRACT, abi: ADDRESS_MANAGER_ABI },
  },
  lock: {
    [mainnet.id.toString()]: { address: VITE_APP_LOCK_CONTRACT, abi: LOCK_V2_ABI },
    [holesky.id.toString()]: { address: VITE_APP_HOLESKY_LOCK_CONTRACT, abi: LOCK_V2_ABI },
    [sepolia.id.toString()]: { address: VITE_APP_SEPOLIA_LOCK_CONTRACT, abi: LOCK_V2_ABI },
  },
  lockInfo: {
    [mainnet.id.toString()]: { address: VITE_APP_LOCK_INFO_CONTRACT, abi: LOCK_INFO_ABI },
    [holesky.id.toString()]: { address: VITE_APP_HOLESKY_LOCK_INFO_CONTRACT, abi: LOCK_INFO_ABI },
    [sepolia.id.toString()]: { address: VITE_APP_SEPOLIA_LOCK_INFO_CONTRACT, abi: LOCK_INFO_ABI },
  },
  deposit: {
    [mainnet.id.toString()]: { address: VITE_APP_METIS_TOKEN, abi: erc20ABI },
    [holesky.id.toString()]: { address: VITE_APP_HOLESKY_METIS_TOKEN, abi: erc20ABI },
    [sepolia.id.toString()]: { address: VITE_APP_SEPOLIA_METIS_TOKEN, abi: erc20ABI },
  },
  metisSequencerSet: {
    [VITE_APP_L2_CHAIN_ID.toString()]: { address: VITE_APP_L2_SEQ_SET_CONTRACT, abi: SEQUENCER_SET_ABI },
    [VITE_APP_HOLESKY_L2_CHAIN_ID.toString()]: {
      address: VITE_APP_HOLESKY_L2_SEQ_SET_CONTRACT,
      abi: SEQUENCER_SET_ABI,
    },
    [VITE_APP_SEPOLIA_L2_CHAIN_ID.toString()]: {
      address: VITE_APP_SEPOLIA_L2_SEQ_SET_CONTRACT,
      abi: SEQUENCER_SET_ABI,
    },
  },
};

export const defaultChainId = isProd ? mainnet.id.toString() : sepolia.id.toString();
export const defaultChain = isProd ? mainnet : sepolia;

// todo first render
export let serviceUrl;
export let l2Provider;

export const setL2Provider = (rpcUrl, chainId) => {
  l2Provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  l2Provider.pollingInterval = 60_000;
  serviceUrl = `${VITE_APP_ASSET_BASE}${getL2ChainIdByL1ChainId(+chainId)}`;
};


export const graphUrl = {
  staking: {
    [mainnet.id.toString()]: 'https://subgraph.satsuma-prod.com/47e49d69fc65/erics-team--2882992/metis-sequencer-locking/api',
    [holesky.id.toString()]: 'https://graphnode.holesky.metisdevops.link/subgraphs/name/metisio/sequencer-locking',
    [sepolia.id.toString()]: 'https://subgraph.satsuma-prod.com/47e49d69fc65/erics-team--2882992/metis-sepolia-sequencer-locking/api',
  },
  block: {
    [mainnet.id.toString()]: 'https://andromeda-subgraph.metisdevops.link/subgraphs/name/metisio/sequencer-set',
    [holesky.id.toString()]: 'https://graphnode.holesky.metisdevops.link/subgraphs/name/metisio/sequencer-set',
    [sepolia.id.toString()]: 'https://sepolia-subgraph.metisdevops.link/subgraphs/name/metisio/sequencer-set',
  },
};

export const baseGraphUrl = {
  [mainnet.id.toString()]: graphUrl.staking[mainnet.id.toString()],
  [holesky.id.toString()]: graphUrl.staking[holesky.id.toString()],
  [sepolia.id.toString()]: graphUrl.staking[sepolia.id.toString()],
};

export const explorer = {
  [mainnet.id.toString()]: 'https://etherscan.io',
  [holesky.id.toString()]: 'https://holesky.etherscan.io',
  [sepolia.id.toString()]: 'https://sepolia.etherscan.io',
};

export const l2explorer = {
  [mainnet.id.toString()]: 'https://explorer.metis.io',
  [holesky.id.toString()]: 'https://explorer.holesky.metisdevops.link',
  [sepolia.id.toString()]: 'https://sepolia-explorer.metisdevops.link',
};

export const explorerName = {
  [mainnet.id.toString()]: 'Etherscan',
  [holesky.id.toString()]: 'Holesky',
  [sepolia.id.toString()]: 'Sepolia',
};


