/* eslint-disable max-len */
import { getImageUrl } from '@/utils/tools';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import styled from 'styled-components';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import Loading from '../_global/Loading';
import NumberText from '../NumberText';
import BigNumber from 'bignumber.js';
import useL2EpochStatus from '@/hooks/useL2EpochStatus';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const SequencerStatusContainer = styled.div`
  .avatar {
    background: url(${getImageUrl('@/assets/images/sequencer/avatar.svg')}) no-repeat;
  }
`;

const SequencerItemContainer = ({ ele, onClick, totalLockUp, since }: any) => {
  const { currentEpochRelatedSeqAddress, currentActiveSeqAddressLoading } = useL2EpochStatus();
  // produce status
  // block - current height and timestamp
  // data?.producingBlocks - latest 5 rotate sequencer height match
  // if height is between epoch range, last produce time > 60s, return warning
  const producingStatus = useMemo(() => {
    if (
      currentEpochRelatedSeqAddress &&
      ele?.sequencers?.signer?.toLowerCase() === currentEpochRelatedSeqAddress?.toLowerCase()
    ) {
      return { label: 'Healthy', color: '00EA5E' };
    }
    return { label: 'Pending', color: 'E9B261' };
  }, [currentEpochRelatedSeqAddress, ele?.sequencers?.signer]);

  const status = useMemo(() => {
    if (ele?.ifInUnlockProgress) {
      return { label: 'Exit Period', color: 'E9B261' };
    }
    if (!ele?.ifInUnlockProgress && !ele?.ifActive) {
      return { label: 'Exited', color: 'B3B3B3' };
    }
    return producingStatus;
  }, [ele?.ifActive, ele?.ifInUnlockProgress, producingStatus]);

  const totlaEarned = useMemo(() => {
    // 待领取奖励+已领取奖励
    return BigNumber(ele?.rewardReadable).plus(BigNumber(ele?.claimAmount).div(1e18)).toString();
  }, [ele?.claimAmount, ele?.rewardReadable]);
  
  return (
    <SequencerStatusContainer
      onClick={onClick}
      style={{ boxShadow: '0px 10px 30px 0px rgba(0, 0, 0, 0.10)' }}
      className="pointer radius-30 w-340 pt-37 pl-30 pr-30 pb-20 flex flex-col gap-42 items-center position-relative"
    >
      <div className="flex flex-row items-center gap-8 position-absolute top-14 right-20">
        {currentActiveSeqAddressLoading ? (
          <div className="h-18 flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            <span
              className={`fz-14 fw-500 color-${status.color}`}
              style={{
                color: `#${status?.color}`,
              }}
            >
              {status?.label}
            </span>
            <div
              className={`s-12 bg-color-${status.color} radiusp-50`}
              style={{ backgroundColor: `#${status?.color}` }}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-5 items-center">
        {ele?.infos?.avatar ? (
          <div className="flex flex-row items-center justify-center">
            <img className="s-90 radiusp-50" crossOrigin="anonymous" src={ele?.infos?.avatar} />
          </div>
        ) : (
          <div className={'avatar s-90 radiusp-50'} />
        )}

        <div className="align-center fz-20 fw-700 poppins">{ele?.infos?.name || '-'}</div>
        {/* {ele?.infos?.desc ? <div className="align-center fz-20 fw-700 poppins">{ele?.infos?.desc || '-'}</div> : null} */}
      </div>
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="fz-14 color-000 fw-400">Lock-up</div>
            <div className="flex flex-row items-center gap-4">
              <img src={getImageUrl('@/assets/images/sequencer/avatar.svg')} className="s-13" />
              <div className="fz-14 fw-700 color-000">
                <NumberText value={totalLockUp} />
              </div>
            </div>
          </div>
          {/* <div className="flex flex-row justify-between items-center w-full">
            <div className="fz-14 color-000 fw-400">Uptime</div>
            <div className="fz-14 fw-700 color-000">{fromNow || '-'}</div>
          </div> */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="fz-14 color-000 fw-400">Sequencing Since</div>
            <div className="fz-14 fw-700 color-000">{since || '-'}</div>
          </div>
        </div>
        <div className="h-1 w-full mt-10 mb-10 bg-color-CDCDCD" />
        <div className="flex flex-row justify-between items-center w-full">
          <div className="fz-14 color-000 fw-400">Earned</div>

          <div className="flex flex-row items-center gap-4">
            <img src={getImageUrl('@/assets/images/sequencer/avatar.svg')} className="s-13" />
            <div className="fz-14 fw-700 color-000">
              <NumberText value={totlaEarned} />
            </div>
          </div>
        </div>
      </div>
    </SequencerStatusContainer>
  );
};
export default SequencerItemContainer;
