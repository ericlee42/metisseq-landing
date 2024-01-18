/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import * as React from 'react';
import './index.scss';
import { styled } from 'styled-components';
import { catchError, getImageUrl } from '@/utils/tools';
import { useNavigate } from 'react-router-dom';
import Progress from '@/components/Progress';
import { Button, Input } from '@/components';
import CopyAddress from '@/components/CopyAddress';
import useBalance from '@/hooks/useBalance';
import useAllowance from '@/hooks/useAllowance';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { useBoolean } from 'ahooks';
import useLock from '@/hooks/useLock';
import useAuth from '@/hooks/useAuth';
import { Address } from 'wagmi';
import { defaultExpectedApr, defaultPubKeyList, isDev } from '@/configs/common';
import { createUser, updateUser } from '@/services';
import { Uploader } from 'uploader'; // Installed by "react-uploader".
import { UploadButton } from 'react-uploader';
import Loading from '@/components/_global/Loading';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useDevice from '@/hooks/useDevice';

const uploader = Uploader({
  apiKey: 'free', // Get production API keys from Bytescale
});

const Container = styled.section`
  background: url(${getImageUrl('@/assets/images/_global/sub_section_bg.png')}) no-repeat;
  background-size: cover;

  &.mobile{
    .progress-bar{
      width: 100%;
    }
    .whiteSpace-nowrap{
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

const message = 'test';

export function Component() {
  const { allSequencerInfo } = useSequencerInfo();
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

  const { address, connector } = useAuth(true);

  const { balance } = useBalance();

  const { lockFor } = useLock();

  const { allowance, approve } = useAllowance();
  const [approveLoading, { setTrue: setApproveLoadingTrue, setFalse: setApproveLoadingFalse }] = useBoolean(false);

  const needApprove = React.useMemo(
    () => BigNumber(allowance || '0').lte(ethers.utils.parseEther(stakeAmount || '0').toString()),
    [allowance, stakeAmount],
  );

  const handleApprove = async () => {
    const res = await approve();
  };

  const handleLockup = async () => {
    try {
      if (!allowance || needApprove) {
        setApproveLoadingTrue();
        await handleApprove();
        setApproveLoadingFalse();
        return;
      }

      setApproveLoadingTrue();

      // const signature = await signMessageAsync();

      // console.log('message, signature', message, signature)
      // const pubKey = ethers.utils.recoverPublicKey(ethers.utils.toUtf8Bytes(message), signature);

      // console.log('pubKey', pubKey)
      const p = {
        address: account as Address,
        amount: ethers.utils.parseEther(stakeAmount || '0').toString(),
        pubKey: formattedPubKey as string,
      };
      console.log('p', p, allowance, needApprove);
      await lockFor(p);
      setApproveLoadingFalse();

      handleIndex('4');
    } catch (e) {
      console.log(e);
      catchError(e);
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
      content: 'Sequencer details',
    },
    {
      index: '3',
      content: 'Lock Metis',
    },
    {
      index: '4',
      content: 'Completed',
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState('1');

  const handleIndex = (index: string) => {
    setActiveIndex(index);
  };

  // const [testPubKey, setTestPubKey] = React.useState<undefined | string>()
  const handleSignAndRecover = async () => {
    const t = defaultPubKeyList.find((i) => i.address.toLowerCase() === address?.toLowerCase());

    setPubKey(t?.pubKey);
    // setPubKey(undefined)
    // const message = 'hello world'
    // const signer = await connector?.getWalletClient();
    // const signature = await signer?.signMessage({
    //   account: address,
    //   message: message,
    // })
    // if (!signature) return;
    // const publicKey = await recoverPublicKey({
    //   hash: hashMessage(message),
    //   signature
    // })

    // console.log('publicKey', publicKey)
    // setPubKey(publicKey)
  };

  const [uploadloading, setUploadingLoading] = React.useState(false);

  const handleUpload = async () => {
    const params = {
      name,
      avatar,
      desc,
      address: account,
      pubKey: formattedPubKey,
      url: website,
      walletAddress: address,
      // media,
    };
    if (!params?.walletAddress || !params?.name) return;

    const ifAlreadyUploaded = allSequencerInfo?.[params?.walletAddress?.toLowerCase()];

    setUploadingLoading(true);
    try {
      let res;
      if (ifAlreadyUploaded) {
        res = await updateUser({ ...params, id: ifAlreadyUploaded?.id } as any);
      } else {
        res = await createUser(params as any);
      }

      setUploadingLoading(false);
      handleIndex('3');
    } catch (e) {
      setUploadingLoading(false);
      console.log('e', e);
    }

    // console.log(params);
  };

  const validStep2 = React.useMemo(() => name && website && account && formattedPubKey, [name, website, account, formattedPubKey]);

  const handleUpdateUpload = ({ uploadedFiles }) => {
    const f = uploadedFiles.map((x) => x.fileUrl).join('\n');

    console.log(`Files: ${f}`);
  };

  const handleCompleteUpload = (files: any[]) => {
    const f = files.map((x: { fileUrl: any }) => x.fileUrl).join('\n');
    if (!f) return;
    setAvatar(f);
  };

  const handlePubKey = (v: string) => {
    setPubKey(v);
  };

  const { ifMobile } = useDevice();

  const step = React.useMemo(() => {
    switch (activeIndex) {
      case '1':
        return (
          <div className="flex flex-col gap-32">
            <div className="flex flex-col gap-20">
              <div
                className={`radius-30 flex flex-col gap-10 ${ifMobile ? 'p-15 pl-25 pr-25' : 'p-50'}`}
                style={{
                  background:
                    'var(--gradient-glass, linear-gradient(91deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.15) 100%))',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  backdropFilter: 'blur(30px)',
                  overflow: 'hidden',
                }}
              >
                <span className={`${ifMobile ? 'fz-27' : 'fz-36'} fw-700 color-fff raleway`}>Docker</span>
                <span className={`${ifMobile ? 'fz-14' : 'fz-26'} fw-500 color-fff raleway`}>Set up Sequencer via Docker</span>
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
                <Button type="metis" onClick={() => handleIndex('2')} className={`${ifMobile ? 'h-60 radius-20' : ' h-80 radius-30'} w-full `}>
                  <div className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway color-fff`}>CONTINUE</div>
                </Button>
              </div>
            </div>
            <div className="fz-18 fw-500 color-fff raleway">
              You have questions? Make sure to read our{' '}
              <a className="fz-18 fw-700 color-fff underlined" href="" target="_blank">
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
            <div className={`${ifMobile ? 'p-40 pl-20 pr-20' : 'p-50'} flex flex-col items-center gap-24 cards-container`} >
              {/* avatar */}
              <div className="flex-1 flex flex-col items-center gap-4 pointer">
                <div className="s-120">
                  <UploadButton
                    uploader={uploader}
                    options={{
                      maxFileCount: 1,
                      editor: { images: { cropShape: 'circ', preview: true } },
                    }}
                    onComplete={handleCompleteUpload}
                    onUpdate={handleUpdateUpload}
                  >
                    {({ onClick }) =>
                    (avatar ? (
                      <img onClick={onClick} src={avatar} className="s-120 radiusp-50" />
                    ) : (
                      <svg
                        onClick={onClick}
                        xmlns="http://www.w3.org/2000/svg"
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_361_2511)">
                          <rect width="120" height="120" rx="60" fill="#1B4A82" />
                          <path
                            d="M42.3713 106.636C39.7004 112.266 37.0111 118.22 34.3767 124.515C34.4064 125.243 35.0664 127.039 37.4686 128.4C39.481 123.723 43.6155 114.245 46.3962 108.489C75.978 114.928 93.9612 98.7042 98.6262 93.7579C98.7678 93.6042 98.8681 93.418 98.9176 93.2163C98.9672 93.0147 98.9646 92.8041 98.91 92.6037C98.8554 92.4033 98.7506 92.2196 98.6052 92.0693C98.4598 91.919 98.2783 91.807 98.0775 91.7434C83.0396 86.7791 63.6475 90.5563 50.3659 100.431C54.5919 92.0852 59.3484 83.3797 64.544 74.7642C95.3515 78.9191 111.67 60.9326 115.768 55.5366C115.888 55.3729 115.965 55.1825 115.991 54.9825C116.018 54.7825 115.995 54.5791 115.922 54.3904C115.85 54.2017 115.731 54.0334 115.576 53.9008C115.422 53.7681 115.236 53.6751 115.036 53.6301C100.767 50.2306 83.6068 54.6553 71.3496 64.0622C74.8987 58.6843 78.6123 53.4322 82.4724 48.4499C92.7175 43.9953 101.583 36.9581 108.172 28.051C114.761 19.1439 118.84 8.68314 119.994 -2.27202C120.015 -2.4742 119.984 -2.67832 119.903 -2.86544C119.822 -3.05255 119.695 -3.21657 119.532 -3.34221C119.37 -3.46786 119.178 -3.55107 118.974 -3.58409C118.77 -3.61711 118.561 -3.59886 118.366 -3.53106C111.103 -1.03094 83.4421 10.7682 77.9538 46.7412C75.9048 49.4212 72.7764 53.702 68.9346 59.4936C74.24 37.9098 65.6782 22.7292 62.5133 18.1247C62.4035 17.9499 62.2501 17.8056 62.0676 17.7056C61.8851 17.6055 61.6796 17.553 61.4707 17.553C61.2617 17.553 61.0562 17.6055 60.8737 17.7056C60.6912 17.8056 60.5376 17.9499 60.4277 18.1247C55.4572 26.3595 52.8601 35.7691 52.9149 45.3447C52.9697 54.9202 55.6743 64.3006 60.7388 72.4799C56.5312 79.4586 51.921 87.6245 47.201 96.9235C48.9024 71.6165 35.1086 57.641 30.6082 53.7559C30.454 53.6243 30.2688 53.5326 30.0694 53.4893C29.87 53.4459 29.6627 53.4521 29.4664 53.5075C29.2701 53.5629 29.0911 53.6657 28.9454 53.8064C28.7998 53.9472 28.692 54.1215 28.6323 54.3135C26.5651 60.7886 20.9304 85.0525 42.3713 106.636Z"
                            fill="#20589B"
                          />
                          <path d="M60 78L60 60" stroke="white" strokeWidth="2" strokeLinecap="round" />
                          <path
                            d="M54 64.8L59.2929 59.5072C59.6834 59.1166 60.3166 59.1166 60.7071 59.5072L66 64.8"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M70.9284 70.8C73.2751 70.8009 75.5385 69.9405 77.2796 68.3856C79.0207 66.8307 80.1155 64.6923 80.3516 62.385C80.5876 60.0776 79.9482 57.7659 78.5572 55.8981C77.2964 54.2051 75.4996 52.9861 73.4619 52.4278C73.0776 52.3225 72.7731 52.0231 72.6701 51.6382C71.9608 48.9893 70.4175 46.6248 68.2551 44.8919C65.9204 43.021 63.006 42 60.0003 42C56.9945 42 54.0801 43.021 51.7455 44.8919C49.5831 46.6248 48.0398 48.9893 47.3305 51.6381C47.2274 52.023 46.9228 52.3225 46.5385 52.4277C44.5007 52.9858 42.7036 54.2046 41.4425 55.8976C40.0513 57.7653 39.4116 60.0772 39.6476 62.3847C39.8836 64.6921 40.9784 66.8308 42.7196 68.3857C44.4608 69.9406 46.7244 70.801 49.0713 70.8H49.7998"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_361_2511">
                            <rect width="120" height="120" rx="60" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    ))}
                  </UploadButton>
                </div>
                <span className="fz-14 fw-400 color-fff inter">Upload your logo</span>
              </div>

              <div className={`flex flex-col gap-25 ${ifMobile ? 'minwp-100 w-full' : 'minw-620'}`}>
                <div className={`flex ${ifMobile ? 'flex-col' : 'flex-row'} gap-20`}>
                  {/* name */}
                  <div className="flex-1 flex flex-col gap-6" style={ifMobile ? {} : { minWidth: 'calc(50% - 56px)' }}>
                    <div className="fz-14 fw-400 color-fff inter">Name</div>
                    <Input value={name} onChange={setName} solidLight className="flex-3  fz-22 fw-400 color-000" />
                  </div>

                  {/* website */}
                  <div className="flex-1 flex flex-col gap-6" style={ifMobile ? {} : { minWidth: 'calc(50% - 56px)' }}>
                    <div className="fz-14 fw-400 color-fff inter">Website</div>
                    <Input
                      value={website}
                      onChange={setWebsite}
                      solidLight
                      className="flex-3  fz-22 fw-400 color-000"
                    />
                  </div>
                </div>

                <div className={`flex ${ifMobile ? 'flex-col' : 'flex-row'} gap-20`}>
                  {/* address */}
                  <div className="flex-1 flex flex-col gap-6" style={ifMobile ? {} : { minWidth: 'calc(50% - 56px)' }}>
                    <div className="fz-14 fw-400 color-fff inter">Sequencer's Address</div>
                    <Input
                      value={account}
                      onChange={setAccount}
                      solidLight
                      className="flex-3  fz-22 fw-400 color-000"
                      suffix={isDev ? <Button onClick={() => setAccount(address)}>Addr</Button> : null}
                    />
                  </div>

                  {/* publicKey */}
                  <div className="flex-1 flex flex-col gap-6" style={ifMobile ? {} : { minWidth: 'calc(50% - 56px)' }}>
                    <div className="fz-14 fw-400 color-fff inter">Public Key</div>
                    <Input
                      value={pubKey}
                      onChange={handlePubKey}
                      solidLight
                      className="flex-3  fz-22 fw-400 color-000"
                      suffix={isDev ? <Button onClick={handleSignAndRecover}>Sign Test</Button> : null}
                    />
                  </div>
                </div>

                {/* desc */}
                <div className="flex-1 flex flex-col gap-6" style={ifMobile ? {} : { minWidth: 'calc(50% - 56px)' }}>
                  <div className="fz-14 fw-400 color-fff inter">Description</div>
                  <Input value={desc} onChange={setDesc} solidLight className="flex-3  fz-22 fw-400 color-000" />
                </div>
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
                // loading={uploadloading}
                disabled={!validStep2 || uploadloading}
                type="metis"
                onClick={handleUpload}
                className={`${ifMobile ? 'h-60 radius-20' : ' h-80 radius-30'} w-full `}
              >
                {uploadloading ? (
                  <div className="flex flex-row items-center justify-center">
                    {' '}
                    <Loading color="#fff" size={22} />
                  </div>
                ) : (
                  <div className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway color-fff`}>CONTINUE</div>
                )}
              </Button>
            </div>
          </div>
        );

      case '3':
        return (
          <div className="flex flex-col gap-32">
            <div className={`${ifMobile ? 'pb-66' : 'pb-16'} pt-66  pl-38 pr-38 flex flex-col items-center gap-73 cards-container`}>
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
                    <div className="fz-14 fw-400 color-fff inter">Expected APR</div>
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
                onClick={() => handleIndex('2')}
                className={`${ifMobile ? 'h-60 radius-20' : ' h-80 radius-30'} w-full `}
                style={{ border: '2px solid #FFF' }}
              >
                <div className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway color-fff`}>BACK</div>
              </Button>

              <Button
                loading={approveLoading}
                disabled={!stakeAmount || BigNumber(stakeAmount).lt(20000)}
                type="metis"
                onClick={handleLockup}
                className={`${ifMobile ? 'h-60 radius-20' : ' h-80 radius-30'} w-full `}
              >
                <div className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway color-fff`}>{needApprove ? 'APPROVE' : 'CONTINUE'}</div>
              </Button>
            </div>
          </div>
        );

      case '4':
        return (
          <div className="flex flex-col gap-32">
            <div className={`${ifMobile ? 'p-38 pl-20 pr-20' : ' pt-70 pb-34 pl-124 pr-124'} flex flex-col items-center gap-26 cards-container`}>
              <img className={`${ifMobile ? 's-120' : 's-180'}`} src={getImageUrl('@/assets/images/token/metis-dark.svg')} />
              <div className="color-fff flex flex-col gap-6 justify-center">
                <span className={`${ifMobile ? 'fz-31' : 'fz-46'} fw-700 raleway align-center`}>Congraturations!</span>
                <span className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway align-center`}>Your Sequencer has been set up successfully.</span>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-10">
              <Button
                type="metis"
                onClick={() => {
                  navigate(`/sequencers/${address}`);
                }}
                className={`${ifMobile ? 'h-60 radius-20' : ' h-80 radius-30'} w-full `}
              >
                <div className={`${ifMobile ? 'fz-16' : 'fz-26'} fw-700 raleway color-fff`}>CHECK MY SEQUENCER</div>
              </Button>
            </div>
          </div>
        );
    }
  }, [
    uploadloading,
    activeIndex,
    name,
    website,
    account,
    pubKey,
    formattedPubKey,
    handleSignAndRecover,
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
    <Container className={`pages-landing flex flex-col gap-48 items-center ${ifMobile ? 'mobile pt-45 pb-156' : 'pt-156 pb-206'}`}>
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
