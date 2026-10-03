import { balanceAtom } from '@/models';
import { useAtom } from 'jotai';

const useBalance = () => {
  const [balance] = useAtom(balanceAtom);
  return { balance };
};

export default useBalance;
