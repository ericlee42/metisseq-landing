import { config } from '@/configs/wallet';
import { contracts } from '@/configs/common';
import {
  allowanceAtom,
  balanceAtom,
  blockRewardAtom,
  liquidateRewardAtom,
  sequencerIdAtom,
  sequencerTotalInfoAtom,
  whitelistedAtom,
} from '@/models';
import { useRequest } from 'ahooks';
import { useAtom } from 'jotai';
import { formatEther } from 'viem';
import { multicall } from 'wagmi/actions';
import useAuth from './useAuth';

const useUpdate = () => {
  const { chainId } = useAuth();

  const [sequencerId, setSequencerId] = useAtom(sequencerIdAtom);
  const [whiteListed, setWhiteListed] = useAtom(whitelistedAtom);
  const [liquidateReward, setLiquidateReward] = useAtom(liquidateRewardAtom);
  const [balance, setBalance] = useAtom(balanceAtom);
  const [, setAllowance] = useAtom(allowanceAtom);
  const [blockReward, setBlockReward] = useAtom(blockRewardAtom);

  const [sequencerTotalInfo, setSequencerTotalInfo] = useAtom(sequencerTotalInfoAtom);

  const intervalUpdate = async (
    props: any = {
      address: undefined,
      ownerAddress: undefined,
    },
  ) => {
    const {
      address,
      ownerAddress,
    }: {
      ownerAddress?: string;
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
    if (ownerAddress) {
      p = [
        ...p,
        {
          ...contracts.lock?.[chainId?.toString()],
          chainId,
          functionName: 'seqOwners', // seqOwners
          args: [ownerAddress],
        },
      ];
    }
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

    const res = await multicall(config, {
      chainId: Number(chainId),
      contracts: p,
    });

    const result: any = {};

    res.forEach((i: any, index) => {
      result[p[index].functionName] = i?.result?.toString();
    });

    if (result?.totalRewardsLiquidated) {
      const rewardReadable = formatEther(BigInt(result.totalRewardsLiquidated));
      setLiquidateReward(rewardReadable);
    }

    if (result?.BLOCK_REWARD) {
      const rewardReadable = formatEther(BigInt(result.BLOCK_REWARD));
      setBlockReward(rewardReadable);
    }

    if (result?.seqOwners) {
      setSequencerId(result?.seqOwners);
    } else if (ownerAddress) {
      setSequencerId('');
    }

    if (result?.whitelist) {
      setWhiteListed(result?.whitelist === 'true');
    }

    if (result?.balanceOf) {
      setBalance({
        balance: result?.balanceOf,
        readable: formatEther(BigInt(result?.balanceOf)).toString(),
      });
    }

    if (result?.allowance) {
      setAllowance(result?.allowance);
    }

    setSequencerTotalInfo({
      currentSequencerSetSize: result?.currentSequencerSetSize,
      totalLocked: result?.totalLocked,
      currentSequencerSetTotalLockReadable: result?.totalLocked
        ? formatEther(BigInt(result?.totalLocked)).toString()
        : undefined,
    });

    return result;
  };

  const props = useRequest(intervalUpdate, {
    manual: true,
    pollingInterval: 60_000,
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
    runOnce: intervalUpdate,
  };
};

export default useUpdate;
