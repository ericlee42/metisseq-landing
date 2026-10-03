import { network } from '@/configs/wallet';
import { useConnection, useSwitchChain } from 'wagmi';

const useChainWatcher = () => {
  const { chain, chainId, isConnected } = useConnection();
  const { switchChainAsync, isPending, variables } = useSwitchChain();
  const unsupported = isConnected && !network.some((item) => item.id === chainId);
  const setupNetwork = (forceId?: number) => switchChainAsync({ chainId: forceId || network[0].id });
  return { unsupported, isLoading: isPending, pendingChainId: variables?.chainId, setupNetwork, chain };
};
export default useChainWatcher;
