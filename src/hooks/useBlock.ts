import { recoilLatestBlock } from '@/models';
import { useRecoilState } from 'recoil';

const useBlock = () => {
  const [latestBlock] = useRecoilState(recoilLatestBlock);

  return { block: latestBlock, data: undefined, loading: false, error: undefined };
};

export default useBlock;
