import { contracts, l2Provider, setL2Provider } from '@/configs/common';
import {
  currentActiveSeqAddressAtom,
  currentActiveSeqAddressLoadingAtom,
  l2BlockAtom,
  l2BlockLoadingAtom,
  nextActiveSeqAddressAtom,
} from '@/models';
import { watchL2 } from '@/utils/l2';
import { getL2ChainIdByL1ChainId, getL2RpcByL1ChainId } from '@/utils/tools';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export default function useL2Block(chainId: number) {
  const setBlock = useSetAtom(l2BlockAtom);
  const setLoading = useSetAtom(l2BlockLoadingAtom);
  const setCurrent = useSetAtom(currentActiveSeqAddressAtom);
  const setNext = useSetAtom(nextActiveSeqAddressAtom);
  const setEpochLoading = useSetAtom(currentActiveSeqAddressLoadingAtom);
  useEffect(() => {
    setBlock(0n);
    setLoading(true);
    setCurrent(undefined);
    setNext(undefined);
    setEpochLoading(true);
    setL2Provider(getL2RpcByL1ChainId(chainId), chainId);
    const l2ChainId = Number(getL2ChainIdByL1ChainId(chainId));
    return watchL2(l2Provider, l2ChainId, contracts.metisSequencerSet[l2ChainId], {
      block: (block) => {
        setBlock(block);
        setLoading(false);
      },
      epoch: (current, next) => {
        setCurrent(current);
        setNext(next);
        setEpochLoading(false);
      },
      error: () => {
        setLoading(false);
        setEpochLoading(false);
      },
    });
  }, [chainId, setBlock, setLoading, setCurrent, setNext, setEpochLoading]);
}
