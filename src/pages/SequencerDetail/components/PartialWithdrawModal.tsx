/* eslint-disable max-len */
import { Button, Modal, Input } from '@/components';
import CopyAddress from '@/components/CopyAddress';
import Loading from '@/components/_global/Loading';
import useLock from '@/hooks/useLock';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useUpdate from '@/hooks/useUpdate';
import { useBoolean, useCountDown } from 'ahooks';
import dayjs from 'dayjs';
import { ethers } from 'ethers';
import React, { useMemo } from 'react';
import { styled } from 'styled-components';
import { getImageUrl } from '@/utils/tools';
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
  .link {
    background: rgba(0, 210, 255, 0.1);
    color: #00d2ff;
    border-radius: 10px;
    padding: 10px 20px;
    margin-top: 20px;
  }
`;

const PartialWithdrawModal = ({
  refetchGraph,
  visible,
  onOk,
  onClose,
}: {
  refetchGraph?: any;
  visible: boolean;
  onOk?: any;
  onClose?: any;
}) => {
  const { sequencerInfo, run } = useSequencerInfo();
  const lockedup = React.useMemo(
    () => ethers.utils.formatEther(sequencerInfo?.sequencerLock || '0').toString(),
    [sequencerInfo?.sequencerLock],
  );
  const [relockAmount, setRelockAmount] = React.useState(0);
  const unlockTo = useMemo(
    () => dayjs.unix(sequencerInfo?.unlockClaimTime || 0).format('YYYY-MM-DD HH:mm:ss'),
    [sequencerInfo?.unlockClaimTime],
  );

  const [indexPage, setIndexPage] = React.useState(0);

  const [countdown, formattedRes] = useCountDown({
    targetDate: unlockTo,
  });
  const [isError, setIsError] = React.useState(true);
  const { unlockClaim } = useLock();
  const { sequencerId } = useUpdate();

  const [withdrawLoading, { setTrue, setFalse }] = useBoolean(false);

  const handleWithdraw = async () => {
    if (countdown) return;
    try {
      setTrue();
      await unlockClaim({ sequencerId });
      setFalse();
    } catch (e) {
      setFalse();
      // message.error(catchError(e));
    } finally {
      run?.({ sequencerId: sequencerId, self: true });
      refetchGraph?.();
    }
  };

  return (
    <Container visible={visible} onCancel={onClose} onClose={onClose} onOk={onOk} title="Partial Withdraw" middleHeader>
      {indexPage === 0 ? (
        <div className="c flex flex-col gap-24">
          <div className=" flex flex-col gap-12">
            <div>Partial withdrawals must maintain the minimum METIS balance required for Sequencer status.</div>
            <div>Only one withdrawal is allowed per reward cycle; additional attempts will not be processed.</div>
            <div className="link">Link to withdrawal rules</div>
          </div>

          <div className="flex flex-row items-center gap-20">
            <Button style={{ padding: '14px 50px' }} type="metis" className="flex-1" onClick={() => setIndexPage(1)}>
              <div className="flex items-center justify-center">Acknowledge</div>
            </Button>
          </div>
        </div>
      ) : (
        <div className="c flex flex-col gap-24">
          <div className="flex flex-col p-24 gap-12 items-center bg-dark radius-8" style={{ padding: '40px' }}>
            <img className="pointer" src={getImageUrl('@/assets/images/_global/metis_logo_dark.svg')} />
            <Input
              value={relockAmount}
              onChange={setRelockAmount}
              solid
              className="flex-1"
              suffix={
                <div className="flex flex-row items-center gap-8">
                  <span className="f-12">Max</span>
                </div>
              }
            />
            <span className="f-14-bold"> Max. withdrawal: 1212.12 METIS </span>
            {isError ? <span className="f-12">Insufficient balance for withdrawal</span> : null}
          </div>
          <div className="f-12">This operation will withdraw your locked-up to your owner address on Ethereum.</div>
          <div className="flex flex-row items-center gap-20">
            <Button
              disabled={!!countdown || !+sequencerInfo?.unlockClaimTime || !+lockedup || withdrawLoading}
              style={{ padding: '14px 50px' }}
              type="metis"
              className="flex-1"
              onClick={handleWithdraw}
            >
              <div className="flex items-center justify-center">
                {withdrawLoading ? <Loading color="#fff" /> : 'Withdraw'}
              </div>
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};
export default PartialWithdrawModal;
