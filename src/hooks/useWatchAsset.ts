// import { getProvider } from '@wagmi/core'
import { message } from '@/components';
import { contracts } from '@/configs/common';
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
  const { connector, chainId } = useAuth(true);
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
        await connector?.watchAsset?.({
          address,
          decimals,
          image,
          symbol,
        });
      } catch (e: any) {
        message.error(e?.message);
      }
    }
  };

  const watchMetis = async () => {
    if (!chainId) return;

    return watchAsset({
      address: contracts?.deposit?.[chainId?.toString()]?.address,
      decimals: 18,
      image: '',
      symbol: 'Metis',
    });
  };

  return {
    watchMetis,
    watchAsset,
  };
};

export default useWatchAsset;
