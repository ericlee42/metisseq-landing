/* eslint-disable no-negated-condition */
import LOCK_V2_ABI from '@/configs/abi/lockV2.json';
import LOCK_INFO_ABI from '@/configs/abi/lockInfo.json';
import SEQUENCER_SET_ABI from '@/configs/abi/sequencerset.json';
import { erc20ABI, mainnet } from 'wagmi';
import { goerli, holesky, sepolia } from 'viem/chains';
import { ethers } from 'ethers';

export const defaultExpectedApr = 0.2; // 20%

export const MAX_ALLOWANCE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const isProd = import.meta.env.MODE === 'production';

export const isDev = import.meta.env.MODE === 'development';

export const {
  // goerli
  VITE_APP_LOCK_CONTRACT,
  VITE_APP_METIS_TOKEN,
  // holeskt
  VITE_APP_HOLESKY_METIS_TOKEN,
  VITE_APP_HOLESKY_LOCK_CONTRACT,
  VITE_APP_HOLESKY_LOCK_INFO_CONTRACT,
  // sepolia
  VITE_APP_SEPOLIA_METIS_TOKEN,
  VITE_APP_SEPOLIA_LOCK_CONTRACT,
  // github
  VITE_APP_ASSET_BASE,
  // l2
  VITE_APP_L2_CHAIN_ID,
  VITE_APP_L2_RPC,
  VITE_APP_METIS_SEQ_SET_CONTRACT,
} = import.meta.env;
// export const lockContract = { address: VITE_APP_LOCK_CONTRACT, abi: LOCK_ABI };
// export const depositToken = { address: VITE_APP_METIS_TOKEN, abi: erc20ABI };

export const contracts = {
  lock: {
    [mainnet.id.toString()]: { address: VITE_APP_LOCK_CONTRACT, abi: LOCK_V2_ABI },
    [goerli.id.toString()]: { address: VITE_APP_LOCK_CONTRACT, abi: LOCK_V2_ABI },
    [holesky.id.toString()]: { address: VITE_APP_HOLESKY_LOCK_CONTRACT, abi: LOCK_V2_ABI },
    [sepolia.id.toString()]: { address: VITE_APP_SEPOLIA_LOCK_CONTRACT, abi: LOCK_V2_ABI },
  },
  lockInfo: {
    [mainnet.id.toString()]: { address: '', abi: LOCK_INFO_ABI },
    [goerli.id.toString()]: { address: '', abi: LOCK_INFO_ABI },
    [holesky.id.toString()]: { address: VITE_APP_HOLESKY_LOCK_INFO_CONTRACT, abi: LOCK_INFO_ABI },
    [sepolia.id.toString()]: { address: '', abi: LOCK_INFO_ABI },
  },
  deposit: {
    [mainnet.id.toString()]: { address: VITE_APP_METIS_TOKEN, abi: erc20ABI },
    [goerli.id.toString()]: { address: VITE_APP_METIS_TOKEN, abi: erc20ABI },
    [holesky.id.toString()]: { address: VITE_APP_HOLESKY_METIS_TOKEN, abi: erc20ABI },
    [sepolia.id.toString()]: { address: VITE_APP_SEPOLIA_METIS_TOKEN, abi: erc20ABI },
  },
  metisSequencerSet: {
    [VITE_APP_L2_CHAIN_ID.toString()]: { address: VITE_APP_METIS_SEQ_SET_CONTRACT, abi: SEQUENCER_SET_ABI },
  },
};

// obsolete
// export const basicChainId = isProd ? sepolia.id : goerli.id;

