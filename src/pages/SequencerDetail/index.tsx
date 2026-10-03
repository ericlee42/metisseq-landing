import {
  isDecimal,
  addDecimals,
  compareDecimals,
  divideDecimals,
  multiplyDecimals,
  subtractDecimals,
  toFixedDecimal,
} from '@/utils/decimal';
import { parseTokenAmount } from '@/utils/amount';
import { Button, Input, Pagination, Tooltip } from '@/components';
import Avatar from '@/components/Avatar';
import CopyAddress from '@/components/CopyAddress';
import NumberText from '@/components/NumberText';
import { defaultRewardRecipient, explorer, isDev } from '@/configs/common';
import useAllowance from '@/hooks/useAllowance';
import useAuth from '@/hooks/useAuth';
import useDevice from '@/hooks/useDevice';
import useLock from '@/hooks/useLock';
import useMetisPrice from '@/hooks/useMetisPrice';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useUpdate from '@/hooks/useUpdate';
import { rewardRecipientModalVisibleAtom } from '@/models';
import { filterHideText, getImageUrl, jumpLink } from '@/utils/tools';
import { useBoolean } from 'ahooks';
import dayjs from 'dayjs';
import { useSetAtom } from 'jotai';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { formatEther } from 'viem';
import ClaimAndRelock from './components/ClaimAndRelock';
import ClaimModal from './components/ClaimModal';
import DetailModal from './components/DetailModal';
import IncreaseModal from './components/IncreaseModal';
import PartialWithdrawModal from './components/PartialWithdrawModal';
import Row from './components/Row';
import UnlockModal from './components/UnlockModal';
import WithdrawModal from './components/WithdrawModal';

const Container = styled.section`
  .half-w {
    width: 50%;
  }

  .p-0-72 {
    padding: 0px 72px;
  }

  .f-24-bold {
    font-size: 24px;
    font-family: Poppins-ExtraBold, Poppins;
    font-weight: 800;
    color: #313146;
    line-height: 35px;
  }

  .mb-24 {
    margin-bottom: 24px;
  }

  .f-20-bold {
    font-size: 20px;
    font-family: Poppins-ExtraBold, Poppins;
    font-weight: 800;
    color: #313146;
    line-height: 30px;
  }

  .f-14 {
    font-size: 14px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #313146;
    line-height: 21px;
  }

  .f-14-bold {
    font-size: 14px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC;
    font-weight: 600;
    color: #00d2c1;
    line-height: 20px;
  }

  .f-16-bold {
    font-size: 16px;
    font-family: Poppins-ExtraBold, Poppins;
    font-weight: 800;
    color: #313146;
    line-height: 25px;
  }

  .f-18-bold {
    font-size: 18px;
    font-family: Poppins-Bold, Poppins;
    font-weight: bold;
    color: #313146;
    line-height: 27px;
  }

  position: relative;

  .basic-card {
    padding: 22px;
    border-radius: 20px;
    background: #fff;
  }

  background: #f5f5f5;
  .banner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;

    background:
      url(${getImageUrl('@/assets/images/_global/home_top_banner.png')}),
      lightgray 50% / cover no-repeat;
    /* filter: blur(75px); */

    background-size: cover;
    aspect-ratio: 1920 / 410;
    z-index: 0;
  }

  .content {
    max-width: 1440px;
    margin: auto;
  }

  .avatar {
    background: url(${getImageUrl('@/assets/images/sequencer/defaultAvatar.svg')}) no-repeat;
    background-size: contain;
    border-radius: 50%;
  }

  .status-label {
    width: 120px;
    height: 40px;
    /* background: #E5FBF9; */
    border-radius: 12px;
  }

  .status-overview {
    display: inline-flex;
    overflow: hidden;
    .overview-item {
      border-radius: 20px;
      border: 1px solid rgba(0, 45, 133, 0.2);
      background: rgba(0, 45, 133, 0.2);
    }
  }

  .sc0 {
    background: #f6f9fd;
    padding: 48px 0;

    .b {
      width: 990px;
      margin: auto;
    }

    .unclaimed-rewards-container {
      background: #ffffff;
      border-radius: 16px;
      padding: 28px 14px 28px;
    }
  }

  .sc1 {
    max-width: 990px;

    margin-left: auto;
    margin-right: auto;
    height: 160px;

    .unlock-in-progress {
      padding: 10px 20px;
      width: 282px;
      height: 60px;
      background: rgba(247, 232, 231, 1);
      border-radius: 12px;
      img {
        width: 16px;
        height: 21px;
      }

      .f-14-bold {
        font-size: 14px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #b71b13;
        line-height: 20px;
      }

      .f-12 {
        font-size: 12px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #b71b13;
        line-height: 17px;
      }
    }
    .basic-card {
      /* height: 100%; */
      > div {
        padding-top: 28px;
      }
      & > div:not(:last-of-type) {
        border-right: 1px solid #efefef;
      }
    }

    .f-14-bold {
      font-size: 14px;
      font-family: Poppins-SemiBold, Poppins;
      font-weight: 600;
      color: #313146;
      line-height: 21px;
    }
    .f-18-bold {
      font-size: 18px;
      font-family: Poppins-Bold, Poppins;
      font-weight: bold;
      color: #313146;
      line-height: 27px;
    }
  }

  .sc2 {
    margin-left: auto;
    margin-right: auto;
    .block-container {
      width: 990px;
      min-height: 392px;
      display: block;
    }

    table {
      border-collapse: separate;
      tr {
        height: 56px;
      }
      th,
      td {
        text-align: left;
        vertical-align: middle;
        font-size: 14px;
        font-family: Poppins-Regular, Poppins;
        font-weight: 400;
        color: #313146;
        line-height: 21px;
      }
    }
  }

  .sc3 {
    margin-left: auto;
    margin-right: auto;
    .block-container {
      width: 990px;
      min-height: 392px;
      display: block;
    }

    table {
      border-collapse: separate;
      tr {
        height: 56px;
      }
      th,
      td {
        text-align: left;
        vertical-align: middle;
        font-size: 14px;
        font-family: Poppins-Regular, Poppins;
        font-weight: 400;
        color: #313146;
        line-height: 21px;
      }
    }
  }

  .white-button {
    background: #fff;
    border: 1px solid #000;
    span {
      color: #000;
    }
  }
`;

