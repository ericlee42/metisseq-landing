/* eslint-disable max-len */
import { Button, Input, Modal, Tooltip } from '@/components';
import Loading from '@/components/_global/Loading';
import useAuth from '@/hooks/useAuth';
import useLock from '@/hooks/useLock';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useUpdate from '@/hooks/useUpdate';
import { recoilRewardRecipientModalVisible } from '@/models';
import { getImageUrl } from '@/utils/tools';
import { useBoolean } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useRecoilState } from 'recoil';
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
      padding: 0 25px 25px;
    }
  }
`;

const ClaimModal = ({ refetchGraph, visible, onOk, onClose }: { refetchGraph?: any; visible: boolean; onOk?: any; onClose?: any }) => {
  const { chainId } = useAuth();
  const [, setRewardRecipientModalVisible] = useRecoilState(recoilRewardRecipientModalVisible);
  const { sequencerInfo, run } = useSequencerInfo();

  const { sequencerId } = useUpdate();

  const { withdrawRewards } = useLock();

  const [claimLoading, { setTrue, setFalse }] = useBoolean(false);

  const handleClaim = async () => {
    if (!sequencerInfo?.sequencers?.rewardRecipient || BigNumber(sequencerInfo?.reward).lte(0)) return;
    try {
      setTrue();
      await withdrawRewards({ sequencerId });
      setFalse();
      onClose?.();
    } catch (e) {
      setFalse();
    } finally {
      run?.({ sequencerId: sequencerId, self: true });
      refetchGraph?.();
    }
  };

  return (
    <Container visible={visible} onCancel={onClose} onClose={onClose} onOk={onOk} title="Claim Rewards" middleHeader>
      <div className="c flex flex-col gap-24">
        {' '}
        <div className="flex flex-col p-24 gap-12 bg-color-F6F6F6 radius-12">
          <div className="flex flex-col gap-12 items-center">
            <span className="f-14">Unclaimed</span>
            <span className="f-20-bold">{sequencerInfo?.rewardReadable || 0} METIS</span>
          </div>

          <div className="flex flex-col gap-16">
            <div className="flex flex-row items-center justify-center gap-6">
              <div className="f-12">Receiving address</div>
              <Tooltip title={<span>Receiving address</span>}>
                <img src={getImageUrl('@/assets/images/_global/ic_q.svg')} />
              </Tooltip>
            </div>
            <Input
              solidLight
              value={sequencerInfo?.sequencers?.rewardRecipient}
              className="flex-1 bg-color-fff radius-12"
              onChange={() => { }}
            />
          </div>
        </div>
        <div
          className="flex flex-row items-center justify-center gap-5 pointer fz-12 color-8E8E8E"
          onClick={() => setRewardRecipientModalVisible(true)}
        >
          <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.8703 6.3C13.4787 6.3 13.1625 6.61267 13.1625 7V11.6667C13.1625 12.1816 12.7393 12.6 12.2187 12.6H2.78045C2.25977 12.6 1.83663 12.1816 1.83663 11.6667V2.33333C1.83663 1.81844 2.25977 1.4 2.78045 1.4H7.49955C7.89124 1.4 8.20742 1.08733 8.20742 0.7C8.20742 0.312667 7.89124 0 7.49955 0H2.30854C1.26562 0 0.420898 0.835333 0.420898 1.86667V12.1333C0.420898 13.1647 1.26562 14 2.30854 14H12.6906C13.7335 14 14.5782 13.1647 14.5782 12.1333V7C14.5782 6.61267 14.262 6.3 13.8703 6.3Z"
              fill="#8E8E8E"
            />
            <path
              d="M5.04923 9.65708C5.32452 9.9293 5.7744 9.9293 6.04968 9.65708L13.7245 2.06752C13.9998 1.7953 13.9998 1.35041 13.7245 1.07819C13.4492 0.805968 12.9993 0.805968 12.7241 1.07819L5.04923 8.66619C4.77395 8.93841 4.77395 9.38486 5.04923 9.65708Z"
              fill="#8E8E8E"
            />
          </svg>

          <div>Change address</div>
        </div>
        <div className="f-12 align-left">
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
