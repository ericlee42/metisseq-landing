import { Button, Input, Modal } from '@/components';
import CopyAddress from '@/components/CopyAddress';
import Loading from '@/components/_global/Loading';
import useAllowance from '@/hooks/useAllowance';
import useAuth from '@/hooks/useAuth';
import useBalance from '@/hooks/useBalance';
import useLock from '@/hooks/useLock';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useUpdate from '@/hooks/useUpdate';
import { catchError } from '@/utils/tools';
import { useBoolean } from 'ahooks';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { styled } from 'styled-components';

const Container = styled(Modal)`
  .f-12 {
    font-size: 12px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #333347;
    line-height: 18px;
  }
  .f-14 {
    font-size: 14px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #333347;
    line-height: 21px;
  }

  .f-14-bold {
    font-size: 14px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: #333347;
    line-height: 21px;
  }

  .bg-dark {
    background: rgba(248, 248, 248, 1);
  }

  .radius-8 {
    border-radius: 8px;
  }

  .p-24 {
    padding: 24px;
  }

  .inside {
    width: 460px;
    .c {
      padding: 0 35px 35px;
    }
  }
`;

const IncreaseModal = ({ refetchGraph, visible, onOk, onClose }: { refetchGraph?: any; visible: boolean; onOk?: any; onClose?: any }) => {
  const { sequencerInfo, run } = useSequencerInfo();

  const { address } = useAuth();

  const { sequencerId } = useUpdate();

  const { balance } = useBalance();

  const [relockAmount, setRelockAmount] = useState('');

  const lockedup = React.useMemo(
    () => ethers.utils.formatEther(sequencerInfo?.sequencerLock || '0').toString(),
    [sequencerInfo?.sequencerLock],
  );

  const { relock, lockFor } = useLock();

  const { allowance, approve } = useAllowance();
  const [approveLoading, { setTrue: setApproveLoadingTrue, setFalse: setApproveLoadingFalse }] = useBoolean(false);

  const needApprove = React.useMemo(
    () => BigNumber(allowance || '0').lte(ethers.utils.parseEther(relockAmount || '0').toString()),
    [allowance, relockAmount],
  );

  const handleApprove = async () => {
    const res = await approve();
  };

  const handleRelock = async () => {
    try {
      if (!allowance || needApprove) {
        setApproveLoadingTrue();
        await handleApprove();
        setApproveLoadingFalse();
        return;
      }

      setApproveLoadingTrue();

      console.log('---relock---', {
        amount: ethers.utils.parseEther(relockAmount || '0').toString(),
        lockRewards: sequencerInfo?.reward,
        sequencerId,
      });
      await relock({
        amount: ethers.utils.parseEther(relockAmount || '0').toString(),
        lockRewards: false,
        sequencerId,
      });
      setApproveLoadingFalse();
    } catch (e) {
      setApproveLoadingFalse();
      console.log(e);
    } finally {
      run?.({ sequencerId: sequencerId, self: true });
      refetchGraph?.();
    }
  };

  return (
    <Container visible={visible} onCancel={onClose} onClose={onClose} onOk={onOk} title="Increase" middleHeader>
      <div className="c flex flex-col gap-24">
        <div className="flex flex-col p-24 gap-12 items-center bg-dark radius-8">
          <span className="f-14">Locked up Amount</span>
          <span className="f-14-bold">{lockedup} metis</span>
        </div>
        <div className="flex flex-row items-center gap-20">
          <Input
            value={relockAmount}
            onChange={setRelockAmount}
            max={balance?.readable}
            solid
            className="flex-1"
            suffix={
              <div className="flex flex-row items-center gap-8">
                <span className="f-12">Metis</span>
              </div>
            }
          />
          <Button
            disabled={+sequencerInfo?.unlockClaimTime || approveLoading}
            onClick={handleRelock}
            style={{ padding: '14px 50px' }}
            type="metis"
            className="flex items-center justify-center"
          >
            <div className="flex items-center justify-center">
              {approveLoading ? <Loading color="#fff" /> : needApprove ? <span>Approve</span> : <span>Increase Locked-up</span>}
            </div>
          </Button>
        </div>
        <div className="flex flex-col gap-16">
          <div className="flex flex-row items-center justify-between">
            <span className="f-14">Your Wallet Address</span>
            <CopyAddress className={'f-14'} />
          </div>

          <div className="flex flex-row items-center justify-between">
            <span className="f-14">Your Blance</span>
            <span className="f-14">{balance?.readable} MEITS</span>
          </div>
        </div>
      </div>
    </Container>
  );
};
export default IncreaseModal;
