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
interface baseSeqInfo {
  amount: string;
  reward: string;
  activationBatch: string;
  updatingBatch: string;
  deactivationBatch: string;
  deactivationTime: string;
  unlockClaimTime: string;
  nonce: string;
  owner: string;
  signer: string;
  pubkey: string;
  rewardRecipient: string;
  status: string;
}
interface SeqInfo {
  sequencers: baseSeqInfo;
  status: string;
  unlockClaimTime: string;
  reward: string;
  rewardReadable: string;
  ifActive: boolean;
  ifInUnlockProgress: boolean;
  sequencerLock: string;
  sequencerLockReadable: string;
}

const useSequencerInfo = () => {
  const { chainId } = useAuth();
  const [sequencerInfo, setSequencerInfo] = useRecoilState(recoilSequencerInfo);
  const [allSequencerInfo, setAllSequencerInfo] = useRecoilState(recoilAllSequencerInfo);

  const { data: getAllUserData, run: getAllUserRun } = useRequest(getAllUser, { manual: true });

  React.useEffect(() => {
    if (getAllUserData) {
      setAllSequencerInfo(getAllUserData);
    }
  }, [getAllUserData]);

  const seqOwners = async (address?: string) => {
    if (!address || !chainId) return;
    try {
      const data = await readContract({
        address: contracts.lock?.[chainId?.toString()].address,
        abi: contracts.lock?.[chainId?.toString()].abi,
        functionName: 'seqOwners', // seqOwners
        args: [address],
      });

      return data?.toString();
    } catch (e) {
      return undefined;
    }
  };

  const handleSequencerCal = (sequencerInfo: any, multicallFuntions: any, curBatchState?: any) => {
    let finalRes: any = {};
    sequencerInfo.forEach((i: any, index: string | number) => {
      const result: any = {};
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

      const status = result?.sequencers?.status;
      const unlockClaimTime = result?.sequencers?.unlockClaimTime?.toString();
      // const reward = BigNumber(result?.sequencers?.reward || '0').minus(1)?.toString();
      const reward = result?.sequencers?.reward?.toString();
      const rewardReadable = ethers.utils.formatEther(reward || '0').toString();

      const ifActive = BigNumber(status).eq(2) && BigNumber(result?.sequencers?.deactivationBatch?.toString()).isZero();
      const ifInUnlockProgress = !BigNumber(unlockClaimTime).isZero();

      const sequencerLock = BigNumber(result?.sequencers?.amount).toString();
      const sequencerLockReadable = BigNumber(result?.sequencers?.amount).div(1e18).toString();

      finalRes[result?.sequencers?.owner?.toLowerCase()] = {
        ...result,
        curBatchState: curBatchState,
        status,
        unlockClaimTime,
        reward,
        rewardReadable,
        ifActive,
        ifInUnlockProgress,
        sequencerLock,
        sequencerLockReadable,
      };
    });

    return finalRes;
  };

  const handleMulticallCal = (sequencerInfo: any, multicallFuntions: any) => {
    let finalRes: any = {};
    sequencerInfo.forEach((i: any, index: string | number) => {
      const result: any = {};
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

      finalRes = result;
    });

    return finalRes;
  };

  const intervalUpdate = async (
    props: any = {
      sequencerIds: undefined,
      sequencerId: undefined,
      self: false,
    },
  ): Promise<SeqInfo[] | null | undefined> => {
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
          functionName: 'sequencers',
          args: [next],
        },
      ];
      return [...prev, ...n];
    }, []);

    const curBatchStateP = {
      ...contracts.lock?.[chainId?.toString()],
      chainId,
      functionName: 'curBatchState',
      args: [],
    };

    const res = await multicall({
      contracts: [...multiP, curBatchStateP],
    });

    // todo 抽象通用方法
    const curBatchState = res?.splice(-1);
    const curBatchStateInfo = handleMulticallCal(curBatchState, [curBatchStateP])?.curBatchState;

    const finalRes = (Array.isArray(res) ? [res] : [[res]])?.map((i) => {
      return handleSequencerCal(i, multiP, curBatchStateInfo);
    });

    const sequencerInfo = finalRes?.[0] ? Object.values(finalRes?.[0]) : null;

    if (self) {
      setSequencerInfo(sequencerInfo?.[0]);
    }

    // todo
    return sequencerInfo as SeqInfo[];
  };

  const props = useRequest(intervalUpdate, {
    manual: true,
    // pollingInterval: 15000,
    refreshDeps: [chainId],
  });

  return { getAllUserRun, allSequencerInfo, seqOwners, runOnce: intervalUpdate, sequencerInfo, ...props };
};

export default useSequencerInfo;
