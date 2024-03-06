/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import * as React from 'react';
import './index.scss';
import { styled } from 'styled-components';
import { catchError, getImageUrl, jumpLink as jumpOuterLink } from '@/utils/tools';
import { useNavigate } from 'react-router-dom';
import Progress from '@/components/Progress';
import { Button, Input, message } from '@/components';
import CopyAddress from '@/components/CopyAddress';
import useBalance from '@/hooks/useBalance';
import useAllowance from '@/hooks/useAllowance';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useBoolean } from 'ahooks';
import useLock from '@/hooks/useLock';
import useAuth from '@/hooks/useAuth';
import { Address } from 'wagmi';
import { defaultExpectedApr, isProd } from '@/configs/common';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useDevice from '@/hooks/useDevice';
import { checksumAddress } from 'viem';

const Container = styled.section`
  background: url(${getImageUrl('@/assets/images/_global/sub_section_bg.png')}) no-repeat;
  background-size: cover;

  &.mobile {
    .progress-bar {
      width: 100%;
    }
    .whiteSpace-nowrap {
      white-space: break-spaces;
    }
  }

  .half-w {
    width: 50%;
  }

  .p-0-72 {
    padding: 0px 72px;
  }

  .f-12 {
    font-size: 12px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #333347;
    line-height: 18px;
  }

  .f-20-bold {
    font-size: 20px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: #313146;
    line-height: 30px;
  }

  .f-16-bold {
    font-size: 16px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: #333347;
    line-height: 25px;
  }

  .f-28-bold {
    font-size: 28px;
    font-family: Poppins-ExtraBold, Poppins;
    font-weight: 800;
    color: #313146;
    line-height: 42px;
  }

  .f-16 {
    font-size: 16px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #333347;
    line-height: 25px;
  }

  .f-14 {
    font-size: 14px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #313146;
    line-height: 21px;
  }

  .mb-8 {
    margin-bottom: 8px;
  }
  .mb-24 {
    margin-bottom: 24px;
  }
  .mb-48 {
    margin-bottom: 48px;
  }

  .link-color {
    color: rgba(52, 109, 248, 1);
  }

  .f-20-bold {
    font-size: 20px;
    font-family: Poppins-ExtraBold, Poppins;
    font-weight: 800;
    color: #313146;
    line-height: 30px;
  }

  .avatar {
    width: 64px;
    height: 64px;
    background: #d8d8d8;
    border-radius: 50%;
  }

  .cards-container {
    border-radius: 30px;
    border: 2px solid var(--line-glass, rgba(255, 255, 255, 0.1));
    background: var(--gradient-glass, linear-gradient(91deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.15) 100%));
    /* glass */
    backdrop-filter: blur(30px);
    .card {
    }
  }
`;

