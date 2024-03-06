/* eslint-disable max-len */
import { contracts, l2Provider } from '@/configs/common';
import { Contract } from 'ethers';
import { useRecoilState } from 'recoil';
import {
  recoilCurrentActiveSeqAddress,
  recoilCurrentActiveSeqAddressLoading,
  recoilL2Block,
  recoilL2BlockLoading,
  recoilNextActiveSeqAddress,
} from '@/models';
import { useRef } from 'react';
import BigNumber from 'bignumber.js';

const mockActiveAddress = '';
// 节点状态判断
// 查询 currentEpoch & currentEpoch-1 && 当前l2的blockHeight
const useL2EpochStatus = () => {
  const currentContract = useRef<undefined | Contract>();
  const [l2Block, setL2Block] = useRecoilState(recoilL2Block);
  const [l2BlockLoading] = useRecoilState(recoilL2BlockLoading);
  const [currentEpochRelatedSeqAddress, setCurrentEpochRelatedSeqAddress] =
    useRecoilState(recoilCurrentActiveSeqAddress);
  const [nextEpochRelatedSeqAddress, setNextEpochRelatedSeqAddress] = useRecoilState(recoilNextActiveSeqAddress);
  const [currentActiveSeqAddressLoading, setCurrentActiveSeqAddressLoading] = useRecoilState(
    recoilCurrentActiveSeqAddressLoading,
  );

  async function getBlock(blockNumber?: string | number) {
    const block = await l2Provider.getBlock(blockNumber || 'latest');
    console.log(block);
    setL2Block(block?.number);
    return block;
  }

  async function getL2CurrentEpoch() {
    // const network = await l2Provider?.getNetwork();
    // const { chainId } = network;
    // const address = contracts?.metisSequencerSet?.[chainId?.toString()]?.address;
    // const abi = contracts?.metisSequencerSet?.[chainId?.toString()]?.abi;

    // const contract = new Contract(address, abi, undefined).connect(l2Provider);
    if (!currentContract.current) return {
        currentEpoch: undefined,
        prevEpoch: undefined,
      };
    const currentEpoch = await currentContract.current.currentEpoch();
    const prevEpochNumber = currentEpoch?.number.sub('1');
    const prevEpoch = await currentContract.current.epochs(prevEpochNumber);

    return { currentEpoch, prevEpoch };
  }

  const checkSeqStatus = async () => {
    try {
      console.log('--check Seq Status--');
      if (!currentEpochRelatedSeqAddress) {
        setCurrentActiveSeqAddressLoading(true);
      }

      // const l2Block = await getBlock();
      const l2BlockHeight = l2Block?.toString();
      if (BigNumber(l2BlockHeight).isZero() || BigNumber(l2BlockHeight).isNaN()) return undefined;

      const { currentEpoch, prevEpoch } = await getL2CurrentEpoch();

      if (currentEpoch?.startBlock.gt(l2BlockHeight)) {
        setNextEpochRelatedSeqAddress(currentEpoch?.signer);
      } else {
        setNextEpochRelatedSeqAddress(undefined);
      }

      // currentEpoch?.startBlock <= 当前高度 <= currentEpoch.endBlock
      if (currentEpoch?.startBlock.lte(l2BlockHeight) && currentEpoch.endBlock.gte(l2BlockHeight)) {
        setCurrentEpochRelatedSeqAddress(currentEpoch?.signer);
        return;
      }

      // prevEpoch?.startBlock <= 当前高度 <= prevEpoch.endBlock
      if (prevEpoch?.startBlock.lte(l2BlockHeight) && prevEpoch.endBlock.gte(l2BlockHeight)) {
        setCurrentEpochRelatedSeqAddress(prevEpoch?.signer);
        return;
      }

      setCurrentEpochRelatedSeqAddress(mockActiveAddress || undefined);

      return currentEpochRelatedSeqAddress;
    } catch (e) {
      // todo retry & error
      console.log('checkSeqStatus error', e);
    } finally {
      setCurrentActiveSeqAddressLoading(false);
    }
  };

  const initL2Event = async () => {
    console.log('--initL2Event--');
    const network = await l2Provider?.getNetwork();
    const { chainId } = network;
    const address = contracts?.metisSequencerSet?.[chainId?.toString()]?.address;
    const abi = contracts?.metisSequencerSet?.[chainId?.toString()]?.abi;

    const contract = new Contract(address, abi, undefined).connect(l2Provider);
    currentContract.current = contract;
    contract.on('NewEpoch', checkSeqStatus);
    contract.on('ReCommitEpoch', checkSeqStatus);

    return () => contract.removeAllListeners();
  };

  return {
    nextEpochRelatedSeqAddress,
    currentEpochRelatedSeqAddress,
    currentActiveSeqAddressLoading,
    l2Block,
    l2BlockLoading,
    checkSeqStatus,
    getL2CurrentEpoch,
    getBlock,
    initL2Event,
  };
};

export default useL2EpochStatus;
