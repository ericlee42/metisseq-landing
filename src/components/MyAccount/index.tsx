import { styled } from 'styled-components';
import { Button, Modal } from '..';
import { filterHideText, getImageUrl, jumpLink } from '@/utils/tools';
import React, { useEffect, useMemo, useState } from 'react';
import CopyAddress from '../CopyAddress';
import useAuth from '@/hooks/useAuth';
import useBalance from '@/hooks/useBalance';
import { generateAvatar } from '@/utils/jazzIcon';
import { ethers } from 'ethers';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import BigNumber from 'bignumber.js';
import useUpdate from '@/hooks/useUpdate';
import { useRequest } from 'ahooks';
import fetchUserTx from '@/graphql/tx';
import ClaimModal from '@/pages/SequencerDetail/components/ClaimModal';
import { useNavigate } from 'react-router-dom';
import { defaultChainId, explorer, explorerName, l2explorer } from '@/configs/common';

const Container = styled(Modal)`
  .inside {
    border-radius: 10px;
    background: #f1f1f1;
    .basic-card {
      border-radius: 10px;
      background: #fff;
      padding: 15px 20px;
    }

    .p-14-45 {
      padding: 14px 45px;
    }

    .f-14-bold {
      font-size: 14px;
      font-family: Poppins-Bold, Poppins;
      font-weight: bold;
      color: #333347;
      line-height: 21px;
    }
    .avatar {
      width: 32px;
      height: 32px;
      background: #d8d8d8;
      border-radius: 50%;
    }
    .f-12 {
      font-size: 12px;
      font-family: Poppins-Regular, Poppins;
      font-weight: 400;
      color: #333347;
      line-height: 18px;
    }

    .header {
      display: flex;
      justify-content: flex-start;
      position: relative;

      .title {
        color: #000;

        font-family: Raleway;
        font-size: 32px;
        font-style: normal;
        font-weight: 700;
        line-height: 70px; /* 218.75% */
      }
      .close {
        position: absolute;
        right: 24px;
        width: 24px;
        height: 24px;
      }
    }
    .content {
      padding: 0 30px 30px;
    }

    .connected {
      .component-button {
        width: 74px;
        height: 32px;
        background: rgba(0, 218, 203, 0.2);
        border-radius: 8px;
        span {
          color: rgba(0, 218, 203, 1);
        }
      }
    }

    .cards {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
      width: 440px;

      .f-12 {
        font-size: 12px;
        font-family: Poppins-Regular, Poppins;
        font-weight: 400;
        color: #333347;
        line-height: 18px;
      }

      .f-14-bold {
        font-size: 14px;
        font-family: Poppins-SemiBold, Poppins;
        font-weight: 600;
        color: #333347;
        line-height: 21px;
      }

      .f-14 {
        font-size: 14px;
        font-family: Poppins-Regular, Poppins;
        font-weight: 400;
        color: #00dacb;
        line-height: 21px;
      }

      .card-item {
        position: relative;
        flex: 1;
        min-width: 180px;
        height: 120px;
        background: #f8f8f8;
        border-radius: 8px;

        .claimable {
          position: absolute;
          bottom: 0;
          background: rgba(0, 218, 203, 0.1);
          border-radius: 0px 0px 8px 8px;
          padding: 9px 0;
        }
      }
    }
  }
`;

