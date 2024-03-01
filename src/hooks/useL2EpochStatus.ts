/* eslint-disable max-len */
import { VITE_APP_METIS_SEQ_SET_CONTRACT, l2Provider } from '@/configs/common';
import { Contract } from 'ethers';
import SEQUENCER_SET_ABI from '@/configs/abi/sequencerset.json';
import { useRecoilState } from 'recoil';
import { recoilCurrentActiveSeqAddress, recoilCurrentActiveSeqAddressLoading, recoilL2Block } from '@/models';

const mockActiveAddress = '';
// 节点状态判断
// 查询 currentEpoch & currentEpoch-1 && 当前l2的blockHeight
const useL2EpochStatus = () => {
  const [l2Block, setL2Block] = useRecoilState(recoilL2Block);
  const [currentEpochRelatedSeqAddress, setCurrentEpochRelatedSeqAddress] =
    useRecoilState(recoilCurrentActiveSeqAddress);
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
    const contract = new Contract(VITE_APP_METIS_SEQ_SET_CONTRACT, SEQUENCER_SET_ABI, undefined).connect(l2Provider);
    const currentEpoch = await contract.currentEpoch();
    const prevEpochNumber = currentEpoch?.number.sub('1');
    const prevEpoch = await contract.epochs(prevEpochNumber);

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
      const { currentEpoch, prevEpoch } = await getL2CurrentEpoch();
      if (currentEpoch?.startBlock.lte(l2BlockHeight) && currentEpoch.endBlock.gte(l2BlockHeight)) {
        setCurrentEpochRelatedSeqAddress(currentEpoch?.signer);
        return;
      }

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

  const initL2Event = () => {
    const contract = new Contract(VITE_APP_METIS_SEQ_SET_CONTRACT, SEQUENCER_SET_ABI, undefined).connect(l2Provider);
    contract.on('NewEpoch', checkSeqStatus);
    contract.on('ReCommitEpoch', checkSeqStatus);

    return () => contract.removeAllListeners();
  };

  return {
    currentEpochRelatedSeqAddress,
    currentActiveSeqAddressLoading,
    l2Block,
    checkSeqStatus,
    getL2CurrentEpoch,
    getBlock,
    initL2Event,
  };
};

export default useL2EpochStatus;
