import { l2Provider } from '@/configs/common';
import { recoilL2Block, recoilL2BlockLoading } from '@/models';
import BigNumber from 'bignumber.js';
import { useRecoilState } from 'recoil';
// import useAuth from './useAuth';

const useL2Block = () => {
  // const { relatedL2Provider } = useAuth();
  const [l2Block, setL2Block] = useRecoilState(recoilL2Block);
  const [l2BlockLoading, setL2BlockLoading] = useRecoilState(recoilL2BlockLoading);


  const watchBlock = async (chainId: number) => {
    const network = await l2Provider?.getNetwork();
    const { chainId: providerChainId } = network;

    if (!BigNumber(chainId).eq(providerChainId)) {
      l2Provider?.off('block');
      return;
    }
    l2Provider?.on('block', (blockNumber) => {
      console.log('--update block--');
      setL2Block(blockNumber);
      setL2BlockLoading(false);
    });

    return () => {
      console.log('--off block event--');
      l2Provider?.off('block');
    };
  };

  return { l2Block, watchBlock };
};

export default useL2Block;
