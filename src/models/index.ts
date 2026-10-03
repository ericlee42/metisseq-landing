import { atom } from 'jotai';
import { Address } from 'viem';

export const sequencerIdAtom = atom<string>('');

export const blockRewardAtom = atom<string>('0');

export const liquidateRewardAtom = atom<string>('0');

export const balanceAtom = atom<any>(null);

export const allowanceAtom = atom<any>(null);

export const sequencerInfoAtom = atom<any>(null);

export const sequencerTotalInfoAtom = atom<any>(null);

export const whitelistedAtom = atom<boolean>(false);

export const allSequencerInfoAtom = atom<any>(null);

export const metisPriceAtom = atom<string | number | undefined>(undefined);

export const rewardRecipientModalVisibleAtom = atom<boolean>(false);

export const l2BlockAtom = atom<bigint>(0n);

export const l2BlockLoadingAtom = atom<boolean>(true);

export const currentActiveSeqAddressAtom = atom<undefined | Address>(undefined);

export const nextActiveSeqAddressAtom = atom<undefined | Address>(undefined);

export const currentActiveSeqAddressLoadingAtom = atom<boolean>(true);
