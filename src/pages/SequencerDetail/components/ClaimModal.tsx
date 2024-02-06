import { Button, Input, Modal, Tooltip, message } from '@/components';
import Loading from '@/components/_global/Loading';
import useAuth from '@/hooks/useAuth';
import useLock from '@/hooks/useLock';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useUpdate from '@/hooks/useUpdate';
import { catchError, getImageUrl } from '@/utils/tools';
import { useBoolean, useMount } from 'ahooks';
import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';

const Container = styled(Modal)`
  .f-20-bold {
    font-size: 20px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: #333347;
    line-height: 30px;
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
      padding: 0 50px 50px;
    }
  }
`;

const ClaimModal = ({ visible, onOk, onClose }: { visible: boolean; onOk?: any; onClose?: any }) => {
  const { sequencerInfo } = useSequencerInfo();

  const [claimAmount, setClaimAmount] = useState('');

  const { sequencerId } = useUpdate();

  const { withdrawRewards } = useLock();

  const { address } = useAuth(true);

  const [claimLoading, { setTrue, setFalse }] = useBoolean(false);

  const [defaultInputed, setDefaultInputed] = useState(false);

  useEffect(() => {
    if (address && !claimAmount && !defaultInputed) {
      setDefaultInputed(true);
      setClaimAmount(address);
    }
  }, [address, claimAmount, defaultInputed]);

  const handleClaim = async () => {
    try {
      setTrue();
      await withdrawRewards({
        sequencerId,
        withdrawToL2: false,
      });
      setFalse();
      onClose?.();
      // message.success('Success');
    } catch (e) {
      setFalse();
      // catchError(e);
    }
  };

  return (
    <Container visible={visible} onCancel={onClose} onClose={onClose} onOk={onOk} title="Claim Rewards" middleHeader>
      <div className="c flex flex-col gap-24">
        <div className="flex flex-col p-24 gap-12 items-center  radius-8">
          <span className="f-14">Unclaimed</span>
          <span className="f-20-bold">{sequencerInfo?.rewardReadable} METIS</span>
        </div>

        <div className="flex flex-col gap-16">
          <div className="flex flex-row items-center gap-6">
            <div className="f-12">Receiving address</div>
            <Tooltip title={<span>Tooltip</span>}>
              <img src={getImageUrl('@/assets/images/_global/ic_q.svg')} />
            </Tooltip>
          </div>
          <Input
            // defaultValue={address}
            onChange={setClaimAmount}
            value={claimAmount}
            // max={sequencerInfo?.rewardReadable}
            solid
            className="flex-1"
            suffix={
              <div className="flex flex-row items-center gap-8">
                <img className="size-12" src={getImageUrl('@/assets/images/_global/ic_edit.svg')} />
              </div>
            }
          />
        </div>

        <div className="f-12 align-center">
          This operation will claim all your unclaimed rewards to Metis Andromeda Network.
        </div>
        <Button
          disabled={BigNumber(sequencerInfo?.reward).lte(0)}
          style={{ padding: '14px 50px' }}
          type="metis"
          onClick={handleClaim}
          className="w-full flex items-center justify-center"
        >
          <div className="flex items-center justify-center">{claimLoading ? <Loading color="#fff" /> : 'Claim'}</div>
        </Button>
      </div>
    </Container>
  );
};
export default ClaimModal;