export function Component() {
  const { allSequencerInfo } = useSequencerInfo();

  console.log('allSequencerInfo', allSequencerInfo);

  const [avatar, setAvatar] = React.useState<undefined | string>();
  const [name, setName] = React.useState<undefined | string>();
  const [website, setWebsite] = React.useState<undefined | string>();
  const [account, setAccount] = React.useState<undefined | string>();
  const [pubKey, setPubKey] = React.useState<undefined | string>();
  const [desc, setDesc] = React.useState<undefined | string>();

  const formattedPubKey = React.useMemo(() => {
    if (pubKey?.startsWith('0x04')) {
      return pubKey?.replace('0x04', '0x');
    }
    return pubKey;
  }, [pubKey]);

  const [stakeAmount, setStakeAmount] = React.useState('');
  const [apr, setApr] = React.useState<undefined | string>();

  const handleChangeApr = (v: string) => {
    setApr(v);
  };
  const handleLockupChange = (v: string) => {
    setStakeAmount(v);
    handleChangeApr(BigNumber(v).multipliedBy(defaultExpectedApr).toString());
  };

  const navigate = useNavigate();

  const { address, connector } = useAuth();

  const { balance } = useBalance();

  const { lockFor } = useLock();

  const { allowance, approve } = useAllowance();
  const [approveLoading, { setTrue: setApproveLoadingTrue, setFalse: setApproveLoadingFalse }] = useBoolean(false);

  const needApprove = React.useMemo(
    () => BigNumber(allowance || '0').lte(ethers.utils.parseEther(stakeAmount || '0').toString()),
    [allowance, stakeAmount],
  );

  const handleLockup = async () => {
    try {
      const curSeq = allSequencerInfo?.[address?.toLowerCase() as string];
      if (!curSeq) throw { message: 'Please submit your sequencer information on Github' };
      if (!allowance || needApprove) {
        setApproveLoadingTrue();
        await approve();
        setApproveLoadingFalse();
        return;
      }

      setApproveLoadingTrue();

      const p = {
        address: checksumAddress(curSeq?.seq_addr) as Address,
        amount: ethers.utils.parseEther(stakeAmount || '0').toString(),
        pubKey: curSeq?.pubkey as string,
      };
      console.log('p', p, allowance, needApprove);
      await lockFor(p);
      setApproveLoadingFalse();

      handleIndex('3');
    } catch (e) {
      console.log(e);
      message.error(catchError(e));
      setApproveLoadingFalse();
    }
  };

  const jumpLink = () => {
    navigate('/sequencers');
  };

  const col = [
    {
      index: '1',
      content: 'Setup Sequencer',
    },
    {
      index: '2',
      content: 'Lock Metis',
    },
    {
      index: '3',
      content: 'Completed',
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState('1');

  const handleIndex = (index: string) => {
    setActiveIndex(index);
  };

  const validStep2 = React.useMemo(
    () => name && website && account && formattedPubKey,
    [name, website, account, formattedPubKey],
  );

  const { ifMobile } = useDevice();

  const step = React.useMemo(() => {
    switch (activeIndex) {
      case '1':
        return (
          <div className="flex flex-col gap-32">
            <div className="flex flex-col gap-20">
              <div
                onClick={() => jumpOuterLink('https://github.com/MetisProtocol/mvm-sequencer-node', '_blank')}
                className={`pointer radius-30 flex flex-col gap-10 ${ifMobile ? 'p-15 pl-25 pr-25' : 'p-50'}`}
                style={{
                  background:
                    'var(--gradient-glass, linear-gradient(91deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.15) 100%))',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  backdropFilter: 'blur(30px)',
                  overflow: 'hidden',
                }}
              >
                <span className={`${ifMobile ? 'fz-27' : 'fz-36'} fw-700 color-fff raleway`}>Docker</span>
                <span className={`${ifMobile ? 'fz-14' : 'fz-26'} fw-500 color-fff raleway`}>
                  Set up Sequencer via Docker
                </span>
              </div>
              {/*
              <div
                className="radius-30 flex flex-col gap-10 p-50"
                style={{
                  background:
                    'var(--gradient-glass, linear-gradient(91deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.15) 100%))',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  backdropFilter: 'blur(30px)',
                  overflow: 'hidden',
                }}
              >
                <span className="fz-36 fw-700 color-fff raleway">Binaries</span>
                <span className="fz-26 fw-500 color-fff raleway">
                  Build from source to set up your Sequencer
                </span>
              </div> */}

              <div className="flex flex-row items-center justify-center">
                <Button
                  type="metis"
                  onClick={() => handleIndex('2')}
                  className={`${ifMobile ? 'h-60 radius-20' : ' h-80 radius-30'} w-full `}
                >
                  <div className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway color-fff`}>CONTINUE</div>
                </Button>
              </div>
            </div>
            <div className="fz-18 fw-500 color-fff raleway">
              You have questions? Make sure to read our{' '}
              <a className="fz-18 fw-700 color-fff underlined" href="https://github.com/MetisProtocol/mvm-testnet-sequencer-node/blob/main/README.md" target="_blank">
                Dev Docs
              </a>
              <br />
              or contact us through via{' '}
              <a className="fz-18 fw-700 color-fff underlined" href="mailto:sequencer@metis.io" target="_blank">
                sequencer@metis.io
              </a>
              {/* <a
                className="fz-18 fw-700 color-fff underlined"
                href=""
                target="_blank"
              >
                Telegram Discord
              </a> */}
              .
            </div>
          </div>
        );

      case '2':
        return (
          <div className="flex flex-col gap-32">
            <div
              className={`${ifMobile ? 'pb-66' : 'pb-16'
                } pt-66  pl-38 pr-38 flex flex-col items-center gap-73 cards-container`}
            >
              <div className={`flex flex-col gap-25 ${ifMobile ? 'minwp-100 w-full' : 'minw-620'}`}>
                <div className={`flex ${ifMobile ? 'flex-col' : 'flex-row'} gap-20`}>
                  {/* name */}
                  <div className="flex-1 flex flex-col gap-6" style={ifMobile ? {} : { minWidth: 'calc(50% - 56px)' }}>
                    <div className="fz-14 fw-400 color-fff inter">Lockup</div>
                    <Input
                      max={BigNumber(balance?.readable).toString()}
                      value={stakeAmount}
                      onChange={handleLockupChange}
                      solidLight
                      className="flex-3 fz-22 fw-400 color-000"
                      suffix={<img className="s-22" src={getImageUrl('@/assets/images/token/metis.svg')} />}
                    />
                  </div>

                  {/* website */}
                  <div className="flex-1 flex flex-col gap-6" style={ifMobile ? {} : { minWidth: 'calc(50% - 56px)' }}>
                    <div className="fz-14 fw-400 color-fff inter">Expected MMR</div>
                    <Input
                      disabled
                      value={apr}
                      onChange={handleChangeApr}
                      solidLight
                      className="flex-3 fz-22 fw-400 color-000"
                      suffix={<img className="s-22" src={getImageUrl('@/assets/images/token/metis.svg')} />}
                    />
                  </div>
                </div>

                {/* desc */}
                <div className="flex flex-col gap-10">
                  <div className="flex flex-row items-center gap-19">
                    <div className="w-158 fz-14 fw-400 inter color-fff">Your Balance</div>
                    <div className="w-155 nowrap align-left fz-14 fw-700 inter color-fff">
                      {balance?.readable} METIS
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-19">
                    <div className="w-158 fz-14 fw-400 inter color-fff">Wallet Address</div>
                    <CopyAddress className="align-right fz-14 fw-700 inter color-fff" reverse addr={address} />
                  </div>
                </div>
              </div>

              <div className="fz-18 fw-400 inter color-fff self-start">
                In order to become a Sequencer you need to lock up min. 20,000 METIS.
                <br />
                The more you lock up the higher reward you can receive.
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-10">
              <Button
                type="solid"
                onClick={() => handleIndex('1')}
                className={`${ifMobile ? 'h-60 radius-20' : ' h-80 radius-30'} w-full `}
                style={{ border: '2px solid #FFF' }}
              >
                <div className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway color-fff`}>BACK</div>
              </Button>

              <Button
                loading={approveLoading}
                disabled={!stakeAmount || BigNumber(stakeAmount).lt(isProd ? 20000 : 0)}
                type="metis"
                onClick={handleLockup}
                className={`${ifMobile ? 'h-60 radius-20' : ' h-80 radius-30'} w-full `}
              >
                <div className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway color-fff`}>
                  {needApprove ? 'APPROVE' : 'CONTINUE'}
                </div>
              </Button>
            </div>
          </div>
        );

      case '3':
        return (
          <div className="flex flex-col gap-32">
            <div
              className={`${ifMobile ? 'p-38 pl-20 pr-20' : ' pt-70 pb-34 pl-124 pr-124'
                } flex flex-col items-center gap-26 cards-container`}
            >
              <img
                className={`${ifMobile ? 's-120' : 's-180'}`}
                src={getImageUrl('@/assets/images/token/metis-dark.svg')}
              />
              <div className="color-fff flex flex-col gap-6 justify-center">
                <span className={`${ifMobile ? 'fz-31' : 'fz-46'} fw-700 raleway align-center`}>Congraturations!</span>
                <span className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway align-center`}>
                  METIS locked! Please proceed with sequencer setup.
                </span>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-10">
              <Button
                type="metis"
                onClick={() => {
                  navigate('/');
                }}
                className={`${ifMobile ? 'h-60 radius-20' : ' h-80 radius-30'} w-full `}
              >
                <div className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway color-fff`}>Close</div>
              </Button>
            </div>
          </div>
        );
    }
  }, [
    activeIndex,
    name,
    website,
    account,
    pubKey,
    formattedPubKey,
    desc,
    validStep2,
    balance?.readable,
    stakeAmount,
    handleLockupChange,
    apr,
    address,
    approveLoading,
    handleLockup,
    needApprove,
    navigate,
  ]);

  return (
    <Container
      className={`pages-landing flex flex-col gap-48 items-center ${ifMobile ? 'mobile pt-45 pb-156' : 'pt-156 pb-206'
        }`}
    >
      <div className={`${ifMobile ? 'wvw-100 maxwp-100 pl-22 pr-22' : 'maxw-1440'} m-auto`}>
        <div className="flex flex-col gap-2">
          {ifMobile ? null : <span className="fz-26 fw-700 color-fff raleway">Set Up</span>}
          <span className={`${ifMobile ? 'fz-22' : 'fz-56'} fw-700 color-fff raleway`}>Set Up a Sequencer</span>
        </div>
        <div className="w-full " style={ifMobile ? { overflow: 'auto' } : {}}>
          <Progress needIndex={false} activeIndex={activeIndex} col={col} />
        </div>
        <div className="mt-42">{step}</div>
      </div>
    </Container>
  );
}

Component.displayName = 'BecomeSequencer';