export const defaultPubKeyList = [
  {
    signer: '0xc541863d4a18da05dc77dd0003c302b19a1c074e',
    user: '0xc541863d4a18da05dc77dd0003c302b19a1c074e',
    address: '0xc541863d4a18da05dc77dd0003c302b19a1c074e',
    pubKey:
      '0xaa507c6f682049403a8408d761b60a6444c3a5c2dc54fd589bc5dc331f42065115e7517f8481472a14fdba79e586a18fb488cb36c6475a26b2f6f430b88d09b1',
    active: true,
  },

  {
    signer: '0x1067a5cccf2c1ff9d6571c7310853844d61c2404',
    user: '0x1067a5cccf2c1ff9d6571c7310853844d61c2404',
    address: '0x1067a5cccf2c1ff9d6571c7310853844d61c2404',
    pubKey:
      '0x792ad8ceb52b0e85e3302c564908607c77b61e746a76bdfcf42838641bc3984e49df86eac11bbe8c49236a5c2314a5a11978ab9e9d26db6d0ca78905e85823c4',
    active: true,
  },

  {
    signer: '0x77f2c00cd2e90bd5991530e7bfdd048443531ab6',
    user: '0x77f2c00cd2e90bd5991530e7bfdd048443531ab6',
    address: '0x77f2c00cd2e90bd5991530e7bfdd048443531ab6',
    pubKey:
      '0xceb8126fbf7b1e0ff1da5546316fd7f9d1e9d09c8cabef3e8a5502a9f024c151fa376b2949beed2482686e09263d13ef8d2192aad9d8f4e24b0776be5b5faa81',
    active: true,
  },
  {
    signer: '0x1267397fb5bf6f6dcc3d18d673616d512dbcd8f0',
    user: '0xb4ebe166513c578e33a8373f04339508bc7e8cfb',
    address: '0xb4ebe166513c578e33a8373f04339508bc7e8cfb',
    pubKey:
      '0xb548c2a036db2b5cdeb9501ff6c73e4653b691e3365e345bdddeb20145fa2f50f8a527550211b4b0664127a36f370d91c2adc33b14423327097f411c4c68ee96',
    active: true,
  },
];

export const serviceUrl = `${VITE_APP_ASSET_BASE}${VITE_APP_L2_CHAIN_ID}`;

export const graphUrl = {
  staking: {
    [mainnet.id.toString()]: '',
    [goerli.id.toString()]: 'http://staking.preview.metisdevops.link/l1/subgraphs/name/metis/staking',
    [holesky.id.toString()]: 'https://graphnode.holesky.metisdevops.link/subgraphs/name/metisio/sequencer-locking-dev',
    [sepolia.id.toString()]: '/l1/subgraphs/name/sepolia/staking',
  },
  block: {
    [mainnet.id.toString()]: '',
    [goerli.id.toString()]: 'http://staking.preview.metisdevops.link/metis/subgraphs/name/metis/block',
    [holesky.id.toString()]: 'https://graphnode.holesky.metisdevops.link/subgraphs/name/metisio/sequencer-set-dev',
    [sepolia.id.toString()]: '/l2/subgraphs/name/sepolia/block',
  },
};

// export const blockGraphUrl = isProd
//   ? 'https://sequencer.metisdevops.link/l2/subgraphs/name/holesky/block'
//   : 'http://staking.preview.metisdevops.link/metis/subgraphs/name/metis/block';

export const baseGraphUrl = {
  [mainnet.id.toString()]: graphUrl.staking[mainnet.id.toString()],
  [goerli.id.toString()]: graphUrl.staking[goerli.id.toString()],
  [holesky.id.toString()]: graphUrl.staking[holesky.id.toString()],
  [sepolia.id.toString()]: graphUrl.staking[sepolia.id.toString()],
};

export const explorer = {
  [mainnet.id.toString()]: 'https://etherscan.io',
  [goerli.id.toString()]: 'https://goerli.etherscan.io',
  [holesky.id.toString()]: 'https://holesky.etherscan.io',
  [sepolia.id.toString()]: 'https://sepolia.etherscan.io',
};

export const l2explorer = {
  [mainnet.id.toString()]: 'https://explorer.metis.io',
  [goerli.id.toString()]: 'https://explorer.metis.io',
  [holesky.id.toString()]: 'https://holesky.explorer.metisdevops.link',
  [sepolia.id.toString()]: 'https://sepolia.explorer.metisdevops.link',
};

export const explorerName = {
  [mainnet.id.toString()]: 'Etherscan',
  [goerli.id.toString()]: 'Goerli',
  [holesky.id.toString()]: 'Holesky',
  [sepolia.id.toString()]: 'Sepolia',
};

export const defaultChainId = isProd ? holesky.id.toString() : holesky.id.toString();
export const defaultChain = isProd ? holesky : holesky;

export const l2Gas = {
  [mainnet.id.toString()]: '200000',
  [goerli.id.toString()]: '200000',
  [holesky.id.toString()]: '200000',
  [sepolia.id.toString()]: '200000',
};

export const defaultRewardRecipient = '0x0000000000000000000000000000000000000000';

export const l2Provider = new ethers.providers.JsonRpcProvider(VITE_APP_L2_RPC);
l2Provider.pollingInterval = 12000;
