import { recoilBalance } from '@/models';
import { useRecoilState } from 'recoil';

const useBalance = () => {
  const [balance] = useRecoilState(recoilBalance);
  return { balance };
};

export default useBalance;
