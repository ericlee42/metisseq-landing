import { metisPriceAtom } from '@/models';
import { useRequest } from 'ahooks';
import { fetchJson } from '@/utils/http';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

const url = 'https://api.coingecko.com/api/v3/simple/price?ids=metis-token&vs_currencies=usd';

const useMetisPrice = () => {
  const [metisPrice, setMetisPrice] = useAtom(metisPriceAtom);
  const props = useRequest(() => fetchJson<{ 'metis-token'?: { usd?: number } }>(url), { manual: true });

  useEffect(() => {
    const price = props.data?.['metis-token']?.usd;
    if (typeof price === 'number' && Number.isFinite(price) && price >= 0) {
      setMetisPrice(price);
    }
  }, [props.data, setMetisPrice]);
  return { ...props, metisPrice };
};

export default useMetisPrice;
