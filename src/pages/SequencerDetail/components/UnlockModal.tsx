import { Button, Input, Modal, message } from '@/components';
import CopyAddress from '@/components/CopyAddress';
import Loading from '@/components/_global/Loading';
import useBalance from '@/hooks/useBalance';
import useLock from '@/hooks/useLock';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useUpdate from '@/hooks/useUpdate';
import { catchError, getImageUrl } from '@/utils/tools';
import { useBoolean } from 'ahooks';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import React, { useMemo, useEffect, useState } from 'react';
import { styled } from 'styled-components';

const Container = styled(Modal)`
  .p-warning {
    padding: 24px 54px 40px;
  }
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

  .f-16-bold {
    font-size: 16px;
    font-family: Poppins-Bold, Poppins;
    font-weight: bold;
    color: #313146;
    line-height: 25px;
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

const UnlockModal = ({ visible, onOk, onClose }: { visible: boolean; onOk?: any; onClose?: any }) => {
  const { sequencerInfo } = useSequencerInfo();

  const { balance } = useBalance();

  const validUnlock = useMemo(() => !!+sequencerInfo?.unlockClaimTime, [sequencerInfo?.unlockClaimTime]);

  const lockedup = React.useMemo(
    () => ethers.utils.formatEther(sequencerInfo?.sequencerLock || '0').toString(),
    [sequencerInfo?.sequencerLock],
  );

  const [showWarning, setShowWarning] = useState(false);
  const handleClickUnlock = () => {
    setShowWarning(true);
  };

  useEffect(() => {
    if (!visible) {
      setShowWarning(false);
    }
  }, [visible]);

  const { unlock } = useLock();

  const { sequencerId } = useUpdate();

  // const [unlockAmount, setUnlockAmount] =useState('')
  const [unlockLoading, { setTrue, setFalse }] = useBoolean(false);

  const handleUnlock = async () => {
    if (!lockedup || BigNumber(lockedup).isZero() || !sequencerId) return;
    try {
      setTrue();
      await unlock({
        sequencerId: sequencerId,
        withdrawRewardToL2: false,
      });
      setFalse();
      // message.success("Success")
    } catch (e) {
      setFalse();
      console.log(e);
      // message.error(catchError(e));
    }
  };

  return (
    <Container
      visible={visible}
      onCancel={onClose}
      onClose={onClose}
      onOk={onOk}
      title={showWarning ? '' : 'Unlock'}
      middleHeader
    >
      {showWarning ? (
        <div className="flex flex-col items-center gap-36 p-warning">
          <div className="flex flex-col items-center gap-24">
            <img className="size-64" src={getImageUrl('@/assets/images/_global/ic_Unlock.svg')} />

            <div className="f-16-bold">Unlock</div>
            <div className="flex flex-col gap-12 items-center">
              <span className="f-12 align-center">
                Please note, if you unlock your funds you will no longer be a Sequencer.
              </span>
              <span className="f-12" style={{ color: 'rgba(255, 104, 104, 1)' }}>
                *You will get no rewards during the unlock period. Unlock period is 21 days.
              </span>
            </div>
          </div>

          <div className="flex flex-row items-center gap-20 w-full">
            <Button disabled={validUnlock || unlockLoading} type="metis" className="p-14 flex-1" onClick={handleUnlock}>
              <div className="f-14-bold color-fff flex items-center justify-center">
                {unlockLoading ? <Loading color="#fff" /> : 'Confirm'}
              </div>
            </Button>
            <Button type="metis-solid" className="p-14 flex-1" onClick={onClose}>
              <div className="f-14-bold">Cancel</div>
            </Button>
          </div>
        </div>
      ) : (
        <div className="c flex flex-col gap-24">
          <div className="flex flex-col p-24 gap-12 items-center bg-dark radius-8">
            <span className="f-14">Your Metis locked</span>
            <span className="f-14-bold">{lockedup} METIS</span>
          </div>
          <div className="flex flex-row items-center gap-20">
            {/* <Input
              solid
              className="flex-1"
              suffix={
                <div className="flex flex-row items-center gap-8">
                  <span className="f-12">Metis</span>
                </div>
              }
            /> */}
            <Button
              style={{ padding: '14px 50px' }}
              className="flex-1"
              type="metis"
              disabled={validUnlock}
              onClick={handleClickUnlock}
            >
              Unlock
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
      )}
    </Container>
  );
};
export default UnlockModal;
