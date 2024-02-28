import { l2Provider } from '@/configs/common';
import { recoilL2Block } from '@/models';
import { useRecoilState } from 'recoil';

const useL2Block = () => {
  const [l2Block, setL2Block] = useRecoilState(recoilL2Block);
  const watchBlock = () => {
    l2Provider.on('block', (blockNumber) => {
      console.log('--update block--');
      setL2Block(blockNumber);
    });

    return () => {
      l2Provider.off('block');
    };
  };

  return { l2Block, watchBlock };
};

export default useL2Block;
