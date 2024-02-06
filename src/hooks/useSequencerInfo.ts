/* eslint-disable max-len */
import { contracts } from '@/configs/common';
import { useRequest } from 'ahooks';
import { multicall, readContract } from '@wagmi/core';
import { useRecoilState } from 'recoil';
import { recoilAllSequencerInfo, recoilSequencerInfo } from '@/models';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { getAllUser } from '@/services';
import React from 'react';
import useAuth from './useAuth';

const useSequencerInfo = () => {
  const { chainId } = useAuth(true);
  const [sequencerInfo, setSequencerInfo] = useRecoilState(recoilSequencerInfo);
  const [allSequencerInfo, setAllSequencerInfo] = useRecoilState(recoilAllSequencerInfo);

  const { data: getAllUserData, run: getAllUserRun } = useRequest(getAllUser, { manual: true });

  React.useEffect(() => {
    if (getAllUserData) {
      setAllSequencerInfo(getAllUserData);
    }
  }, [getAllUserData]);

  const getSequencerId = async (address?: string) => {
    if (!address || !chainId) return;
    try {
      const data = await readContract({
        address: contracts.lock?.[chainId?.toString()].address,
        abi: contracts.lock?.[chainId?.toString()].abi,
        functionName: 'getSequencerId',
        args: [address],
      });

      return data?.toString();
    } catch (e) {
      return undefined;
    }
  };

  const handleSequencerCal = (sequencerInfo: any, multicallFuntions: any) => {
    const result: any = {};
    sequencerInfo.forEach((i: any, index: string | number) => {
      if (Array.isArray(i?.result)) {
        let flattedData: any = {};

        const abiOutput = multicallFuntions[index].abi?.find(
          (k) => multicallFuntions[index].functionName === k.name,
        )?.outputs;
        abiOutput.forEach((j: { name: string | number }, jndex: string | number) => {
          flattedData[j?.name] = i?.result?.[jndex]?.toString();
        });

        result[multicallFuntions[index].functionName] = flattedData;
      } else {
        const j = i?.result || 0;
        result[multicallFuntions[index].functionName] = j?.toString();
      }
    });

    const status = result?.sequencers?.status;
    const unlockClaimTime = result?.sequencers?.unlockClaimTime?.toString();
    // const reward = BigNumber(result?.sequencers?.reward || '0').minus(1)?.toString();
    const reward = result?.sequencerReward.toString();
    const rewardReadable = ethers.utils.formatEther(reward || '0').toString();

    const ifActive = BigNumber(status).eq(1) && BigNumber(result?.sequencers?.deactivationBatch?.toString()).isZero();
    const ifInUnlockProgress = !BigNumber(unlockClaimTime).isZero();

    const finalRes = {
      ...result,
      status,
      unlockClaimTime,
      reward,
      rewardReadable,
      ifActive,
      ifInUnlockProgress,
    };

    return finalRes;
  };

  const intervalUpdate = async (
    props: any = {
      sequencerIds: undefined,
      sequencerId: undefined,
      self: false,
    },
  ) => {
    const {
      sequencerId,
      sequencerIds,
      self,
    }: {
      sequencerId?: string;
      sequencerIds?: string[];
      self?: boolean;
    } = props;

    if ((!sequencerId && !sequencerIds?.length) || !chainId) {
      setSequencerInfo(null);
      return;
    }
    const s = sequencerIds || [sequencerId];
    const multiP: any[] = s.reduce((prev: any, next: any) => {
      const n = [
        {
          ...contracts.lock?.[chainId?.toString()],
          chainId,
          functionName: 'sequencerReward',
          args: [next],
        },
        {
          ...contracts.lock?.[chainId?.toString()],
          chainId,
          functionName: 'sequencerLock',
          args: [next],
        },
        {
          ...contracts.lock?.[chainId?.toString()],
          chainId,
          functionName: 'sequencers',
          args: [next],
        },
      ];
      return [...prev, ...n];
    }, []);

    const res = await multicall({
      contracts: multiP,
    });

    const listedData = s.map((i, index) => {
      return res?.slice(index * 3, index * 3 + 3);
    });

    const finalRes = listedData.map((i) => {
      return handleSequencerCal(i, multiP);
    });

    if (self) {
      setSequencerInfo(finalRes?.[0]);
    }

    return finalRes;
  };

  const props = useRequest(intervalUpdate, {
    manual: true,
    pollingInterval: 5000,
    refreshDeps: [chainId],
  });

  return { getAllUserRun, allSequencerInfo, getSequencerId, runOnce: intervalUpdate, sequencerInfo, ...props };
};

export default useSequencerInfo;
