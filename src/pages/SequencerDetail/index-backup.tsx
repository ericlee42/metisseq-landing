import * as React from 'react';
import './index.scss';
import { styled } from 'styled-components';
import { filterHideText, getImageUrl } from '@/utils/tools';
import { Button, Pagination, Tooltip } from '@/components';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import CopyAddress from '@/components/CopyAddress';
import IncreaseModal from './components/IncreaseModal';
import UnlockModal from './components/UnlockModal';
import DetailModal from './components/DetailModal';
import WithdrawModal from './components/WithdrawModal';
import ClaimModal from './components/ClaimModal';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import { ethers } from 'ethers';
import useUpdate from '@/hooks/useUpdate';
import Loading from '@/components/_global/Loading';
import { useCountDown, useMount } from 'ahooks';
import { isDev } from '@/configs/common';

const testMode = true;

const Container = styled.section`
  .gap-260 {
    gap: 260px;
  }
  .gap-58 {
    gap: 58px;
  }
  .gap-48 {
    gap: 48px;
  }
  .gap-55 {
    gap: 55px;
  }

  .gap-32 {
    gap: 32px;
  }

  .gap-64 {
    gap: 64px;
  }

  .half-w {
    width: 50%;
  }

  .p-0-72 {
    padding: 0px 72px;
  }

  .w-40 {
    width: 40px;
  }
  .w-56 {
    width: 56px;
  }
  .w-62 {
    width: 62px;
  }
  .w-72 {
    width: 72px;
  }
  .w-46 {
    width: 46px;
  }
  .w-137 {
    width: 137px;
  }
  .w-155 {
    width: 155px;
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
    font-family: PingFangSC-Semibold, PingFang SC;
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

  .banner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    background: url(${getImageUrl('@/assets/images/_global/img_3@2x.png')}) no-repeat;
    background-size: cover;
    aspect-ratio: 1439 / 443;
    z-index: -1;
    max-height: 400px;
  }

  .content {
    padding-top: 20px;
    padding-bottom: 98px;
  }

  .avatar {
    width: 120px;
    height: 120px;
    background: #d0baf5;
    border-radius: 50%;
  }

  .status-label {
    width: 120px;
    height: 40px;
    /* background: #E5FBF9; */
    border-radius: 12px;
  }

  .status-overview {
    border-radius: 24px;
    display: inline-flex;
    width: fit-content;
    box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin: 0 auto 48px;
    .overview-item {
      /* &:first-of-type{
        border-top-left-radius: 24px;
        border-bottom-left-radius: 24px;
      }
      &:last-of-type{
        border-top-right-radius: 24px;
        border-bottom-right-radius: 24px;
      } */
      width: 330px;
      height: 120px;
      background: #ffffff;
      padding: 30px 0;
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
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #b71b13;
        line-height: 20px;
      }

      .f-12 {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
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
    width: 990px;
    margin-left: auto;
    margin-right: auto;
    .block-container {
      width: 990px;
      height: 392px;
      border: 1px solid #efefef;
    }

    table {
      border-collapse: separate;
      tr {
        height: 56px;
      }
      th,
      td {
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
    width: 990px;
    margin-left: auto;
    margin-right: auto;
    .block-container {
      width: 990px;
      height: 392px;
      border: 1px solid #efefef;
    }

    table {
      border-collapse: separate;
      tr {
        height: 56px;
      }
      th,
      td {
        vertical-align: middle;
        font-size: 14px;
        font-family: Poppins-Regular, Poppins;
        font-weight: 400;
        color: #313146;
        line-height: 21px;
      }
    }
  }
`;