const txPageSize = 10;
const blocksPageSize = 10;
export function Component() {
  React.useEffect(() => {
    const eles: any = document.querySelectorAll('.ms-container');
    if (eles?.length && eles?.[0]?.scrollTop) {
      eles[0].scrollTop = 0;
    }
  }, []);
  const { address, chainId } = useAuth();
  const [relockAmount, setRelockAmount] = React.useState<string | undefined>();

  const { id } = useParams(); // signer addr
  const { allSequencerInfo, run, cancel, data: sequencerInfoList, seqOwners, runOnce } = useSequencerInfo();

  const sequencerInfo: any = sequencerInfoList?.[0];

  const whitelistedAddress = React.useMemo(
    () => sequencerInfo?.sequencers?.owner?.toLowerCase() || '-',
    [sequencerInfo?.sequencers?.owner],
  );

  const currentSequencerInfo = React.useMemo(() => {
    if (!allSequencerInfo || !whitelistedAddress) return null;
    return allSequencerInfo?.[whitelistedAddress?.toLowerCase()];
  }, [allSequencerInfo, whitelistedAddress]);

  const lstName = React.useMemo(() => currentSequencerInfo?.lst_name || '', [currentSequencerInfo]);

  const lstLink = React.useMemo(() => currentSequencerInfo?.lst_url || '', [currentSequencerInfo]);

  const { sequencerId, blockReward, metisBalance } = useUpdate();

  const fetchUserTxData: any = undefined;
  const fetchBlockTxData: any = undefined;
  const fetchBlockTxLoading = false;

  const curUserActiveSequencerId = React.useMemo(() => undefined, []);

  const ifSelf = React.useMemo(
    () => address && whitelistedAddress && whitelistedAddress?.toLowerCase() === address?.toLowerCase(),
    [address, whitelistedAddress],
  );

  React.useEffect(() => {
    let cancelled = false;
    const handleInitCheck = async () => {
      const activeSequencerId = curUserActiveSequencerId || (await seqOwners(whitelistedAddress));
      if (cancelled || !activeSequencerId) return;
      cancel();
      run({ sequencerId: activeSequencerId, self: ifSelf });
    };
    void handleInitCheck();
    return () => {
      cancelled = true;
      cancel();
    };
  }, [curUserActiveSequencerId, ifSelf, whitelistedAddress, seqOwners, cancel, run]);

  const refresh = () => {
    run({ sequencerId: curUserActiveSequencerId, self: ifSelf });
  };

  const txCol = React.useMemo(() => {
    return fetchUserTxData?.histories?.sort((a, b) => +b?.timestamp - +a?.timestamp);
  }, [fetchUserTxData?.histories]);

  const [txCurrentPage, setTxCurrentPage] = React.useState(1);
  const txTotal = React.useMemo(() => txCol?.length || 0, [txCol?.length]);

  const filteredTxCol = React.useMemo(() => {
    const curPage = txCurrentPage - 1;
    const fromIndex = txPageSize * curPage;
    const toIndex = txPageSize * curPage + txPageSize;
    return txCol?.slice(fromIndex, toIndex);
  }, [txCurrentPage, txCol]);
  const totalRewards = React.useMemo(() => {
    const claimedAmount = fetchUserTxData?.histories
      ?.filter((i) => i.action === 'Claim')
      ?.reduce((prev: any, next: any) => {
        return addDecimals(prev, next?.amount);
      }, '0');

    const claimedAmountReadable = divideDecimals(claimedAmount || 0, 1e18);

    return addDecimals(sequencerInfo?.rewardReadable || 0, claimedAmountReadable || 0);
  }, [fetchUserTxData?.histories, sequencerInfo?.rewardReadable]);

  const [prevBlockData, setPrevBlockData] = React.useState<any[]>([]);
  const [skip, setSkip] = React.useState(0);
  const [blocksCurrentPage, setBlocksCurrentPage] = React.useState(1);

  const blocksCol = React.useMemo(() => {
    return [...prevBlockData, ...(fetchBlockTxData?.epoches || [])]?.map((i: any) => {
      const blockNumbers = addDecimals(subtractDecimals(i?.endBlock, i?.startBlock), 1);
      const curEpochId = parseInt(i?.id, 16);
      let curEpochReward = '0';
      if (compareDecimals(curEpochId, sequencerInfo?.curBatchState?.endEpoch) > 0) {
        curEpochReward = blockReward;
      } else {
        const tempCurEpochReward =
          fetchUserTxData?.rewardBatches?.find((i) => {
            return compareDecimals(curEpochId, i?.startEpoch) >= 0 && compareDecimals(curEpochId, i?.endEpoch) <= 0;
          })?.rpb || '0';

        curEpochReward = divideDecimals(tempCurEpochReward, 1e18);
      }
      const rewards = toFixedDecimal(multiplyDecimals(blockNumbers, curEpochReward), 4, 'down');
      return { ...i, rewards: rewards };
    });
  }, [
    blockReward,
    fetchBlockTxData?.epoches,
    fetchUserTxData?.rewardBatches,
    prevBlockData,
    sequencerInfo?.curBatchState?.endEpoch,
  ]);

  const blocksTotal = React.useMemo(() => blocksCol?.length || 0, [blocksCol?.length]);

  const needLoading = React.useMemo(
    () => (compareDecimals(blocksCurrentPage, 6) > 0 ? fetchBlockTxLoading : false),
    [blocksCurrentPage, fetchBlockTxLoading],
  );

  const handleNextPage = async (v) => {
    const nextSkipTriggerPage = toFixedDecimal(
      subtractDecimals(divideDecimals(blocksCol?.length, blocksPageSize), 1),
      0,
      'down',
    );
    if (v >= +nextSkipTriggerPage) {
      const newSkip = skip + blocksPageSize * 6;
      setSkip(newSkip);
      setPrevBlockData(blocksCol);
    }
    setBlocksCurrentPage(v);
  };

  const filteredBlocksCol = React.useMemo(() => {
    const curPage = blocksCurrentPage - 1;
    const fromIndex = blocksPageSize * curPage;
    const toIndex = blocksPageSize * curPage + blocksPageSize;
    return blocksCol?.slice(fromIndex, toIndex);
  }, [blocksCurrentPage, blocksCol]);

  const lockedup = React.useMemo(
    () => formatEther(BigInt(sequencerInfo?.sequencerLock || '0')).toString(),
    [sequencerInfo?.sequencerLock],
  );

  const { relock } = useLock();

  const { allowance, approve } = useAllowance();
  const [approveLoading, { setTrue: setApproveLoadingTrue, setFalse: setApproveLoadingFalse }] = useBoolean(false);

  const needApprove = React.useMemo(
    () => compareDecimals(allowance || '0', parseTokenAmount(relockAmount || '0').toString()) < 0,
    [allowance, relockAmount],
  );

  const handleApprove = async () => {
    await approve();
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
        amount: parseTokenAmount(relockAmount || '0'),
        lockRewards: sequencerInfo?.reward,
        sequencerId,
      });
      await relock({
        amount: parseTokenAmount(relockAmount || '0'),
        lockRewards: false,
        sequencerId,
      });
      setRelockAmount('');
    } catch {
    } finally {
      refresh?.();
      setApproveLoadingFalse();
    }
  };

  const [increaseVisible, setIncreaseVisible] = React.useState(false);
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [unlockVisible, setUnlockVisible] = React.useState(false);
  const [claimVisible, setClaimVisible] = React.useState(false);
  const [withdrawVisible, setWithdrawVisible] = React.useState(false);
  const [partialWithdrawVisible, setpartialWithdrawVisible] = React.useState(false);
  const [claimAndRelockVisible, setClaimAndRelockVisible] = React.useState(false);

  const ifInUnlockProgress = sequencerInfo?.ifInUnlockProgress;
  const unclaimed = React.useMemo(() => sequencerInfo?.rewardReadable || '0', [sequencerInfo?.rewardReadable]);

  const joinedDuration = React.useMemo(() => {
    let fromDate = fetchUserTxData?.histories?.filter((i) => i.action === 'Lock')?.[0]?.timestamp;
    const genesisSignersMainnet = [
      '0xeca7ae7de0d1978df299a547ee66c4503fba474d',
      '0xa233cc81fc6c12e3318ea71ec5d7bba78c706b04',
      '0xaff606251d8540f97ca2db12774c0147a170ab9e',
    ];
    if (chainId == 1 && genesisSignersMainnet.indexOf(id!.toLowerCase()) >= 0) {
      fromDate = 1710406800; // 14/03/2024 9:00:00 UTC
    }

    const unlockTxs = fetchUserTxData?.histories?.filter((i) => i.action === 'Unlock');
    const lastDate = unlockTxs?.length ? unlockTxs?.[0]?.timestamp : +dayjs().unix();

    return subtractDecimals(lastDate, fromDate);
  }, [id, chainId, fetchUserTxData?.histories]);
  const currentApr = React.useMemo(() => {
    let days = toFixedDecimal(divideDecimals(divideDecimals(joinedDuration, 3600), 24), 0, 'down');
    const eps = fetchBlockTxData?.epoches;
    const rbs = fetchUserTxData?.rewardBatches;
    let realRewards = BigInt('0');
    if (rbs && rbs.length > 0 && eps && eps.length > 0) {
      const sortedRbs = rbs.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
      if (rbs.length > 1) {
        const ts = sortedRbs[0].timestamp - sortedRbs[1].timestamp;
        days = toFixedDecimal(divideDecimals(divideDecimals(ts, 3600), 24), 0, 'down');
      }
      const rb = sortedRbs[0];
      const rbStart = BigInt(rb.startEpoch);
      const rbEnd = BigInt(rb.endEpoch);
      const rpb = BigInt(rb.rpb);
      for (const ep of eps) {
        const epochId = BigInt(ep.id);
        const startBlock = BigInt(ep.startBlock);
        const endBlock = BigInt(ep.endBlock);
        if (epochId > rbEnd) {
          continue;
        }
        if (epochId < rbStart) {
          break;
        }
        const epBlocks = endBlock - startBlock + 1n;
        realRewards = realRewards + epBlocks * rpb;
      }
    }

    const rrs = formatEther(BigInt(realRewards));
    if (![days, rrs, lockedup].every((value) => isDecimal(value) && compareDecimals(value, 0) > 0)) {
      return '0';
    }
    return toFixedDecimal(multiplyDecimals(divideDecimals(divideDecimals(rrs, days), lockedup), 36500), 2, 'ceil');
  }, [joinedDuration, lockedup, fetchBlockTxData, fetchUserTxData]);

  const { metisPrice } = useMetisPrice();

  const unclaimedUsdValue = React.useMemo(
    () => multiplyDecimals(metisPrice || '0', unclaimed),
    [metisPrice, unclaimed],
  );
  const { ifMobile } = useDevice();

  const setRewardRecipientModalVisible = useSetAtom(rewardRecipientModalVisibleAtom);

  const [claimLoading, setClaimLoading] = React.useState(false);
  const handleClaim = async () => {
    try {
      setClaimLoading(true);
      const res = await runOnce({ sequencerId, self: true });
      setClaimLoading(false);
      if (!res?.[0]?.sequencers?.rewardRecipient || res?.[0]?.sequencers?.rewardRecipient === defaultRewardRecipient) {
        setRewardRecipientModalVisible(true);
        return;
      }
      setClaimVisible(true);
    } catch {
    } finally {
    }
  };
  return (
    <Container className={'pages-landing flex flex-col'}>
      {ifMobile ? null : <div className={`banner ${ifMobile ? 'h-full' : 'h-410'}`} />}
      <div
        className={`position-relative z-1 content flex flex-col items-center ${ifMobile ? 'maxwp-100 wvw-100' : ''}`}
      >
        <div
          className={`pt-55 pb-20 flex flex-col w-full ${ifMobile ? 'relative pl-22 pr-22 gap-22 pb-60' : 'gap-70'}`}
        >
          {ifMobile ? (
            <div
              className={`banner ${ifMobile ? 'h-full' : 'h-410'}`}
              style={{ filter: 'brightness(2.7)', zIndex: '-200' }}
            />
          ) : null}
          <div className={'flex flex-row gap-32 items-center flex-wrap'}>
            {currentSequencerInfo?.avatar ? (
              <div className={'flex flex-row items-center justify-center mb-24'}>
                <Avatar className={`${ifMobile ? 's-80' : 's-150'} radiusp-50`} src={currentSequencerInfo?.avatar} />
              </div>
            ) : (
              <div className={`avatar ${ifMobile ? 's-80' : 's-150 mb-24'}`} />
            )}

            <div className={`flex flex-col gap-12 color-fff ${ifMobile ? 'flex-1' : ''}`}>
              <div className="flex flex-col gap-4">
                <div className="fz-36 fw-500 ">{currentSequencerInfo?.name || '-'}</div>
                {ifMobile ? null : (
                  <div className="fz-16 fw-400 inter maxw-470">{currentSequencerInfo?.desc || '-'}</div>
                )}
              </div>
              <div>
                <span
                  className="fz-18 fw-400 pointer underlined"
                  onClick={() => {
                    if (!currentSequencerInfo?.url) return;
                    jumpLink(currentSequencerInfo?.url, '_blank');
                  }}
                >
                  {currentSequencerInfo?.url}
                </span>
              </div>
            </div>
          </div>
          {ifMobile ? (
            <div className="fz-16 fw-400 inter maxwp-100 mb-22 color-fff">{currentSequencerInfo?.desc || '-'}</div>
          ) : null}

          <div
            className={`${ifMobile ? ' flex-col ' : ' flex-row justify-center '} status-overview flex gap-10 color-fff`}
          >
            <div className="overview-item flex-1 pt-12 pb-12 pl-30 pr-30 flex flex-col justify-center gap-10">
              <div className="fz-26 fw-500 color-fff">Owner</div>
              <CopyAddress dark={false} addr={whitelistedAddress} className={'flex-1 fz-16 fw-400 inter color-fff'} />
            </div>
            <div className="overview-item flex-1 pt-12 pb-12 pl-30 pr-30 flex flex-col justify-center gap-10">
              <div className="fz-26 fw-500 color-fff">Signer</div>
              <CopyAddress dark={false} addr={id} className={'flex-1 fz-16 fw-400 inter color-fff'} />
            </div>
            {lstName.length > 0 ? (
              <div className="overview-item flex-1 pt-12 pb-12 pl-30 pr-30 flex flex-col justify-center gap-10">
                <div className="fz-26 fw-500 color-fff">LST</div>
                <div
                  className="flex flex-row items-center gap-8 pointer"
                  style={{ fontFamily: 'Poppins-Regular, Poppins' }}
                  onClick={() => window.open(lstLink, '_blank')}
                >
                  <span
                    className="flex-1 fz-16 fw-400 inter color-fff underlined lh-21"
                    style={{ fontFamily: 'Poppins-Regular, Poppins' }}
                  >
                    {lstName}
                  </span>
                  <img className="s-12" src={getImageUrl('@/assets/images/_global/ic_export_w.svg')} />
                </div>
              </div>
            ) : ifMobile ? null : (
              <div className="flex-1 pt-12 pb-12 pl-30 pr-30 flex flex-col justify-center gap-10" />
            )}
          </div>
        </div>

        <div className={`${ifMobile ? 'w-full pl-22 pr-22 pt-33 pb-76' : 'w-1060 pt-60 pb-146'} flex flex-col gap-20`}>
          <div className="w-full basic-card gap-21 flex flex-col pb-38">
            <div className="flex flex-row items-center justify-between">
              <div className="fz-28 fw-500 ">Mining Overview</div>
              {isDev ? (
                <div className="flex flex-row items-center gap-8">
                  <Button
                    type="solid"
                    onClick={() => {
                      setIncreaseVisible(true);
                    }}
                  >
                    <div style={{ padding: '10px 16px' }}>Increase</div>
                  </Button>
                  <Button
                    type="solid"
                    onClick={() => {
                      setUnlockVisible(true);
                    }}
                  >
                    <div style={{ padding: '10px 16px' }}>Unlock</div>
                  </Button>
                  <Button type="solid" onClick={handleClaim}>
                    <div style={{ padding: '10px 16px' }}>Claim</div>
                  </Button>
                  <Button
                    type="solid"
                    onClick={() => {
                      setWithdrawVisible(true);
                    }}
                  >
                    <div style={{ padding: '10px 16px' }}>Withdraw</div>
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="h-1 bg-color-DFDFDF" />

            <div className={`${ifMobile ? ' flex-col ' : ' flex-row items-center '} flex gap-20`}>
              <div className="flex-1 flex flex-col gap-12">
                <div className="flex flex-row items-center gap-6">
                  <div className="color-848484 fz-20 fw-500">Locked-Up</div>
                  <Tooltip title={<span>Amount of METIS locked by the sequencer.</span>}>
                    <img src={getImageUrl('@/assets/images/_global/ic_q.svg')} />
                  </Tooltip>
                </div>
                <div className="fz-26 color-000 fw-500 items-center gap-8 flex-wrap">
                  <div className="flex flex-row m-b-10">
                    <span className="m-r-10">
                      <NumberText value={lockedup || '0'} />
                    </span>
                    <img
                      style={{ height: '22px', width: '23px' }}
                      src={getImageUrl('@/assets/images/token/metis-dark.svg')}
                    />
                  </div>

                  {ifSelf ? (
                    ifInUnlockProgress ? (
                      <div className="flex flex-row">
                        <Button
                          className="pl-15 pr-15 m-r-10"
                          type="metis"
                          onClick={() => {
                            if (!ifInUnlockProgress) {
                              setWithdrawVisible(true);
                            }
                          }}
                        >
                          <span>Withdraw</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-row">
                        <Button
                          className="pl-15 pr-15 m-r-10"
                          type="metis"
                          loading={!sequencerId}
                          onClick={() => {
                            if (compareDecimals(lockedup, 0) > 0) {
                              setUnlockVisible(true);
                            } else {
                              setIncreaseVisible(true);
                            }
                          }}
                        >
                          {compareDecimals(lockedup, 0) > 0 ? 'Unlock' : 'Lock'}
                        </Button>
                        <Button
                          className="pl-15 pr-15 white-button"
                          type="second"
                          loading={!sequencerId}
                          onClick={() => {
                            if (!ifInUnlockProgress) {
                              setpartialWithdrawVisible(true);
                            }
                          }}
                        >
                          <span>Partial Withdraw</span>
                        </Button>
                      </div>
                    )
                  ) : null}
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-12">
                <div className="flex flex-row items-center gap-6">
                  <div className="color-848484 fz-20 fw-500">Mining Rewards Rate(MRR)</div>
                  <Tooltip
                    title={
                      <span>
                        The expected rewards rate from the sequencer mining. (Data may be delayed by up to 72 hours.)
                      </span>
                    }
                  >
                    <img src={getImageUrl('@/assets/images/_global/ic_q.svg')} />
                  </Tooltip>
                </div>
                <div className="fz-26 color-000 fw-500">{currentApr}%</div>
              </div>

              <div className="flex-1 flex flex-col gap-12">
                <div className="flex flex-row items-center gap-6">
                  <div className="color-848484 fz-20 fw-500">Total Rewards</div>
                  <Tooltip
                    title={
                      <span>
                        Total METIS tokens earned by this sequencer through sequencer mining.(Data may be delayed by up
                        to 72 hours.)
                      </span>
                    }
                  >
                    <img src={getImageUrl('@/assets/images/_global/ic_q.svg')} />
                  </Tooltip>
                </div>
                <div className="fz-26 color-000 fw-500 flex flex-row items-center gap-8">
                  <span>
                    <NumberText value={totalRewards || '0'} />
                  </span>{' '}
                  <img
                    style={{ height: '22px', width: '23px' }}
                    src={getImageUrl('@/assets/images/token/metis-dark.svg')}
                  />
                </div>
              </div>
            </div>
          </div>

          {ifSelf ? (
            <div className={`flex ${ifMobile ? 'flex-col items-center w-full' : 'flex-row items-center'} gap-20`}>
              <div className={`${ifMobile ? 'w-full' : 'flex-1'} wp-50 basic-card gap-21 flex flex-col pb-38`}>
                <div className="flex flex-row items-center justify-between">
                  <div className="fz-28 fw-500 ">Claim Your Rewards</div>
                </div>

                <div className="h-1 bg-color-DFDFDF" />

                <div className="flex flex-row items-center gap-20">
                  <div className="flex-1 flex flex-col gap-12">
                    <div className="flex flex-row items-center gap-6">
                      <div className="color-848484 fz-18 fw-500">Unclaimed Rewards</div>
                      <Tooltip
                        title={
                          <span>
                            Mining rewards are calculated and distributed every 3 days. You can claim your earned
                            rewards to L2 at any time.
                          </span>
                        }
                      >
                        <img src={getImageUrl('@/assets/images/_global/ic_q.svg')} />
                      </Tooltip>
                    </div>
                    <div className="fz-26 color-000 fw-500 flex flex-row items-center gap-8">
                      <span>{unclaimed}</span>
                      <img
                        style={{ height: '22px', width: '23px' }}
                        src={getImageUrl('@/assets/images/token/metis-dark.svg')}
                      />
                      {ifMobile ? null : (
                        <div className="flex">
                          <Button
                            onClick={handleClaim}
                            disabled={sequencerId ? compareDecimals(unclaimed, 0) <= 0 || claimLoading : false}
                            loading={claimLoading || !sequencerId}
                            className={ifMobile ? 'w-120 h-36' : 'pl-15 pr-15 m-r-10'}
                            type="metis"
                          >
                            Claim
                          </Button>
                        </div>
                      )}
                    </div>
                    <span className="color-848484 fz-14 fw-400 inter">{unclaimedUsdValue} USD</span>
                    {ifMobile ? (
                      <Button
                        onClick={handleClaim}
                        disabled={sequencerId ? compareDecimals(unclaimed, 0) <= 0 || claimLoading : false}
                        loading={claimLoading || !sequencerId}
                        className={ifMobile ? 'w-120 h-36 self-end' : 'pl-15 pr-15'}
                        type="metis"
                      >
                        Claim
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className={`${ifMobile ? 'w-full' : 'flex-1'} wp-50 basic-card gap-21 flex flex-col pb-38`}>
                <div className="flex flex-row items-center justify-between">
                  <div className="fz-28 fw-500 ">Increase Locked-up</div>
                </div>

                <div className="h-1 bg-color-DFDFDF" />

                <div className={`${ifMobile ? 'flex-col' : 'flex-row items-center'} flex gap-20`}>
                  <div className="flex-2 flex flex-col gap-12">
                    <div className="flex flex-row items-center gap-6">
                      <div className="color-848484 fz-18 fw-500">Amount</div>
                    </div>
                    <div className="fz-26 color-000 fw-500 flex flex-row items-center gap-8">
                      <Input
                        max={metisBalance?.readable || 0}
                        value={relockAmount}
                        onChange={setRelockAmount}
                        className="fz-26"
                        solid
                        suffix={
                          <img
                            className="s-22"
                            style={{ height: '22px', width: '23px' }}
                            src={getImageUrl('@/assets/images/token/metis-dark.svg')}
                          />
                        }
                      />
                    </div>
                  </div>

                  <div className="flex-2 flex flex-col gap-12">
                    <div className="flex flex-row items-center gap-6">
                      <div className="color-848484 fz-18 fw-500">Expected Rewards</div>
                    </div>
                    <div className="fz-26 color-000 fw-500 flex flex-row items-center gap-8">
                      <span>{multiplyDecimals(relockAmount || '0', 0.2)}</span>
                      <img
                        style={{ height: '22px', width: '23px' }}
                        src={getImageUrl('@/assets/images/token/metis-dark.svg')}
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-12">
                    <div className="flex flex-row items-center gap-6">
                      <div className="color-848484 fz-20 fw-500" />
                    </div>
                    <div className="fz-26 color-000 fw-500 flex flex-row items-center gap-8 self-end">
                      <Button
                        type="metis"
                        className={ifMobile ? 'h-36 w-120 self-end' : 'h-26 pl-15 pr-15'}
                        disabled={sequencerId ? !relockAmount : false}
                        loading={approveLoading || !sequencerId}
                        onClick={handleRelock}
                      >
                        {needApprove ? <span>Approve</span> : <span>Confirm</span>}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="sc2 w-full basic-card gap-20">
            <div className="flex flex-col gap-20">
              <div className="fz-28 fw-500" id="block-produced">
                Block Produced
              </div>
              <div className="h-1 bg-color-DFDFDF" />
            </div>

            <div
              className="block-container flex flex-row ptb-28 w-full position-relative h-615"
              style={ifMobile ? { overflow: 'auto' } : {}}
            >
              <table className={`${ifMobile ? 'w-460' : 'w-full'}`}>
                <thead>
                  <tr>
                    <th>Latest Block Produced</th>
                    <th>Status</th>
                    <th>
                      <div className="flex flex-row items-center  gap-6">
                        <span>Rewards</span>
                        <Tooltip title={<span>Mining rewards are calculated and distributed every 3 days.</span>}>
                          <img src={getImageUrl('@/assets/images/_global/ic_q.svg')} />
                        </Tooltip>
                      </div>
                    </th>
                    <th>Date</th>
                    {ifMobile ? null : <th>Time</th>}
                  </tr>
                </thead>
                <tbody>
                  {needLoading ? (
                    <div className="position-absolute translateCenter topr-50 leftr-50 color-848484">Loading</div>
                  ) : (
                    filteredBlocksCol?.map((i, index) => <Row key={index} col={i} />)
                  )}
                </tbody>
              </table>

              {needLoading || filteredBlocksCol?.length ? null : (
                <div className="position-absolute translateCenter topr-50 leftr-50 color-848484">No Data</div>
              )}
            </div>
            <div className="pagination flex flex-row items-center justify-end mt-24" style={{ height: '32px' }}>
              <Pagination
                current={blocksCurrentPage}
                total={blocksTotal}
                pageSize={blocksPageSize}
                onChange={handleNextPage}
              />
            </div>
          </div>

          {ifSelf ? (
            <div className="sc3 w-full basic-card gap-20">
              <div className="flex flex-col gap-20">
                <div className="fz-28 fw-500 ">Transaction History</div>
                <div className="h-1 bg-color-DFDFDF" />
              </div>
              <div
                className="block-container flex flex-row ptb-28 w-full position-relative"
                style={ifMobile ? { overflow: 'auto' } : {}}
              >
                <table className={`${ifMobile ? 'w-560' : 'w-full'}`}>
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>Address</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxCol?.map((i: any, index: React.Key | null | undefined) => (
                      <tr key={index}>
                        <td
                          className="align-center underlined pointer"
                          onClick={() => {
                            if (!chainId) return;
                            jumpLink(`${explorer[chainId]}/tx/${i?.txHash}`, '_blank');
                          }}
                        >
                          {filterHideText(i?.txHash, 8)}
                        </td>
                        <td>{filterHideText(i?.sequencer?.address, 6, 4)}</td>
                        <td>
                          <span className="capitalized">{i?.action}</span>
                        </td>
                        <td>
                          {i?.deltaAmountReadable || i?.amountReadable} {i?.symbol}
                        </td>
                        <td>{dayjs.unix(i?.timestamp).format('DD/MM/YYYY HH:mm:ss')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredTxCol?.length ? null : (
                  <div className="position-absolute translateCenter topr-50 leftr-50 color-848484">No Data</div>
                )}
              </div>
              <div className="pagination flex flex-row items-center justify-end mt-24" style={{ height: '32px' }}>
                <Pagination
                  current={txCurrentPage}
                  total={txTotal}
                  pageSize={txPageSize}
                  onChange={(v) => setTxCurrentPage(v)}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <>
        <IncreaseModal
          refetchGraph={refresh}
          visible={increaseVisible}
          onClose={() => {
            setIncreaseVisible(false);
          }}
        />

        <UnlockModal
          refetchGraph={refresh}
          visible={ifSelf && unlockVisible}
          onClose={() => {
            setUnlockVisible(false);
          }}
        />

        <DetailModal
          refetchGraph={refresh}
          visible={ifSelf && detailsVisible}
          onClose={() => {
            setDetailsVisible(false);
          }}
        />

        <WithdrawModal
          refetchGraph={refresh}
          visible={withdrawVisible}
          onClose={() => {
            setWithdrawVisible(false);
          }}
        />
        <PartialWithdrawModal
          refetchGraph={refresh}
          visible={partialWithdrawVisible}
          lockedup={lockedup}
          onClose={() => {
            setpartialWithdrawVisible(false);
          }}
        />
        <ClaimAndRelock
          refetchGraph={refresh}
          visible={claimAndRelockVisible}
          lockedup={lockedup}
          unclaimed={unclaimed}
          onClose={() => {
            setClaimAndRelockVisible(false);
          }}
        />

        <ClaimModal
          refetchGraph={refresh}
          visible={ifSelf && claimVisible}
          onClose={() => {
            setClaimVisible(false);
          }}
        />
      </>
    </Container>
  );
}

Component.displayName = 'SequencerDetail';
