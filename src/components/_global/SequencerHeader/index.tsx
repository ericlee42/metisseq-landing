/* eslint-disable max-len */
import { Button, Modal, message } from '@/components';
import SequencerItemContainer from '@/components/SequencerItemContainer';
import { contracts, defaultExpectedApr } from '@/configs/common';
import fetchOverview from '@/graphql/overview';
import useAuth from '@/hooks/useAuth';
import useUpdate from '@/hooks/useUpdate';
import { getImageUrl, jumpLink } from '@/utils/tools';
import { useBoolean, useRequest } from 'ahooks';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { multicall } from '@wagmi/core';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import Loading from '../Loading';
import NumberText from '@/components/NumberText';
import useDevice from '@/hooks/useDevice';
import WalletModal from '@/components/WalletModal';
import { deepCopy } from 'ethers/lib/utils';
import fetchClaimedRewards from '@/graphql/claimedReward';

const StyledModal = styled(Modal)``;

const Container = styled.section`
  .half-w {
    width: 50%;
  }

  .p-0-72 {
    padding: 0px 72px;
  }

  .f-12-sc3 {
    font-size: 11px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #313146;
    line-height: 17px;
  }

  .f-16-sc3 {
    font-size: 16px;
    font-family: Poppins-Bold, Poppins;
    font-weight: bold;
    color: #313146;
    line-height: 25px;
  }

  .top-banner {
    padding: 0px 0 48px;

    .f-28 {
      font-size: 28px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #313146;
      line-height: 40px;
    }

    .f-16 {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #313146;
      line-height: 22px;
    }

    .top-content {
      max-width: 1440px;
      width: 100vw;
      padding: 0 110px;
      margin: auto;
      h1 {
        font-size: 56px;
        font-family: Poppins-SemiBold, Poppins;
        font-weight: 600;
        color: #313146;
        line-height: 85px;
      }
      h2 {
        font-size: 28px;
        font-family: Poppins-Regular, Poppins;
        font-weight: 400;
        color: #313146;
        line-height: 42px;
      }
      button.primary {
        background: #00d2c1;
        border-radius: 36px;
        width: fit-content;
        span {
          padding: 22px 52px;
          font-size: 20px;
          font-family: Poppins-SemiBold, Poppins;
          font-weight: 600;
          color: #313146;
          line-height: 30px;
        }
      }
    }

    background: url(${getImageUrl('@/assets/images/_global/home_top_banner.png')});
    /* aspect-ratio: 1440 / 560; */
    width: 100vw;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    padding-bottom: 220px;
    position: relative;
    .info-card-container {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
      .opacity-card {
        box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.1);
        background: #fff;
        border-radius: 16px;
        backdrop-filter: blur(10px);
        padding: 23px;
        gap: 4px;
      }
    }
  }

  .main-section {
    padding-top: 64px;
    padding-bottom: 64px;
    &.main-section-2 {
      background: url(${getImageUrl('@/assets/images/_global/main_section_2.png')}), lightgray 50% / cover no-repeat;
      background-size: cover;
      /* filter: blur(100px); */
    }
    &.main-section-4 {
      background: linear-gradient(95deg, #aa30ff 5.57%, #00498c 96.09%);
    }

    &.dark {
      background: rgba(246, 249, 253, 1);
    }

    .f-40 {
      font-size: 40px;
      font-family: Poppins;
      font-weight: 900;
      color: #313146;
      line-height: 60px;
    }

    .f-16 {
      font-size: 16px;
      font-family: Poppins;
      font-weight: 400;
      color: #313146;
      line-height: 25px;
    }

    .f-14 {
      font-size: 14px;
      font-family: Poppins;
      font-weight: 900;
      color: #313146;
      line-height: 21px;
    }

    .f-20 {
      font-size: 20px;
      font-family: Poppins-Bold, Poppins;
      font-weight: bold;
      color: #313146;
      line-height: 30px;
    }

    .mw-150 {
      max-width: 150px;
    }

    .align-center {
      text-align: center;
    }

    .section2-item {
      width: calc(50%-32px);
      padding: 22px 42px;
      &:nth-of-type(odd) {
        justify-content: flex-end;
      }
    }

    .mw-436 {
      max-width: 436px;
    }
  }

  .sc3 {
    width: 100vw;
    max-width: 1200px;
    margin: auto;
    .overall-container {
      height: 200px;
      background: rgba(241, 243, 249, 0.5);
      border-radius: 8px;
      border: 1px solid #edeff7;
      &:last-of-type {
        height: 280px;
      }
    }
    .colored-label {
      position: absolute;
      top: 0%;
      left: 0%;
      transform: translate(0, -50%);
    }
    .sc3-box {
      background: linear-gradient(180deg, #ffffff 0%, #f8f9fc 100%);
      border-radius: 32px;
      width: 240px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .sc4 {
    .progress-bar {
      position: relative;
      width: 1000px;
      margin: auto;
    }
    .bar {
      top: calc(50% + 10px);
    }
    .index {
      width: 42px;
      height: 42px;
      min-height: 42px;
      background: #ffffff;
      border: 4px solid #e8f1fb;
      border-radius: 50%;

      font-size: 16px;
      font-family: Poppins-Bold, Poppins;
      font-weight: bold;
      color: #313146;
      line-height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .c {
      height: 90px;
      &.c-0 {
        align-items: flex-start;
        span {
          transform: translate(-50%, 0);
        }
      }
      &.c-1 {
        flex: 2;
      }
      &.c-2 {
        flex: 2;
      }
      &:last-of-type {
        align-items: flex-end;
        span {
          transform: translate(50%, 0);
        }
      }
    }
    .submit {
      margin: auto;
      width: 224px;
      height: 58px;
      background: #00d2c1;
      border-radius: 29px;
      span {
        font-size: 16px;
        font-family: Poppins-SemiBold, Poppins;
        font-weight: 600;
        color: #313146;
        line-height: 25px;
      }
    }
  }

  .sc5 {
    .faq-row-wrapper {
      width: 610px;
      margin: auto;
      background: transparent;
      .faq-body {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .faq-row {
        position: relative;
        .icon-wrapper {
          top: 50%;
          transform: translate(0, -50%);
        }
        border-radius: 16px;
        border: none;
        background-color: #fff;
        padding: 0 40px;

        .row-title,
        .row-content-text {
          /* height: 80px; */
        }
        .row-content-text {
          display: flex;
          align-items: center;
        }

        .row-title-text,
        .row-content-text {
          font-size: 26px;
          font-weight: 400;
          font-family: Raleway;
          color: #000;
          line-height: 32px;
        }
        .row-content-text {
          font-size: 20px !important;
          line-height: 22px;
        }
      }
    }
  }
`;

