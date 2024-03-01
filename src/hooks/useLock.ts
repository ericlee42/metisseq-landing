/* eslint-disable max-len */
import { message } from '@/components';
import useAuth from './useAuth';
import { contracts } from '@/configs/common';
import { catchError } from '@/utils/tools';
import { calTxData, getL2GasFee, sendTx, txAwait } from '@/utils/tx';
import useChainWatcher from './useChainWatcher';
import { Address } from 'viem';
import useSequencerInfo from './useSequencerInfo';
import BigNumber from 'bignumber.js';

const useLock = () => {
  const { connector } = useAuth(true);
  const { chain, unsupported } = useChainWatcher();
  const { runOnce } = useSequencerInfo();

  const lockFor = async ({ address, amount, pubKey }: { address: string; amount: string; pubKey: string }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');
    try {
      const signer = await connector?.getWalletClient();
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'lockFor',
        args: [address, amount, pubKey],
      });

      if (!signer) {
        throw new Error('Invalid Signer');
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
    }
  };

  const relock = async ({
    sequencerId,
    amount,
    lockRewards,
  }: {
    sequencerId: string;
    amount: string;
    lockRewards: boolean;
  }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');

    let l2Fee = '0x';
    const latestStatus = await runOnce({ sequencerId, self: true });
    const needL2Fee = BigNumber(latestStatus?.[0]?.reward || 0).gt(0);

    if (needL2Fee) {
      const l2GasFee = await getL2GasFee({ chainId: chain?.id });
      l2Fee = l2GasFee?.l2Fee;
    }

    try {
      const signer = await connector?.getWalletClient();
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'relock',
        args: [sequencerId, amount, lockRewards],
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
    }
  };

  const withdrawRewards = async ({ sequencerId }: { sequencerId: string }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');

    const { l2Gas, l2Fee } = await getL2GasFee({ chainId: chain?.id });
    try {
      const signer = await connector?.getWalletClient();
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'withdrawRewards',
        args: [sequencerId, l2Gas],
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
      console.log('e', e);
      message.error(catchError(e) || 'Fail');
      throw e;
    }
  };

  const unlock = async ({ sequencerId }: { sequencerId: string }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');
    try {
      const { l2Gas, l2Fee } = await getL2GasFee({ chainId: chain?.id });

      const signer = await connector?.getWalletClient();
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'unlock',
        args: [sequencerId, l2Gas],
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
    }
  };

  const unlockClaim = async ({ sequencerId }: { sequencerId: string }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');
    try {
      const latestStatus = await runOnce({ sequencerId, self: true });
      const needL2Fee = BigNumber(latestStatus?.[0]?.reward || 0).gt(0);

      const { l2Gas, l2Fee } = await getL2GasFee({ chainId: chain?.id });

      const signer = await connector?.getWalletClient();
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'unlockClaim',
        args: [sequencerId, l2Gas],
      });

      if (!signer) {
        throw new Error('Invalid Signer');
      }

      const hash = await sendTx({
        walletClient: signer,
        to: contracts.lock?.[chain?.id?.toString()]?.address,
        value: needL2Fee ? l2Fee : '0x',
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
    }
  };

  // setSequencerRewardRecipient
  const setRewardRecipient = async ({ sequencerId, recipient }: { sequencerId: string; recipient: Address }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');
    if (!recipient || !sequencerId) throw new Error('Invalid Address');

    const signer = await connector?.getWalletClient();
    const txData = calTxData({
      abi: contracts.lock?.[chain?.id?.toString()]?.abi,
      functionName: 'setSequencerRewardRecipient',
      args: [sequencerId, recipient],
    });

    if (!signer) {
      throw new Error('Invalid Signer');
    }

    const hash = await sendTx({
      walletClient: signer,
      to: contracts.lock?.[chain?.id?.toString()]?.address,
      value: '0x0',
      data: txData,
      chain: chain,
    });
    if (!chain?.id) {
      throw new Error('Invalid Clent');
    }
    const tx = await txAwait(hash, chain?.id);

    return tx;
  };

  return { setRewardRecipient, lockFor, relock, withdrawRewards, unlock, unlockClaim };
};
export default useLock;
