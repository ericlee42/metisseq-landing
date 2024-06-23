/* eslint-disable max-len */
import { Button, Modal, Input } from '@/components';
import { calTxData } from '@/utils/tx';
import { ethers } from 'ethers';
import { contracts } from '@/configs/common';
import useChainWatcher from '@/hooks/useChainWatcher';
import Loading from '@/components/_global/Loading';
import useLock from '@/hooks/useLock';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useUpdate from '@/hooks/useUpdate';
import { useBoolean, useCountDown } from 'ahooks';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
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
  .error-font {
    color: #b50000;
  }
  .metis-font {
    align-items: center;
  }
`;

const ClaimAndRelock = ({
  refetchGraph,
  visible,
  onOk,
  onClose,
  lockedup,
  unclaimed,
}: {
  refetchGraph?: any;
  visible: boolean;
  onOk?: any;
  onClose?: any;
  lockedup: string;
  unclaimed: string;
}) => {
  const { data: sequencerInfoList, run } = useSequencerInfo();
  const sequencerInfo: any = sequencerInfoList?.[0];

  const unlockTo = useMemo(
    () => dayjs.unix(sequencerInfo?.unlockClaimTime || 0).format('YYYY-MM-DD HH:mm:ss'),
    [sequencerInfo?.unlockClaimTime],
  );

  const [countdown, formattedRes] = useCountDown({
    targetDate: unlockTo,
  });
  const { relock } = useLock();
  const { sequencerId } = useUpdate();

  const [withdrawLoading, { setTrue, setFalse }] = useBoolean(false);
  const maxClaim = React.useMemo(() => {
    const max = BigNumber(100000).minus(BigNumber(lockedup));
    return BigNumber(unclaimed).gte(max) ? max : BigNumber(unclaimed);
  }, [unclaimed, lockedup]);
  const handleWithdraw = async () => {
    if (countdown) return;
    try {
      setTrue();
      await relock({
        amount: ethers.utils.parseEther(maxClaim.toString() || '0').toString(),
        lockRewards: true,
        sequencerId,
      });
    } catch (e) {
      // message.error(catchError(e));
    } finally {
      setFalse();
      run?.({ sequencerId: sequencerId, self: true });
      refetchGraph?.();
    }
  };

  return (
    <Container visible={visible} onCancel={onClose} onClose={onClose} onOk={onOk} title="Claim and Relock" middleHeader>
      {
        <div className="c flex flex-col gap-24">
          <div className="flex flex-col p-24 gap-12 items-center bg-dark radius-8" style={{ padding: '40px' }}>
            <div className="f-12">Unclaimed</div>
            <div className="metis-font flex flex-row">
              <div className="f-30 m-r-10">{maxClaim.toString()}</div>
              <img className="pointer" src={getImageUrl('@/assets/images/_global/metis_logo_dark.svg')} />
            </div>
          </div>
          <div className="f-312">
            This operation will claim all your unclaimed rewards and relock up to your sequencer on Ethereum.
            {sequencerInfo}
          </div>
          <div className="flex flex-row items-center gap-20">
            <Button
              disabled={!+lockedup || withdrawLoading}
              style={{ padding: '14px 50px' }}
              type="metis"
              className="flex-1"
              onClick={handleWithdraw}
            >
              <div className="flex items-center justify-center">
                {withdrawLoading ? <Loading color="#fff" /> : 'Claim and Relock'}
              </div>
            </Button>
          </div>
        </div>
      }
    </Container>
  );
};
export default ClaimAndRelock;
