import {
  currentActiveSeqAddressAtom,
  currentActiveSeqAddressLoadingAtom,
  l2BlockAtom,
  l2BlockLoadingAtom,
  nextActiveSeqAddressAtom,
} from '@/models';
import { useAtomValue } from 'jotai';

export default function useL2EpochStatus() {
  return {
    currentEpochRelatedSeqAddress: useAtomValue(currentActiveSeqAddressAtom),
    nextEpochRelatedSeqAddress: useAtomValue(nextActiveSeqAddressAtom),
    currentActiveSeqAddressLoading: useAtomValue(currentActiveSeqAddressLoadingAtom),
    l2Block: useAtomValue(l2BlockAtom),
    l2BlockLoading: useAtomValue(l2BlockLoadingAtom),
  };
}
