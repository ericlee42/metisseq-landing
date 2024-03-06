import { defaultChain, defaultChainId, l2Provider } from '@/configs/common';
import { injectedConnector } from '@/configs/wallet';
import { useMount } from 'ahooks';
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi';

const autoLogin = true;

const useAuth = () => {
  const { chain } = useNetwork();
  const { address, status, isConnected, isConnecting, isDisconnected, connector, isReconnecting } = useAccount();

  const { connect, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  const relatedL2Provider = l2Provider;

  useMount(() => {
    if (!autoLogin) return;
    const connected = window.localStorage.getItem('wagmi.connected');
    const curWallet = window.localStorage.getItem('wagmi.wallet');

    const parsedConnected = connected ? JSON.parse(connected) : '';
    const parsedCurWallet = curWallet ? JSON.parse(curWallet) : '';

    if (parsedConnected && !isConnected) {
      if (parsedCurWallet === 'injected') {
        connect({ connector: injectedConnector });
        return;
      }
    }
  });

  return {
    chain: chain?.unsupported ? defaultChain : chain || defaultChain,
    chainId: chain?.unsupported ? defaultChainId : chain?.id || defaultChainId,
    realChainId: chain?.id,
    connector,
    address,
    status,
    isConnected,
    isConnecting,
    isDisconnected,
    disconnect,
    connect,
    relatedL2Provider,
  };
};

export default useAuth;
