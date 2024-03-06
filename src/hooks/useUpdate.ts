/* eslint-disable max-len */
import { multicall } from '@wagmi/core';
import useAuth from './useAuth';
import { contracts } from '@/configs/common';
import { useRequest } from 'ahooks';
import { useRecoilState } from 'recoil';
import {
  recoilAllowance,
  recoilBalance,
  recoilBlockReward,
  recoilLiquidateReward,
  recoilSequencerId,
  recoilSequencerTotalInfo,
  recoilWhitelisted,
} from '@/models';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

const useUpdate = () => {
  const { chainId } = useAuth();

  const [sequencerId, setSequencerId] = useRecoilState(recoilSequencerId);
  const [whiteListed, setWhiteListed] = useRecoilState(recoilWhitelisted);
  const [liquidateReward, setLiquidateReward] = useRecoilState(recoilLiquidateReward);
  const [balance, setBalance] = useRecoilState(recoilBalance);
  const [allowance, setAllowance] = useRecoilState(recoilAllowance);
  const [blockReward, setBlockReward] = useRecoilState(recoilBlockReward);

  const [sequencerTotalInfo, setSequencerTotalInfo] = useRecoilState(recoilSequencerTotalInfo);

  const intervalUpdate = async (
    props: any = {
      address: undefined,
      seqAddress: undefined,
    },
  ) => {
    const {
      address,
      seqAddress,
    }: {
      seqAddress?: string;
      address?: string;
    } = props;

    if (!chainId) return;

    let p: any[] = [
      {
        ...contracts.lockInfo?.[chainId?.toString()],
        functionName: 'totalRewardsLiquidated',
        args: [],
      },
      {
        ...contracts.lock?.[chainId?.toString()],
        functionName: 'BLOCK_REWARD', // BLOCK_REWARD
        args: [],
      },
      {
        ...contracts.lockInfo?.[chainId?.toString()],
        chainId: chainId,
        functionName: 'totalLocked', // totalLocked
        args: [],
      },
    ];

    // seq_addr
    if (seqAddress) {
      p = [
        ...p,
        {
          ...contracts.lock?.[chainId?.toString()],
          chainId,
          functionName: 'seqOwners', // seqOwners
          args: [seqAddress],
        },
      ];
    }

    // addr
    if (address) {
      p = [
        ...p,
        {
          ...contracts.deposit?.[chainId?.toString()],
          chainId,
          functionName: 'balanceOf',
          args: [address],
        },
        {
          ...contracts.deposit?.[chainId?.toString()],
          chainId,
          functionName: 'allowance',
          args: [address, contracts.lockInfo?.[chainId?.toString()].address],
        },
        {
          ...contracts.lock?.[chainId?.toString()],
          functionName: 'whitelist', // whitelist
          args: [address],
        },
      ];
    }

    const res = await multicall({
      contracts: p,
    });

    const result: any = {};

    res.forEach((i: any, index) => {
      result[p[index].functionName] = i?.result?.toString();
    });

    if (result?.totalRewardsLiquidated) {
      const rewardReadable = BigNumber(result?.totalRewardsLiquidated).div(1e18).toString();
      setLiquidateReward(rewardReadable);
    }

    if (result?.BLOCK_REWARD) {
      const rewardReadable = BigNumber(result?.BLOCK_REWARD).div(1e18).toString();
      setBlockReward(rewardReadable);
    }

    if (result?.seqOwners) {
      setSequencerId(result?.seqOwners);
    } else {
      setSequencerId('');
    }

    if (result?.whitelist) {
      setWhiteListed(result?.whitelist === 'true');
    }

    if (result?.balanceOf) {
      setBalance({
        balance: result?.balanceOf,
        readable: ethers.utils.formatEther(result?.balanceOf).toString(),
      });
    }

    if (result?.allowance) {
      setAllowance(result?.allowance);
    }

    setSequencerTotalInfo({
      currentSequencerSetSize: result?.currentSequencerSetSize,
      totalLocked: result?.totalLocked,
      currentSequencerSetTotalLockReadable: result?.totalLocked
        ? ethers.utils.formatEther(result?.totalLocked).toString()
        : undefined,
    });

    return result;
  };

  const props = useRequest(intervalUpdate, {
    manual: true,
    pollingInterval: 5000,
    refreshDeps: [chainId],
  });

  return {
    ...props,
    liquidateReward,
    metisBalance: balance,
    sequencerTotalInfo,
    whiteListed,
    sequencerId,
    blockReward,
  };
};

export default useUpdate;
