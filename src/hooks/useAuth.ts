import { defaultChain, defaultChainId } from '@/configs/common';
import { useConnect, useConnection, useDisconnect } from 'wagmi';

const useAuth = () => {
  const connection = useConnection();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  return {
    ...connection,
    chain: connection.chain || defaultChain,
    chainId: connection.chain?.id || Number(defaultChainId),
    realChainId: connection.chainId,
    connect,
    disconnect,
  };
};
export default useAuth;
