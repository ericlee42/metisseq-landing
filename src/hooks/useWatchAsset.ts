import { message } from '@/components';
import { contracts } from '@/configs/common';
import { config } from '@/configs/wallet';
import type { Address } from 'viem';
import { getWalletClient } from 'wagmi/actions';
import useAuth from './useAuth';

const useWatchAsset = () => {
  const { connector, chainId } = useAuth();

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
        const client = await getWalletClient(config, { chainId: Number(chainId) });
        await client.watchAsset({
          type: 'ERC20',
          options: {
            address: address as Address,
            decimals,
            image,
            symbol,
          },
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
