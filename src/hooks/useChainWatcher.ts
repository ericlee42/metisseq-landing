import { useNetwork, useSwitchNetwork } from 'wagmi';

const useChainWatcher = () => {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetworkAsync, isIdle, status } = useSwitchNetwork();

  const setupNetwork = (forceId?: number) => {
    return switchNetworkAsync?.(forceId || chains[0]?.id);
  };

  const currentStatus = chain?.unsupported;

  return { unsupported: currentStatus, isLoading, pendingChainId, setupNetwork, chain };
};

export default useChainWatcher;
