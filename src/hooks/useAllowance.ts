import { MAX_ALLOWANCE, contracts } from '@/configs/common';
import { config } from '@/configs/wallet';
import { allowanceAtom } from '@/models';
import { catchError } from '@/utils/tools';
import { calTxData, sendTx, txAwait } from '@/utils/tx';
import { useAtom } from 'jotai';
import { getWalletClient } from 'wagmi/actions';
import useAuth from './useAuth';
import useChainWatcher from './useChainWatcher';
import useUpdate from './useUpdate';

const useAllowance = () => {
  const { chain } = useChainWatcher();
  const { address } = useAuth();
  const [allowance] = useAtom(allowanceAtom);

  const { runOnce } = useUpdate();
  const approve = async () => {
    if (!chain?.id) throw new Error('Unsupported Chain');
    try {
      const signer = await getWalletClient(config, { chainId: chain.id });
      const txData = calTxData({
        abi: contracts.deposit?.[chain?.id?.toString()].abi,
        functionName: 'approve',
        args: [contracts.lockInfo?.[chain?.id?.toString()]?.address, MAX_ALLOWANCE],
      });

      if (!signer) {
        throw new Error('Invalid Signer');
      }

      const hash = await sendTx({
        walletClient: signer,
        to: contracts.deposit?.[chain?.id?.toString()].address,
        value: 0n,
        data: txData,
        chain: chain,
      });
      if (!chain?.id) {
        throw new Error('Invalid Clent');
      }
      const tx = await txAwait(hash, chain?.id);
      return tx;
    } catch (e) {
      catchError(e);
      throw e;
    } finally {
      runOnce({ address });
    }
  };
  return { allowance, approve };
};

export default useAllowance;