const SequencerHeader = ({ filterBy = 'all' }: { filterBy?: string }) => {
  const { address, chainId } = useAuth();
  const { run, data } = useRequest(fetchOverview, { manual: true });
  const { sequencerTotalInfo, liquidateReward } = useUpdate();
  const { runOnce, allSequencerInfo } = useSequencerInfo();
  const [checkLoading, { setTrue: checkLoadingTrue, setFalse: checkLoadingFalse }] = useBoolean(false);
  const [ifWhiteListed, setIfWhiteListed] = useState<boolean>(false);
  const [isSequencer, setSequencer] = useState<boolean>(false);
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [signerAddr, setSignerAddr] = useState<undefined | string>(undefined);

  useEffect(() => {
    if (chainId) {
      run(+chainId);
    }
  }, [chainId]);

  const jumpSequencer = (id: string | undefined) => {
    if (!id) {
      message.error('Unknown Sequencer');
      return;
    }
    navigate(`/sequencers/${id}`);
  };

  const navigate = useNavigate();

  const jumpLinkBecomeSequencer = async () => {
    navigate('/becomeSequencer');
  };

  const checkWhiteList = async () => {
    if (!address) return;
    try {
      checkLoadingTrue();
      setIfWhiteListed(false);

      const multiP: any = [
        {
          ...contracts.lock?.[chainId],
          functionName: 'whitelist', // whitelist
          args: [address],
        },
        {
          ...contracts.lock?.[chainId],
          functionName: 'seqOwners', // seqOwners
          args: [address],
        },
      ];

      const res = await multicall({
        contracts: multiP,
      });

      const isWhiteListed: any = res?.[0]?.result;
      const isSequencer: any = res?.[1]?.result;

      if (isSequencer) {
        const batchInfo = await runOnce({
          sequencerId: isSequencer,
          self: true,
        });

        setSignerAddr(batchInfo?.[0]?.sequencers?.signer);

        setIfWhiteListed(true);
        setSequencer(true);
      } else if (isWhiteListed) {
        jumpLinkBecomeSequencer();
      } else {
        setIfWhiteListed(false);
        setSequencer(false);
      }
      checkLoadingFalse();
      setTrue();
    } catch (e) {
      message.error('Invalid');
      checkLoadingFalse();
    }
  };

  const sequencerCards = React.useMemo(() => {
    if (!data?.length) return [];
    return data?.map((i) => ({
      id: i?.sequencer?.address,
      ...i,
    }));
  }, [data]);

  const fetchBatchSequencerInfo = async () => {
    if (!sequencerCards?.length) return undefined;
    const ids = Array.from(new Set(sequencerCards?.map((i) => i?.sequencer?.id)));

    const batchInfo = await runOnce({
      sequencerIds: ids,
    });

    return batchInfo?.map((i, index) => {
      return {
        ...i,
        ...sequencerCards?.find((j) => j?.sequencer?.owner?.toLowerCase() === i?.sequencers?.owner?.toLowerCase()),
      };
    });
  };

  const {
    run: fetchBatchSequencerInfoRun,
    data: fetchBatchSequencerInfoData,
    loading: fetchBatchSequencerInfoLoading,
  } = useRequest(fetchBatchSequencerInfo, { manual: true });

  const {
    run: fetchClaimedRewardsRun,
    data: fetchClaimedRewardsData,
    loading: fetchClaimedRewardsLoading,
  } = useRequest(fetchClaimedRewards, { manual: true });

  const filteredFetchBatchSequencerInfoData = useMemo(
    () =>
      deepCopy(fetchBatchSequencerInfoData)
        ?.filter((i) => {
          if (filterBy === 'all') {
            return true;
          }
          if (filterBy === 'healthy') {
            return !i.ifInUnlockProgress && i.ifActive;
          }
          return false;
        })
        ?.map((i) => {
          let renewTs = i.timestamp;
          const genesisSignersMainnet = ['0xeca7ae7de0d1978df299a547ee66c4503fba474d', '0xa233cc81fc6c12e3318ea71ec5d7bba78c706b04', '0xaff606251d8540f97ca2db12774c0147a170ab9e'];
          if (chainId == 1 && genesisSignersMainnet.indexOf(i.sequencer.address.toLowerCase()) >= 0) {
            renewTs = 1710406800; // 14/03/2024 9:00:00 UTC
          }
          return {
            ...i,
            timestamp: renewTs,
            infos: {
              ...allSequencerInfo?.[i?.sequencers?.owner?.toLowerCase()],
            },
          };
        }),
    [fetchBatchSequencerInfoData, allSequencerInfo, filterBy],
  );

  const totalReward = useMemo(() => {
    // ele?.rewardReadable
    const amount = fetchBatchSequencerInfoData?.reduce((prev, next) => {
      return BigNumber(prev).plus(next?.rewardReadable).toString();
    }, 0);
    return BigNumber(liquidateReward || '0')
      .plus(amount || '0')
      .toString();
  }, [fetchBatchSequencerInfoData, liquidateReward]);

  useEffect(() => {
    if (!sequencerCards?.length) return;
    fetchBatchSequencerInfoRun();
  }, [sequencerCards, chainId]);

  const totalSignerAddressList = useMemo(
    () => fetchBatchSequencerInfoData?.map((i) => i?.sequencers?.signer?.toLowerCase()),
    [fetchBatchSequencerInfoData],
  );

  useEffect(() => {
    if (totalSignerAddressList?.length) {
      fetchClaimedRewardsRun(totalSignerAddressList, +chainId);
    }
  }, [totalSignerAddressList, chainId]);

  const { ifMobile } = useDevice();

  return (
    <>
      {ifMobile ? (
        <div className="flex flex-col gap-8 p-22 pt-36 pb-36">
          <span className="fz-40 fw-700 color-000">Metis</span>
          <span className="fz-30 fw-500 color-000">Sequencer Mining</span>
        </div>
      ) : null}
      <Container className={ifMobile ? 'pl-22 pr-22' : ''}>
        <div className={`top-banner ${ifMobile ? 'radius-22 w-full p-26 pt-41 pb-41' : ''}`}>
          {ifMobile ? (
            <div className="flex flex-col gap-118">
              <span className="fz-17 fw-500 color-fff lh-130">
                Secure the Metis network and earn staking rewards. An exclusive opportunity for qualified operators.
              </span>
              <div className="flex flex-col items-center gap-12">
                {address ? (
                  <Button loading={checkLoading} onClick={checkWhiteList} type="dark" className="w-full radius-50 h-53">
                    <div className="pt-15 pb-15 pl-30 pr-30 fz-18 fw-500 raleway">Become a Sequencer</div>
                  </Button>
                ) : (
                  <WalletModal />
                )}
                <Button
                  onClick={() => {
                    jumpLink('https://docs.metis.io/dev/decentralized-sequencer/overview', '_blank');
                  }}
                  type="light"
                  className="radius-50 w-full"
                >
                  <div className="pt-15 pb-15 pl-30 pr-30 fz-18 fw-500 raleway">Read Docs</div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="top-content flex flex-col gap-58 pt-100">
              <div className="gap-48 flex flex-col">
                <div className="gap-16 flex flex-col">
                  <div className="flex flex-col">
                    <span className="fz-100 fw-700 raleway color-fff">Metis</span>
                    <br />
                    <span className="fz-72 fw-700 raleway color-fff">Sequencer Mining</span>
                  </div>
                  <div className="lh-120 maxw-500 fz-20 fw-500 raleway color-fff">
                    Secure the Metis network and earn mining rewards. An exclusive opportunity for qualified operators.
                  </div>
                </div>
                <div className="flex flex-row items-center gap-12">
                  <Button loading={checkLoading} onClick={checkWhiteList} type="dark" className="radius-50 h-53 w-250">
                    <div className="pt-15 pb-15 pl-30 pr-30 fz-18 fw-500 raleway">Become a Sequencer</div>
                  </Button>
                  <Button
                    onClick={() => {
                      jumpLink('https://docs.metis.io/dev/decentralized-sequencer/overview', '_blank');
                    }}
                    type="light"
                    className="radius-50"
                  >
                    <div className="pt-15 pb-15 pl-30 pr-30 fz-18 fw-500 raleway">Read Docs</div>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {ifMobile ? null : (
            <div className="flex flex-row items-center gap-8 info-card-container w-1150">
              <div className="opacity-card flex flex-col items-center flex-1">
                <span className="fz-18 fw-700 inter">
                  <NumberText value={sequencerTotalInfo?.currentSequencerSetTotalLockReadable} />
                </span>

                <div className="flex items-center gap-8">
                  <span className="fz-14 fw-400 inter">Total Metis Participating</span>
                </div>
              </div>
              <div className="opacity-card flex flex-col items-center flex-1">
                <span className="fz-18 fw-700 inter">
                  {BigNumber(defaultExpectedApr).multipliedBy(100).toString()}%
                </span>
                <div className="flex items-center gap-8">
                  <span className="fz-14 fw-400 inter">Expected Mining Rewards Rate</span>
                </div>
              </div>
              <div className="opacity-card flex flex-col items-center flex-1">
                <span className="fz-18 fw-700 inter">
                  <NumberText value={filteredFetchBatchSequencerInfoData?.length || '-'} />
                </span>
                <div className="flex items-center gap-8">
                  <span className="fz-14 fw-400 inter">Current Number of Sequencers</span>
                </div>
              </div>
              <div className="opacity-card flex flex-col items-center flex-1">
                <span className="fz-18 fw-700 inter">
                  <NumberText value={totalReward} />
                </span>
                <div className="flex items-center gap-8">
                  <span className="fz-14 fw-400 inter">Total Rewards Distributed</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {ifMobile ? (
          <div className="mt-17 flex flex-col items-center gap-8 info-card-container w-full position-relative">
            <div
              className="w-full p-24 radius-20 h-89 opacity-card justify-center flex flex-col items-center"
              style={{ boxShadow: '0px 10px 30px 0px rgba(0, 0, 0, 0.10)' }}
            >
              <span className="fz-18 fw-700 inter">
                <NumberText value={sequencerTotalInfo?.currentSequencerSetTotalLockReadable} />
              </span>

              <div className="flex items-center gap-8">
                <span className="fz-14 fw-400 inter">Total Metis Participating</span>
              </div>
            </div>
            <div
              className="w-full p-24 radius-20 h-89 opacity-card justify-center flex flex-col items-center"
              style={{ boxShadow: '0px 10px 30px 0px rgba(0, 0, 0, 0.10)' }}
            >
              <span className="fz-18 fw-700 inter">{BigNumber(defaultExpectedApr).multipliedBy(100).toString()}%</span>
              <div className="flex items-center gap-8">
                <span className="fz-14 fw-400 inter">Expected Mining Rewards Rate</span>
              </div>
            </div>
            <div
              className="w-full p-24 radius-20 h-89 opacity-card justify-center flex flex-col items-center"
              style={{ boxShadow: '0px 10px 30px 0px rgba(0, 0, 0, 0.10)' }}
            >
              <span className="fz-18 fw-700 inter">
                <NumberText value={filteredFetchBatchSequencerInfoData?.length || '-'} />
              </span>
              <div className="flex items-center gap-8">
                <span className="fz-14 fw-400 inter">Current Number of Sequencers</span>
              </div>
            </div>
            <div
              className="w-full p-24 radius-20 h-89 opacity-card justify-center flex flex-col items-center"
              style={{ boxShadow: '0px 10px 30px 0px rgba(0, 0, 0, 0.10)' }}
            >
              <span className="fz-18 fw-700 inter">
                <NumberText value={totalReward} />
              </span>
              <div className="flex items-center gap-8">
                <span className="fz-14 fw-400 inter">Total Rewards Distributed</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="main-section maxw-1140 m-auto flex flex-col pt-90 pb-153 wp-100">
          <div id="sequencer" className="flex flex-row items-center justify-between">
            <div className={`${ifMobile ? 'fz-32' : 'fz-36'} fw-700 color-000`}>Sequencers</div>
          </div>
          <div className="mb-35 h-1 w-full bg-color-CDCDCD mt-20" />
          {!filteredFetchBatchSequencerInfoData && fetchBatchSequencerInfoLoading ? (
            <div className="h-200 w-full flex flex-row justify-center items-center">
              <Loading size={32} />
            </div>
          ) : null}
          {!filteredFetchBatchSequencerInfoData?.length && !fetchBatchSequencerInfoLoading ? (
            <div className="h-200 w-full flex flex-row justify-center items-center">
              <span>No Data</span>
            </div>
          ) : null}
          <div className={`flex flex-row items-center ${ifMobile ? 'justify-center' : ''} gap-20 flex-wrap`}>
            {filteredFetchBatchSequencerInfoData?.map((i, index) => (
              <SequencerItemContainer
                claimedInfoLoading={fetchClaimedRewardsLoading}
                claimedInfo={fetchClaimedRewardsData?.[i?.sequencers?.signer?.toLowerCase()]}
                ele={i}
                totalLockUp={BigNumber(i?.sequencerLock || 0)
                  .div(1e18)
                  .toString()}
                since={dayjs(i?.timestamp * 1000).format('YYYY-MM-DD')}
                onClick={() => {
                  jumpSequencer(i?.sequencer?.address);
                }}
                key={index}
              />
            ))}
          </div>
        </div>
      </Container>

      <StyledModal visible={visible} onClose={setFalse}>
        <div className="white-list-container flex flex-col gap-30 pl-32 pr-32 pb-30">
          <div className="flex flex-col gap-35 items-center">
            <div className="flex flex-row items-center gap-22 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
                <g clipPath="url(#clip0_673_981)">
                  <rect width="78" height="78" rx="39" fill="#1B4A82" />
                  <path
                    d="M27.5413 69.3136C25.8051 72.9729 24.0571 76.8427 22.3448 80.9346C22.3641 81.4078 22.793 82.5754 24.3545 83.4599C25.6625 80.4202 28.35 74.2589 30.1574 70.5178C49.3856 74.7032 61.0746 64.1577 64.1069 60.9426C64.199 60.8427 64.2641 60.7217 64.2964 60.5906C64.3286 60.4595 64.3269 60.3226 64.2914 60.1924C64.2559 60.0621 64.1878 59.9427 64.0933 59.845C63.9987 59.7473 63.8808 59.6745 63.7503 59.6332C53.9757 56.4064 41.3708 58.8616 32.7377 65.2801C35.4846 59.8553 38.5764 54.1968 41.9535 48.5967C61.9784 51.2974 72.5854 39.6061 75.249 36.0988C75.3269 35.9924 75.3769 35.8686 75.3943 35.7386C75.4118 35.6086 75.3964 35.4764 75.3493 35.3537C75.3023 35.2311 75.225 35.1217 75.1245 35.0355C75.024 34.9492 74.9035 34.8888 74.7735 34.8595C65.4983 32.6499 54.3443 35.5259 46.3771 41.6404C48.684 38.1447 51.0979 34.7309 53.607 31.4924C60.2663 28.5969 66.0291 24.0227 70.312 18.2331C74.5948 12.4435 77.2457 5.64402 77.996 -1.47683C78.0097 -1.60825 77.9894 -1.74093 77.9369 -1.86256C77.8845 -1.98418 77.8016 -2.09079 77.6959 -2.17246C77.5903 -2.25413 77.4655 -2.30822 77.3329 -2.32968C77.2003 -2.35115 77.0643 -2.33928 76.9377 -2.29522C72.2168 -0.670136 54.2372 6.99931 50.6699 30.3818C49.338 32.1237 47.3046 34.9063 44.8074 38.6708C48.2559 24.6414 42.6908 14.774 40.6336 11.781C40.5622 11.6674 40.4625 11.5736 40.3438 11.5086C40.2252 11.4435 40.0917 11.4094 39.9558 11.4094C39.82 11.4094 39.6865 11.4435 39.5678 11.5086C39.4492 11.5736 39.3493 11.6674 39.2779 11.781C36.0471 17.1336 34.359 23.2499 34.3946 29.474C34.4302 35.6981 36.1882 41.7954 39.4801 47.1119C36.7451 51.6481 33.7485 56.9559 30.6806 63.0003C31.7865 46.5507 22.8205 37.4666 19.8953 34.9413C19.795 34.8558 19.6746 34.7962 19.545 34.768C19.4154 34.7398 19.2807 34.7439 19.1531 34.7799C19.0255 34.8159 18.9091 34.8827 18.8144 34.9742C18.7197 35.0656 18.6497 35.1789 18.6109 35.3038C17.2672 39.5126 13.6047 55.2841 27.5413 69.3136Z"
                    fill="#20589B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_673_981">
                    <rect width="78" height="78" rx="39" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              {isSequencer ? (
                <img className="s-34" src={getImageUrl('@/assets/images/_global/icon-success.svg')} />
              ) : (
                <img className="s-34" src={getImageUrl('@/assets/images/_global/icon-error.svg')} />
              )}

              <img className="s-78" src={getImageUrl('@/assets/images/token/metis-dark.svg')} />
            </div>

            <div className="flex flex-col gap-22 maxw-448 m-auto items-center">
              <div className="fz-28 fw-500 raleway align-center">
                {isSequencer ? 'You already have a Sequencer.' : 'You haven‘t applied for Sequencer yet'}
              </div>
              <div className="fz-18 fw-500 raleway  align-center">
                {isSequencer
                  ? 'Only one Sequencer can be created per account.'
                  : 'Please apply for permission to become a Sequencer. Waiting for the platform to agree before creating.'}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-10 w-full">
            <Button className="h-48 flex-1 fz-18 fw-500 poppins" type="metis-solid" onClick={setFalse}>
              Got it
            </Button>
            {isSequencer ? (
              <Button
                className="h-48 flex-1 fz-18 fw-500 poppins"
                type="metis"
                onClick={() => jumpSequencer(signerAddr as string)}
              >
                Check my Sequencer
              </Button>
            ) : (
              <Button
                className="h-48 flex-1 fz-18 fw-500 poppins"
                type="metis"
                onClick={() => {
                  jumpLink('https://forms.gle/uxYAieUuudBDWrzF6', '_blank');
                }}
              >
                Join the Waiting List
              </Button>
            )}
          </div>
        </div>
      </StyledModal>
    </>
  );
};

export default SequencerHeader;
