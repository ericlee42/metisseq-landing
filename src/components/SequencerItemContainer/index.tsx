/* eslint-disable max-len */
import fetchBatchBlockTx from '@/graphql/batchBlockAndTimestamp';
import { getImageUrl } from '@/utils/tools';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import Loading from '../_global/Loading';
import NumberText from '../NumberText';
import BigNumber from 'bignumber.js';
import useBlock from '@/hooks/useBlock';
import useAuth from '@/hooks/useAuth';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const SequencerStatusContainer = styled.div`
  .avatar {
    background: url(${getImageUrl('@/assets/images/sequencer/avatar.svg')}) no-repeat;
  }
`;

const SequencerItemContainer = ({ ele, onClick, avatar, title, totalLockUp, uptime, since, earned }: any) => {
  const { chainId, realChainId } = useAuth(true);
  const { run, loading, data, cancel } = useRequest(fetchBatchBlockTx, { manual: true, pollingInterval: 20000, refreshDeps: [chainId] });
  const { block } = useBlock();

  useEffect(() => {
    if (ele?.user && chainId) {
      cancel();
      console.log('run');
      run(ele?.user?.toLowerCase(), chainId);
      return () => {
        cancel();
      };
    }
  }, [ele?.user, chainId]);

  const fromNow = useMemo(() => {
    if (!data?.timestamp) return '-';
    const _duration = data?.timestamp - +dayjs().unix();
    return dayjs.duration(_duration, 's').humanize(true);
  }, [data?.timestamp]);


  // 出块情况
  // block - 当前区块高度和时间
  // data?.producingBlocks - 最近5轮被轮到出块的高度配置
  // 若当前高度 在开区间配置内 则判断出块时间距今时间>60s 则有返回warning
  const producingStatus = useMemo(() => {
    if (!block?.timestamp) return { label: 'Unknown', color: 'B3B3B3' };
    const targetConfig = data?.producingBlocks.find(i => {
      return BigNumber(i.endBlock).gt(block?.number) && BigNumber(i.startBlock).lt(block?.number);
    });

    if (targetConfig) {
      const duration = BigNumber(dayjs().unix()).minus(block?.timestamp);
      if (duration.gte(60)) {
        return { label: 'Lag', color: 'E9B261' };
      }
    }
    return { label: 'Healthy', color: '00EA5E' };
  }, [block?.number, block?.timestamp, data?.producingBlocks]);

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
    return BigNumber(ele?.rewardReadable).plus(BigNumber(ele?.claimAmount).div(1e18)).toString();
  }, [ele?.claimAmount, ele?.rewardReadable]);

  return (
    <SequencerStatusContainer
      onClick={onClick}
      style={{ boxShadow: '0px 10px 30px 0px rgba(0, 0, 0, 0.10)' }}
      className="pointer radius-30 w-340 pt-37 pl-30 pr-30 pb-20 flex flex-col gap-42 items-center position-relative"
    >
      <div className="flex flex-row items-center gap-8 position-absolute top-14 right-20">
        {loading ? (
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

      <div className="flex flex-col gap-5">

        {ele?.infos?.avatar ? <div className="flex flex-row items-center justify-center"><img className="s-90 radiusp-50" crossOrigin="anonymous" src={ele?.infos?.avatar} /></div> : <div className={'avatar s-90 radiusp-50'} />}

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
          <div className="flex flex-row justify-between items-center w-full">
            <div className="fz-14 color-000 fw-400">Uptime</div>
            <div className="fz-14 fw-700 color-000">
              {fromNow || '-'}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center w-full">
            <div className="fz-14 color-000 fw-400">Sequencing Since</div>
            <div className="fz-14 fw-700 color-000">
              {since || '-'}
            </div>
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
