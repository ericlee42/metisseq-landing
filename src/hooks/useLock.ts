import { compareDecimals } from '@/utils/decimal';
import { config } from '@/configs/wallet';
import { getWalletClient } from 'wagmi/actions';
import { message } from '@/components';
import { contracts } from '@/configs/common';
import { catchError } from '@/utils/tools';
import { calTxData, getL2GasFee, sendTx, txAwait } from '@/utils/tx';
import { Address } from 'viem';
import useChainWatcher from './useChainWatcher';
import useSequencerInfo from './useSequencerInfo';
import useUpdate from './useUpdate';

const useLock = () => {
  const { runOnce: updateRunOnce } = useUpdate();
  const { chain, unsupported } = useChainWatcher();
  const { runOnce } = useSequencerInfo();

  const lockFor = async ({
    address,
    amount,
    pubKey,
    bindAddress,
  }: {
    address: string;
    amount: bigint;
    pubKey: string;
    bindAddress?: string;
  }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');

    const formattedPubKey = pubKey?.replace('0x04', '0x');
    try {
      const signer = await getWalletClient(config, { chainId: chain.id });
      const functionName = bindAddress ? 'lockWithRewardRecipient' : 'lockFor';
      const args = bindAddress ? [address, bindAddress, amount, formattedPubKey] : [address, amount, formattedPubKey];
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName,
        args,
      });
      if (!signer) {
        throw new Error('Please submit your sequencer information on Github');
      }

      const hash = await sendTx({
        walletClient: signer,
        to: contracts.lock?.[chain?.id?.toString()]?.address,
        data: txData,
        chain: chain,
      });
      if (!chain?.id) {
        throw new Error('Invalid Clent');
      }
      const tx = await txAwait(hash, chain?.id);
      message.success('Success');

      return tx;
    } catch (e) {
      message.error(catchError(e) || 'Fail');
      throw e;
    } finally {
      updateRunOnce();
    }
  };

  const relock = async ({
    sequencerId,
    amount,
    lockRewards,
  }: {
    sequencerId: string;
    amount: bigint;
    lockRewards: boolean;
  }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');

    try {
      const signer = await getWalletClient(config, { chainId: chain.id });
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'relock',
        args: [BigInt(sequencerId), amount, lockRewards],
      });

      if (!signer) {
        throw new Error('Invalid Signer');
      }

      const hash = await sendTx({
        walletClient: signer,
        to: contracts.lock?.[chain?.id?.toString()]?.address,
        value: 0n,
        data: txData,
        chain: chain,
      });
      if (!chain?.id) {
        throw new Error('Invalid Clent');
      }
      const tx = await txAwait(hash, chain?.id);
      message.success('Success');

      return tx;
    } catch (e) {
      message.error(catchError(e) || 'Fail');
      throw e;
    } finally {
      updateRunOnce();
    }
  };

  const withdrawRewards = async ({ sequencerId }: { sequencerId: string }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');

    const { l2Gas, l2Fee } = await getL2GasFee({ chainId: chain?.id });
    try {
      const signer = await getWalletClient(config, { chainId: chain.id });
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'withdrawRewards',
        args: [BigInt(sequencerId), l2Gas],
      });

      if (!signer) {
        throw new Error('Invalid Signer');
      }

      const hash = await sendTx({
        walletClient: signer,
        to: contracts.lock?.[chain?.id?.toString()]?.address,
        value: l2Fee,
        data: txData,
        chain: chain,
      });
      if (!chain?.id) {
        throw new Error('Invalid Clent');
      }
      const tx = await txAwait(hash, chain?.id);
      message.success('Success');

      return tx;
    } catch (e) {
      message.error(catchError(e) || 'Fail');
      throw e;
    } finally {
      updateRunOnce();
    }
  };

  const unlock = async ({ sequencerId }: { sequencerId: string }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');
    try {
      const { l2Gas, l2Fee } = await getL2GasFee({ chainId: chain?.id });

      const signer = await getWalletClient(config, { chainId: chain.id });
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'unlock',
        args: [BigInt(sequencerId), l2Gas],
      });

      if (!signer) {
        throw new Error('Invalid Signer');
      }

      const hash = await sendTx({
        walletClient: signer,
        to: contracts.lock?.[chain?.id?.toString()]?.address,
        value: l2Fee,
        data: txData,
        chain: chain,
      });
      if (!chain?.id) {
        throw new Error('Invalid Clent');
      }
      const tx = await txAwait(hash, chain?.id);
      message.success('Success');

      return tx;
    } catch (e) {
      message.error(catchError(e) || 'Fail');
      throw e;
    } finally {
      updateRunOnce();
    }
  };

  const unlockClaim = async ({ sequencerId }: { sequencerId: string }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');
    try {
      const latestStatus = await runOnce({ sequencerId, self: true });
      const needL2Fee = compareDecimals(latestStatus?.[0]?.reward || 0, 0) > 0;

      const { l2Gas, l2Fee } = await getL2GasFee({ chainId: chain?.id });

      const signer = await getWalletClient(config, { chainId: chain.id });
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'unlockClaim',
        args: [BigInt(sequencerId), l2Gas],
      });

      if (!signer) {
        throw new Error('Invalid Signer');
      }

      const hash = await sendTx({
        walletClient: signer,
        to: contracts.lock?.[chain?.id?.toString()]?.address,
        value: needL2Fee ? l2Fee : 0n,
        data: txData,
        chain: chain,
      });
      if (!chain?.id) {
        throw new Error('Invalid Clent');
      }
      const tx = await txAwait(hash, chain?.id);
      message.success('Success');

      return tx;
    } catch (e) {
      message.error(catchError(e) || 'Fail');
      throw e;
    } finally {
      updateRunOnce();
    }
  };
  const withdraw = async ({ sequencerId, relockAmount }: { sequencerId: string; relockAmount: bigint }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');
    try {
      const signer = await getWalletClient(config, { chainId: chain.id });

      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'withdraw',
        args: [BigInt(sequencerId), relockAmount],
      });

      if (!signer) {
        throw new Error('Invalid Signer');
      }
      const hash = await sendTx({
        walletClient: signer,
        to: contracts.lock?.[chain?.id?.toString()]?.address,
        value: 0n,
        data: txData,
        chain: chain,
      });
      if (!chain?.id) {
        throw new Error('Invalid Clent');
      }
      const tx = await txAwait(hash, chain?.id);
      message.success('Success');

      return tx;
    } catch (e) {
      message.error(catchError(e) || 'Fail');
      throw e;
    } finally {
      updateRunOnce();
    }
  };
  const setRewardRecipient = async ({ sequencerId, recipient }: { sequencerId: string; recipient: Address }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');
    if (!recipient || !sequencerId) throw new Error('Invalid Address');

    const signer = await getWalletClient(config, { chainId: chain.id });
    const txData = calTxData({
      abi: contracts.lock?.[chain?.id?.toString()]?.abi,
      functionName: 'setSequencerRewardRecipient',
      args: [BigInt(sequencerId), recipient],
    });

    if (!signer) {
      throw new Error('Invalid Signer');
    }

    const hash = await sendTx({
      walletClient: signer,
      to: contracts.lock?.[chain?.id?.toString()]?.address,
      value: 0n,
      data: txData,
      chain: chain,
    });
    if (!chain?.id) {
      throw new Error('Invalid Clent');
    }
    const tx = await txAwait(hash, chain?.id);

    return tx;
  };

  return { setRewardRecipient, lockFor, relock, withdrawRewards, unlock, unlockClaim, withdraw };
};
export default useLock;
