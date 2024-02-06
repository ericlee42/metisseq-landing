import { recoilMetisPrice } from '@/models';
import { useRequest } from 'ahooks';
import axios from 'axios';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

const url = 'https://api.coingecko.com/api/v3/simple/price?ids=metis-token&vs_currencies=usd';

const useMetisPrice = () => {
  const [metisPrice, setMetisPrice] = useRecoilState(recoilMetisPrice);
  const props = useRequest(() => axios.get(url), { manual: true });

  useEffect(() => {
    if (props?.data?.data?.['metis-token']?.usd) {
      setMetisPrice(props?.data?.data?.['metis-token']?.usd);
    }
  }, [props?.data?.data, setMetisPrice]);
  return { ...props, metisPrice };
};

export default useMetisPrice;