export function Component() {
  const { id } = useParams();
  const navigate = useNavigate();

  const blocksCol = React.useMemo(() => {
    return [
      {
        lastSignedBlock: '#45,643',
        status: true,
        rewards: '0.2',
        symbol: 'METIS',
        timestamp: 1691313480,
      },
      {
        lastSignedBlock: '#45,643',
        status: false,
        rewards: '-',
        timestamp: 1691313480,
      },
      {
        lastSignedBlock: '#45,643',
        status: true,
        rewards: '0.2',
        symbol: 'METIS',
        timestamp: 1691313480,
      },
      {
        lastSignedBlock: '#45,643',
        status: true,
        rewards: '0.2',
        symbol: 'METIS',
        timestamp: 1691313480,
      },
      {
        lastSignedBlock: '#45,643',
        status: true,
        rewards: '0.2',
        symbol: 'METIS',
        timestamp: 1691313480,
      },
      {
        lastSignedBlock: '#45,643',
        status: true,
        rewards: '0.2',
        symbol: 'METIS',
        timestamp: 1691313480,
      },
    ];
  }, []);

  const [blocksCurrentPage, setBlocksCurrentPage] = React.useState(1);
  const blocksTotal = React.useMemo(() => blocksCol.length, []);
  const blocksPageSize = 1;

  // tx-history
  const txCol = React.useMemo(() => {
    return [
      {
        tx: '0x1a08c0736f2a8f064ce84dc0dc9559e80641ee34101cf02c34ad138874c7f0c5',
        address: '531dxxx223ffss',
        type: 'Unlock',
        amount: '21,212',
        symbol: 'METIS',
        timestamp: 1691313480,
      },
      {
        tx: '0x1a08c0736f2a8f064ce84dc0dc9559e80641ee34101cf02c34ad138874c7f0c5',
        address: '531dxxx223ffss',
        type: 'Claim',
        amount: '21,212',
        symbol: 'METIS',
        timestamp: 1691313480,
      },

      {
        tx: '0x1a08c0736f2a8f064ce84dc0dc9559e80641ee34101cf02c34ad138874c7f0c5',
        address: '531dxxx223ffss',
        type: 'Increase',
        amount: '21,212',
        symbol: 'METIS',
        timestamp: 1691313480,
      },
      {
        tx: '0x1a08c0736f2a8f064ce84dc0dc9559e80641ee34101cf02c34ad138874c7f0c5',
        address: '531dxxx223ffss',
        type: 'Unlock',
        amount: '21,212',
        symbol: 'METIS',
        timestamp: 1691313480,
      },
      {
        tx: '0x1a08c0736f2a8f064ce84dc0dc9559e80641ee34101cf02c34ad138874c7f0c5',
        address: '531dxxx223ffss',
        type: 'Unlock',
        amount: '21,212',
        symbol: 'METIS',
        timestamp: 1691313480,
      },
    ];
  }, []);

  const [txCurrentPage, setTxCurrentPage] = React.useState(1);
  const txTotal = React.useMemo(() => txCol.length, []);
  const txPageSize = 1;

  const [increaseVisible, setIncreaseVisible] = React.useState(false);
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [unlockVisible, setUnlockVisible] = React.useState(false);
  const [claimVisible, setClaimVisible] = React.useState(false);
  const [withdrawVisible, setWithdrawVisible] = React.useState(false);

  const { sequencerId } = useUpdate();

  const { run, cancel, data: sequencerInfo } = useSequencerInfo();

  const ifInUnlockProgress = sequencerInfo?.ifInUnlockProgress;

  const unlockTo = React.useMemo(
    () => dayjs.unix(sequencerInfo?.unlockClaimTime || 0).format('YYYY-MM-DD HH:mm:ss'),
    [sequencerInfo?.unlockClaimTime],
  );

  const [countdown, formattedRes] = useCountDown({
    targetDate: unlockTo,
  });

  const { days } = formattedRes;

  useMount(() => {
    if (!id) return;
    cancel();
    console.log('id', id);
    run({ sequencerId: id });
    return () => {
      cancel();
    };
  });

  const lockedup = React.useMemo(
    () => ethers.utils.formatEther(sequencerInfo?.sequencerLock || '0').toString(),
    [sequencerInfo?.sequencerLock],
  );

  const ifSelf = React.useMemo(() => {
    return sequencerId?.toString() === id?.toString();
  }, [sequencerId, id]);

  return (
    <Container className="pages-landing flex flex-col ">
      <div className="banner" />
      <div className="content flex flex-col items-center mb-16">
        <div className="avatar mb-24" />
        <div className="f-24-bold mb-16">Become a Sequencer</div>
        <div
          className="status-label f-14-bold flex items-center justify-center gap-8 mb-16"
          style={{
            background: sequencerInfo?.ifActive ? 'rgba(229, 251, 249, 1)' : 'rgba(210, 212, 227, 1)',
            color: sequencerInfo?.ifActive ? 'rgba(0, 210, 193, 1)' : 'rgba(49, 49, 70, 1)',
          }}
        >
          {!sequencerInfo ? (
            <Loading />
          ) : (
            <>
              <img
                style={{ width: '20px', height: '20px' }}
                src={getImageUrl('@/assets/images/_global/ic_Etherscan.svg')}
              />
              <span>{sequencerInfo?.ifActive ? 'Health' : 'Exiting'}</span>
            </>
          )}
        </div>
        <div className="mb-12 f-14">Sequencer description</div>
        <div className="mb-12 f-14">www.Sequencer.org</div>

        <div className="status-overview flex flex-row justify-center">
          <div className="overview-item flex flex-col items-center justify-center gap-10">
            <CopyAddress className={'f-18-bold'} />

            <div className="f-14">Owner</div>
          </div>
          <div className="overview-item flex flex-col items-center justify-center gap-10">
            <CopyAddress className={'f-18-bold'} />
            <div className="f-14">Signer</div>
          </div>
          <div className="overview-item flex flex-col items-center justify-center gap-10">
            <div className="flex items-center gap-8">
              <span className="f-18-bold">100%</span>
            </div>
            <div className="f-14">Blocks Signed</div>
          </div>
        </div>

        <div className="sc1 w-full">
          <div className="flex flex-row items-center justify-between  mb-24">
            <div className="f-20-bold">Mining Overview</div>
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
                    setDetailsVisible(true);
                  }}
                >
                  <div style={{ padding: '10px 16px' }}>Details</div>
                </Button>
                <Button
                  type="solid"
                  onClick={() => {
                    setUnlockVisible(true);
                  }}
                >
                  <div style={{ padding: '10px 16px' }}>Unlock</div>
                </Button>
                <Button
                  type="solid"
                  onClick={() => {
                    setClaimVisible(true);
                  }}
                >
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

          <div className="basic-card flex flex-row ptb-28 w-full">
            {/* Locked UP */}
            <div className="flex-1 flex flex-col items-center gap-20 ">
              <div className="flex flex-row items-center gap-6">
                <div className="f-14-bold">Locked UP</div>
                <Tooltip title={<span>Tooltip</span>}>
                  <img src={getImageUrl('@/assets/images/_global/ic_q.svg')} />
                </Tooltip>
              </div>
              <div className="f-18-bold">{lockedup} Metis</div>
            </div>

            {/* Current APR */}
            <div className="flex-1 flex flex-col items-center gap-20">
              <div className="flex flex-row items-center gap-6">
                <div className="f-14-bold">Current APR</div>
                <Tooltip title={<span>Tooltip</span>}>
                  <img src={getImageUrl('@/assets/images/_global/ic_q.svg')} />
                </Tooltip>
              </div>
              <div className="f-18-bold">18.13%</div>
            </div>

            {/* TOTAL REWARDS  */}
            <div className="flex-1 flex flex-col items-center gap-20">
              <div className="flex flex-row items-center gap-6">
                <div className="f-14-bold">TOTAL REWARDS</div>
                <Tooltip title={<span>Tooltip</span>}>
                  <img src={getImageUrl('@/assets/images/_global/ic_q.svg')} />
                </Tooltip>
              </div>
              <div className="f-18-bold">
                {lockedup} METIS + {sequencerInfo?.rewardReadable} METIS
              </div>
            </div>
          </div>
        </div>

        {ifSelf ? (
          <div className="sc0 w-full mt-32">
            <div className="b flex flex-col gap-32">
              <div className="f-20-bold">Claim Your Rewards</div>
              <div className="unclaimed-rewards-container flex flex-row w-full justify-between items-center">
                <div className="f-16-bold">Unclaimed Rewards {sequencerInfo?.rewardReadable} METIS</div>
                <Button type="metis">
                  <div style={{ padding: '14px 42px', color: '#000' }} className="f-14-bold">
                    Claim
                  </div>
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Blocks Signed */}
        <div className="sc2 w-full mt-48">
          <div className="f-20-bold mb-24">Blocks Signed(-/-)</div>
          <div className="block-container flex flex-row ptb-28 w-full">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Latest Block Slgned</th>
                  <th>Status</th>
                  <th>Rewards</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {blocksCol?.map((i, index) => (
                  <tr key={index}>
                    <td className="align-center">{i.lastSignedBlock}</td>
                    <td className="align-center">
                      <span className={i.status ? 'success-color' : 'danger-color' + ' align-center'}>
                        {i.status ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="align-center">
                      {i.rewards} {i.symbol}
                    </td>
                    <td className="align-center">{dayjs.unix(i.timestamp).format('DD/MM/YYYY HH:mm:ss')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination flex flex-row items-center justify-center mt-24" style={{ height: '32px' }}>
            <Pagination
              current={blocksCurrentPage}
              total={blocksTotal}
              pageSize={blocksPageSize}
              onChange={(v) => setBlocksCurrentPage(v)}
            />
          </div>
        </div>

        {/* Transaction history */}
        <div className="sc3 w-full mt-48">
          <div className="f-20-bold mb-24">Transaction History</div>
          <div className="block-container flex flex-row ptb-28 w-full">
            <table className="w-full">
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
                {txCol.map((i, index) => (
                  <tr key={index}>
                    <td className="align-center underlined pointer">{filterHideText(i.tx, 8)}</td>
                    <td className="align-center">{filterHideText(i.address, 6, 4)}</td>
                    <td className="align-center">{i.type}</td>
                    <td className="align-center">
                      {i.amount} {i.symbol}
                    </td>
                    <td className="align-center">{dayjs.unix(i.timestamp).format('DD/MM/YYYY HH:mm:ss')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination flex flex-row items-center justify-center mt-24" style={{ height: '32px' }}>
            <Pagination
              current={txCurrentPage}
              total={txTotal}
              pageSize={txPageSize}
              onChange={(v) => setTxCurrentPage(v)}
            />
          </div>
        </div>
      </div>

      {/* modals */}
      <>
        <IncreaseModal
          visible={ifSelf && increaseVisible}
          onClose={() => {
            setIncreaseVisible(false);
          }}
        />

        <UnlockModal
          visible={ifSelf && unlockVisible}
          onClose={() => {
            setUnlockVisible(false);
          }}
        />

        <DetailModal
          visible={ifSelf && detailsVisible}
          onClose={() => {
            setDetailsVisible(false);
          }}
        />

        <WithdrawModal
          visible={ifSelf && withdrawVisible}
          onClose={() => {
            setWithdrawVisible(false);
          }}
        />

        <ClaimModal
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
