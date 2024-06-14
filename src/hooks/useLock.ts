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
import useUpdate from './useUpdate';

const useLock = () => {
  const { runOnce: updateRunOnce } = useUpdate();
  const { connector } = useAuth();
  const { chain, unsupported } = useChainWatcher();
  const { runOnce } = useSequencerInfo();

  const lockFor = async ({
    address,
    amount,
    pubKey,
    newAddress,
  }: {
    address: string;
    amount: string;
    pubKey: string;
    newAddress?: string;
  }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');

    const formattedPubKey = pubKey?.replace('0x04', '0x');
    try {
      const signer = await connector?.getWalletClient();
      const functionName = newAddress ? 'lockWithRewardRecipient' : 'lockFor';
      const args = newAddress ? [address, newAddress, amount, formattedPubKey] : [address, amount, formattedPubKey];
      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName,
        args,
      });
      console.log(txData, signer, 'txData');
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
    amount: string;
    lockRewards: boolean;
  }) => {
    if (unsupported || !chain?.id) throw new Error('Unsupported Chain');

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
        value: '0x0',
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
    } finally {
      updateRunOnce();
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
    } finally {
      updateRunOnce();
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
        value: needL2Fee ? l2Fee : '0x0',
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
      const latestStatus = await runOnce({ sequencerId, self: true });
      const signer = await connector?.getWalletClient();

      const txData = calTxData({
        abi: contracts.lock?.[chain?.id?.toString()]?.abi,
        functionName: 'withdraw',
        args: [sequencerId, relockAmount],
      });

      if (!signer) {
        throw new Error('Invalid Signer');
      }
      console.log(txData, signer, relockAmount, contracts.lock?.[chain?.id?.toString()], chain, '123123');
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
      message.success('Success');

      return tx;
    } catch (e) {
      console.log(e, 'errorE');
      message.error(catchError(e) || 'Fail');
      throw e;
    } finally {
      updateRunOnce();
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

  return { setRewardRecipient, lockFor, relock, withdrawRewards, unlock, unlockClaim, withdraw };
};
export default useLock;
