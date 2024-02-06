import { atom } from 'recoil';

export const recoilSequencerId = atom<string>({
  key: 'sequencerId',
  default: '',
});

export const recoilBlockReward = atom<string>({
  key: 'blockReward',
  default: '0',
});

export const recoilLiquidateReward = atom<string>({
  key: 'liquidateReward',
  default: '0',
});

export const recoilBalance = atom<any>({
  key: 'balance',
  default: null,
});

export const recoilAllowance = atom<any>({
  key: 'allowance',
  default: null,
});

export const recoilSequencerInfo = atom<any>({
  key: 'sequencerInfo',
  default: null,
});

export const recoilSequencerTotalInfo = atom<any>({
  key: 'sequencerTotalInfo',
  default: null,
});

export const recoilWhitelisted = atom<boolean>({
  key: 'whitelisted',
  default: false,
});

export const recoilLatestBlock = atom<any>({
  key: 'latestBlock',
  default: null,
});

export const recoilAllSequencerInfo = atom<any>({
  key: 'allSequencerInfo',
  default: null,
});

export const recoilMetisPrice = atom<string | number | undefined>({
  key: 'metisPrice',
  default: undefined,
});
