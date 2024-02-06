// import { getProvider } from '@wagmi/core'
import { message } from '@/components';
import { VITE_APP_METIS_TOKEN, basicTokenListData } from '@/configs/common';
import useAuth from './useAuth';

// export const watchAssets = (options) => {
//   globalThis.ethereum.request({
//     method: 'wallet_watchAsset',
//     params: {
//       type: 'ERC20',
//       options,
//     },
//   });
// };

const useWatchAsset = () => {
  const { connector } = useAuth(true);
  //

  const watchAsset = async ({
    address,
    decimals = 18,
    image,
    symbol,
  }: {
    address: string;
    decimals?: number | undefined;
    image?: string | undefined;
    symbol: string;
  }) => {
    if (connector) {
      try {
        await connector?.watchAsset({
          address,
          decimals,
          image,
          symbol,
        });
      } catch (e) {
        message.error(e?.message);
      }
    }
  };

  const watchMetis = async () =>
    watchAsset({
      address: VITE_APP_METIS_TOKEN,
      decimals: 18,
      image: '',
      symbol: 'Metis',
    });

  return {
    watchMetis,
    watchAsset,
  };
};

export default useWatchAsset;