const MyAccount = ({
  visible,
  onClose,
  onOk,
  claimable,
}: {
  visible: boolean;
  onClose?: any;
  onOk?: any;
  claimable?: boolean;
}) => {
  const { address, chainId, disconnect } = useAuth();
  const { sequencerId, whiteListed } = useUpdate();
  const { balance } = useBalance();

  const { run, data } = useRequest(fetchUserTx, { manual: true });

  useEffect(() => {
    if (sequencerId && address && chainId) {
      run(address, +chainId);
    }
  }, [address, chainId, sequencerId]);

  const [claimVisible, setClaimVisible] = useState(false);

  // const [checkSequencerVisible, setCheckSequencerVisible] = React.useState(false);
  // const handleClose = () => {
  //   setCheckSequencerVisible(false);
  // };
  // const handleOk = () => {
  //   setCheckSequencerVisible(true);
  // };
  // const handleShow = () => {
  //   setCheckSequencerVisible(true);
  // };

  const { sequencerInfo } = useSequencerInfo();

  const unclaimedAmount = useMemo(() => {
    return ethers.utils.formatEther(sequencerInfo?.reward || '0').toString();
  }, [sequencerInfo?.reward]);

  const claimedAmount = useMemo(() => {
    return data?.histories
      ?.filter((i) => i.action === 'Claim')
      ?.reduce((prev, next) => {
        return BigNumber(prev).plus(BigNumber(next?.amount).div(1e18)).toString();
      }, 0);
  }, [data?.histories]);

  const lockedup = React.useMemo(
    () => ethers.utils.formatEther(sequencerInfo?.sequencerLock || '0').toString(),
    [sequencerInfo?.sequencerLock],
  );
  const totalRewards = React.useMemo(
    () =>
      BigNumber(unclaimedAmount || '0')
        .plus(claimedAmount || '0')
        .toString(),
    [claimedAmount, unclaimedAmount],
  );

  const handleShowClaim = () => {
    if (BigNumber(unclaimedAmount).lte(0) || BigNumber(unclaimedAmount).isNaN()) return;
    setClaimVisible(true);
  };

  const handleDisconnect = () => {
    disconnect();
    setTimeout(() => {
      onClose?.();
    }, 1000);
    window.location.reload();
  };

  const navigate = useNavigate();
  const handleJumpStatus = () => {
    if (sequencerId) {
      navigate(`/sequencers/${address}`);
      onClose?.();
      return;
    }
    if (whiteListed) {
      navigate('/becomeSequencer');
      onClose?.();
      return;
    }
    jumpLink('https://forms.gle/uxYAieUuudBDWrzF6', '_blank');
    return;
  };

  return (
    <>
      <Container visible={visible} onClose={onClose} onOk={onOk} title="My Account">
        <div className="flex flex-col gap-10">
          <div className="basic-card flex flex-col gap-16">
            <div className="flex flex-col gap-6">
              <span>Connected with MetaMask</span>
              <div className="flex flex-row items-center justify-between">
                {address ? (
                  <div className="flex flex-row items-center gap-10">
                    <img className="radiusp-50 s-38" src={generateAvatar(address || '', 200)} />
                    <span className="fz-18 fw-400 color-000">{filterHideText(address || '', 6)}</span>
                  </div>
                ) : null}

                <Button className="w-107 h-36" type="metis" onClick={handleDisconnect}>
                  <div className="fz-14 fw-500 color-fff">Change</div>
                </Button>
              </div>
            </div>

            <div>
              <div className="flex flex-row items-cneter gap-20">
                {/* copy */}
                <CopyAddress
                  hide={false}
                  // addr="Copy Address"
                  className={'fz-12 fw-400 color-8E8E8E poppins'}
                  reverse
                  copyTrigger={
                    <div className="flex flex-row gap-6 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <g clipPath="url(#clip0_674_1240)">
                          <path
                            d="M11.0171 5.60962H6.22186C5.63334 5.60962 5.15625 6.08671 5.15625 6.67523V11.4705C5.15625 12.059 5.63334 12.5361 6.22186 12.5361H11.0171C11.6056 12.5361 12.0827 12.059 12.0827 11.4705V6.67523C12.0827 6.08671 11.6056 5.60962 11.0171 5.60962Z"
                            stroke="#8E8E8E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.02517 8.8066H2.49237C2.20975 8.8066 1.93871 8.69433 1.73887 8.49449C1.53903 8.29465 1.42676 8.0236 1.42676 7.74099V2.94574C1.42676 2.66312 1.53903 2.39208 1.73887 2.19224C1.93871 1.9924 2.20975 1.88013 2.49237 1.88013H7.28762C7.57024 1.88013 7.84128 1.9924 8.04112 2.19224C8.24096 2.39208 8.35323 2.66312 8.35323 2.94574V3.47854"
                            stroke="#8E8E8E"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_674_1240">
                            <rect
                              width="12.7873"
                              height="12.7873"
                              fill="white"
                              transform="translate(0.361328 0.814453)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="fz-12 fw-400 color-8E8E8E poppins">Copy Address</span>
                    </div>
                  }
                />

                {/* Etherscan */}
                <div
                  className="copy flex flex-row items-center gap-6 pointer"
                  onClick={() => {
                    if (!chainId) return;
                    jumpLink(`${explorer[chainId]}/address/${address}`, '_blank');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <g clipPath="url(#clip0_674_1246)">
                      <path
                        d="M9.8911 8.30103L9.8911 11.5798C9.8911 11.9277 9.75292 12.2613 9.50696 12.5072C9.261 12.7532 8.92741 12.8914 8.57958 12.8914L2.67773 12.8914C2.3299 12.8914 1.9963 12.7532 1.75035 12.5072C1.50439 12.2613 1.36621 11.9277 1.36621 11.5798L1.36621 5.67799C1.36621 5.33016 1.50439 4.99657 1.75035 4.75061C1.9963 4.50465 2.32989 4.36647 2.67773 4.36647L5.95653 4.36647"
                        stroke="#8E8E8E"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M4.91895 9.33926L10.6022 3.65601" stroke="#8E8E8E" strokeLinecap="round" />
                      <path d="M7.76074 2.94556H11.3128V6.49759" stroke="#8E8E8E" strokeLinecap="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_674_1246">
                        <rect width="12.7873" height="12.7873" fill="white" transform="translate(0.65625 0.814453)" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="fz-12 fw-400 color-8E8E8E poppins">{explorerName[chainId || defaultChainId]}</span>
                </div>

                {/* Andromeda-explore */}
                <div
                  className="copy flex flex-row items-center gap-6 pointer"
                  onClick={() => {
                    if (!chainId) return;
                    jumpLink(`${l2explorer[chainId]}/address/${address}`, '_blank');
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <g clipPath="url(#clip0_674_1246)">
                      <path
                        d="M9.8911 8.30103L9.8911 11.5798C9.8911 11.9277 9.75292 12.2613 9.50696 12.5072C9.261 12.7532 8.92741 12.8914 8.57958 12.8914L2.67773 12.8914C2.3299 12.8914 1.9963 12.7532 1.75035 12.5072C1.50439 12.2613 1.36621 11.9277 1.36621 11.5798L1.36621 5.67799C1.36621 5.33016 1.50439 4.99657 1.75035 4.75061C1.9963 4.50465 2.32989 4.36647 2.67773 4.36647L5.95653 4.36647"
                        stroke="#8E8E8E"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M4.91895 9.33926L10.6022 3.65601" stroke="#8E8E8E" strokeLinecap="round" />
                      <path d="M7.76074 2.94556H11.3128V6.49759" stroke="#8E8E8E" strokeLinecap="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_674_1246">
                        <rect width="12.7873" height="12.7873" fill="white" transform="translate(0.65625 0.814453)" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="fz-12 fw-400 color-8E8E8E poppins">Metis Explorer</span>
                </div>
              </div>
            </div>
          </div>

          {/* balances */}
          <div className="basic-card pl-10 pr-10">
            <div
              className="flex flex-col gap-5 pb-14 pt-14 pl-10 pr-10"
              style={true ? {} : { borderTop: '1px solid #CDCDCD' }}
            >
              <div className="fz-14 fw-400 color-000 poppins">Balance on L1</div>
              <div className="flex flex-row items-center gap-8">
                <img className="s-15" style={{ height: '22px', width: '23px' }} src={getImageUrl('@/assets/images/token/metis-dark.svg')} />
                <div className="fz-18 fw-400 color-000 poppins">{balance?.readable || 0} METIS</div>
              </div>
            </div>

            {sequencerId ? (
              <>
                <div
                  className="flex flex-col gap-5 pb-14 pt-14 pl-10 pr-10"
                  style={false ? {} : { borderTop: '1px solid #CDCDCD' }}
                >
                  <div className="fz-14 fw-400 color-000 poppins">Locked-Up</div>
                  <div className="flex flex-row items-center gap-8">
                    <img className="s-15" style={{ height: '22px', width: '23px' }} src={getImageUrl('@/assets/images/token/metis-dark.svg')} />
                    <div className="fz-18 fw-400 color-000 poppins">{lockedup || 0} METIS</div>
                  </div>
                </div>

                <div
                  className="flex flex-col gap-5 pb-14 pt-14 pl-10 pr-10"
                  style={false ? {} : { borderTop: '1px solid #CDCDCD' }}
                >
                  <div className="fz-14 fw-400 color-000 poppins">Total Rewards</div>
                  <div className="flex flex-row items-center gap-8">
                    <img className="s-15" style={{ height: '22px', width: '23px' }} src={getImageUrl('@/assets/images/token/metis-dark.svg')} />
                    <div className="fz-18 fw-400 color-000 poppins">{totalRewards || 0} METIS</div>
                  </div>
                </div>

                <div className="bg-color-F1F1F1 mt-27  pb-14 pt-14 pl-10 pr-10 radius-10 flex flex-row items-center justify-between">
                  <div className="flex flex-col gap-5">
                    <div className="fz-14 fw-400 color-000 poppins">Unclaimed Rewards</div>
                    <div className="flex flex-row items-center gap-8">
                      <img className="s-15" style={{ height: '22px', width: '23px' }} src={getImageUrl('@/assets/images/token/metis-dark.svg')} />
                      <div className="fz-18 fw-400 color-000 poppins">{unclaimedAmount || 0} METIS</div>
                    </div>
                  </div>
                  <Button
                    onClick={handleShowClaim}
                    type="metis"
                    className="w-107 h-36"
                    disabled={BigNumber(unclaimedAmount).lte(0)}
                  >
                    <div className="fz-14 fw-500">Claim</div>
                  </Button>
                </div>
              </>
            ) : null}
          </div>

          <Button type="metis" onClick={handleJumpStatus} className="w-full">
            <div className=" h-52 flex flex-row items-center justify-center">
              {sequencerId ? 'Check my Sequencer' : whiteListed ? 'Become a Sequencer' : 'Join the Waitlist'}
            </div>
          </Button>

          {/* <div className="flex flex-col lgap-24 items-center">
            <div className="cards">
              <div className="card-item flex flex-col gap-12 items-center justify-center">
                <span className="f-12" style={{ marginTop: "-18px" }}>
                  Wallet Balance
                </span>
                <span className="f-14-bold">{balance?.readable} metis</span>
                {claimable ? (
                  <div className="claimable f-14 w-full flex flex-row items-center justify-center pointer">
                    Claim
                  </div>
                ) : null}
              </div>
              <div className="card-item flex flex-col gap-12 items-center justify-center">
                <span className="f-12" style={{ marginTop: "-18px" }}>
                  Wallet Balance
                </span>
                <span className="f-14-bold">{balance?.readable} metis</span>
                {claimable ? (
                  <div className="claimable f-14 w-full flex flex-row items-center justify-center pointer">
                    Claim
                  </div>
                ) : null}
              </div>
              <div className="card-item flex flex-col gap-12 items-center justify-center">
                <span className="f-12" style={{ marginTop: "-18px" }}>
                  Wallet Balance
                </span>
                <span className="f-14-bold">{balance?.readable} metis</span>
                {claimable ? (
                  <div className="claimable f-14 w-full flex flex-row items-center justify-center pointer">
                    Claim
                  </div>
                ) : null}
              </div>
            </div>
            <Button type="metis" onClick={handleShow}>
              <div className="p-14-45 f-14-bold">Check My Sequencer</div>
            </Button>
          </div> */}
        </div>
      </Container>

      {/* <CheckSequencer
        invalid={Math.random() > 0.5}
        visible={checkSequencerVisible}
        onClose={handleClose}
        onOk={handleOk}
      /> */}

      <ClaimModal
        visible={claimVisible}
        onClose={() => {
          setClaimVisible(false);
        }}
      />
    </>
  );
};
export default MyAccount;
