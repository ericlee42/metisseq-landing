/* eslint-disable max-len */
import * as React from 'react';
import './index.scss';
import { styled } from 'styled-components';
import { getImageUrl, jumpLink } from '@/utils/tools';
import { Button, Input } from '@/components';
import Faq from 'react-faq-component';
import Progress from '@/components/Progress';
import SequencerHeader from '@/components/_global/SequencerHeader';
import useDevice from '@/hooks/useDevice';

const section2 = {
  title: 'Benefits',
  children: [
    {
      title: 'For the Network',
      gradient: 'linear-gradient(110deg, #9E32F7 0%, #01498D 174.15%)',
      children: [
        {
          title: 'Decentralization',
          content:
            'By participating in the consensus process, Sequencers play an essential role in maintaining the network’s decentralization, transparency and stability.',
          img: getImageUrl('@/assets/images/_global/decentralization.svg'),
        },
        {
          title: 'Security',
          content:
            'With multiple nodes or entities participating in sequencing, it becomes more challenging for malicious actors to control or compromise the order of transactions.',
          img: getImageUrl('@/assets/images/_global/security.svg'),
        },
      ],
    },
    {
      title: 'For the Sequencer',
      gradient: 'linear-gradient(147deg, #593CC8 19.75%, #01498D 100%)',
      children: [
        {
          title: 'Rewards',
          content:
            'Sequencer nodes have the opportunity to earn METIS tokens as rewards for their role in block production and transaction processing within the network.',
          img: getImageUrl('@/assets/images/_global/rewards.svg'),
        },
        {
          title: 'Community',
          content:
            'Active participation can increase recognition within the community, creating possibilities for future collaborations and potential partnerships.',
          img: getImageUrl('@/assets/images/_global/community.svg'),
        },
      ],
    },
  ],
};

const section4 = [
  {
    index: '1',
    content: 'Submit an Application',
  },
  {
    index: '2',
    content: 'Initial Review',
  },
  {
    index: '3',
    content: 'Community Voting',
  },
  {
    index: '4',
    content: 'Final Selection and Onboarding',
  },
];

const section5 = {
  rows: [
    {
      title: 'How does the sequencer work?',
      content: (
        <span className="flex flex-col gap-4">
          <span>1. Users initiate transactions.</span>
          <span>2. The transaction is sent to sequencer nodes in the network.</span>
          <span>3. The sequencer is responsible for collecting the transaction and packaging into a block.</span>
          <span>
            4. This block is then aggregated by MPC (Multi-Party Computation) nodes and submitted to the Ethereum main
            chain for the final confirmation of the transaction.
          </span>
        </span>
      ),
    },
    {
      title: 'How can I run a sequencer?',
      content: (
        <span>
          Please visit the{' '}
          <span
            className="underlined pointer"
            onClick={() => jumpLink('https://forms.gle/Ut5A8PqeaVZC9awa6', '_blank')}
          >
            Sequencer Whitelist Application
          </span>{' '}
          form to apply. Once you have filled out the form, we will get in touch with you.
        </span>
      ),
    },
    {
      title: 'What hardware do I need to run a sequencer?',
      content: (
        <span className="flex flex-col gap-4">
          <span>CPU: 16-core</span>
          <span>RAM: 32 GB</span>
          <span>Storage: 1 TB SSD</span>
        </span>
      ),
    },
  ],
};

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
    &.mobile {
      .faq-row {
        padding: 0;
      }
      .row-title-text,
      .row-content-text {
        font-size: 22px !important;
      }
      .row-content-text {
        font-size: 12px !important;
      }
    }
  }
`;

const Section2CardTemplate = ({ title, img, content }: { title?: string; img?: string; content?: string }) => {
  const { ifMobile } = useDevice();
  return (
    <div className={`${ifMobile ? 'flex-col gap-16 items-center' : 'flex-row gap-32 items-start'} flex wrap maxw-520`}>
      {img ? <img className={`${ifMobile ? 'w-82 h-82' : 'w-52 h-60'}`} src={img} /> : null}
      <div className={`${ifMobile ? 'items-center gap-8' : 'gap-6'} flex flex-col`}>
        {title ? <span className="fz-22 fw-700 raleway color-fff">{title}</span> : null}
        {content ? (
          <span className={`${ifMobile ? 'align-center' : ''} fz-18 fw-400 inter color-fff`}>{content}</span>
        ) : null}
      </div>
    </div>
  );
};

export function Component() {
  const { ifMobile } = useDevice();
  return (
    <Container className={'pages-landing flex flex-col'}>
      <SequencerHeader filterBy="healthy" />
      <div
        className={`main-section main-section-2 flex flex-col gap-22 justify-center  ${
          ifMobile ? 'p-22 pt-48 pb-91' : 'h-791'
        }`}
      >
        <div className="flex flex-col gap-12 items-center">
          <span className={`${ifMobile ? 'fz-40' : 'fz-56'} fw-700 color-fff raleway`}>{section2.title}</span>
        </div>
        <div
          className={`${
            ifMobile ? 'flex-col gap-45' : 'flex-row gap-18'
          } flex items-center items-center justify-center`}
        >
          {section2.children.map((i) => (
            <div className="gap-16 flex flex-col color-fff items-center" key={i.title}>
              <div className="flex flex-col gap-14 ">
                <span className={`${ifMobile ? 'fz-28' : 'fz-36'} fw-700 raleway color-fff`}>{i.title}</span>
              </div>
              <div className="flex flex-col gap-38 p-40 radius-30" style={{ background: i.gradient }}>
                {i?.children?.map((j) => (
                  <Section2CardTemplate key={j.title} title={j.title} content={j.content} img={j.img} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sequencer */}
      <div
        className={`sc3 main-section main-section-3 flex flex-col gap-56 pt-127 pb-152 ${
          ifMobile ? 'pl-22 pr-22' : ''
        }`}
      >
        <div className="flex flex-col gap-12 items-center justify-center">
          <span className={`${ifMobile ? 'fz-32 align-left' : 'fz-56 align-center'} fw-700 raleway inter`}>
            Decentralized Sequencer
            <br />
            Overall Architecture
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="position-relative">
            {ifMobile ? (
              <div className="flex flex-col gap-21 top-54 left-37 position-absolute">
                <div className={'lh-120 fz-25 fw-700 color-fff '}>
                  Decentralized
                  <br />
                  Sequencer Overall
                  <br />
                  Architecture
                </div>
                <div className="h-2 bg-color-fff w-full w-full" />
                <svg xmlns="http://www.w3.org/2000/svg" width="112" height="39" viewBox="0 0 112 39" fill="none">
                  <path
                    d="M40.1021 19.5C40.1021 15.6433 38.9261 11.8731 36.7229 8.66639C34.5196 5.45963 31.3881 2.96027 27.7242 1.48436C24.0604 0.00844964 20.0288 -0.377716 16.1393 0.374696C12.2498 1.12711 8.67699 2.9843 5.87281 5.71143C3.06862 8.43855 1.15896 11.9131 0.385285 15.6957C-0.388388 19.4784 0.00868331 23.3992 1.5263 26.9623C3.04391 30.5255 5.6139 33.571 8.91127 35.7137C12.2086 37.8563 16.0853 39 20.051 39C25.3689 39 30.469 36.9455 34.2292 33.2886C37.9895 29.6316 40.1021 24.6717 40.1021 19.5Z"
                    fill="#00D2FF"
                  />
                  <path
                    d="M33.5749 18.532C33.1502 18.2198 32.7083 17.9304 32.2512 17.6651C32.0565 17.5462 31.8761 17.4066 31.7132 17.249C31.3716 16.9195 30.8002 16.3474 30.6149 15.9941C30.4966 15.7774 30.5457 15.3613 30.6372 14.9755C30.7992 14.2952 30.6781 13.5802 30.3002 12.986L29.7041 12.0476C29.4305 11.6193 29.2102 11.161 29.0479 10.6823C28.8435 10.0666 28.4862 9.50913 28.0076 9.05905C27.0411 8.14232 24.3668 7.69154 22.1457 7.62002C22.0079 7.58011 21.8678 7.54826 21.726 7.52466C20.7371 7.35995 19.6813 7.09122 18.7348 7.26676C17.3285 7.52249 15.9087 7.94944 14.8462 9.00053C14.6229 9.21726 14.2993 9.31478 14.0694 9.51633C13.6229 9.91727 12.9956 9.91727 12.5894 10.3615C12.3527 10.6194 12.2434 11.4668 11.6206 11.7897C10.5893 12.325 9.83475 12.9167 9.57803 13.2179C9.38829 13.4455 9.2432 13.7099 9.05793 13.9418C8.87265 14.1737 7.98421 14.5811 7.71857 14.8325C7.52146 15.0446 7.37838 15.2986 7.30084 15.5741C7.22329 15.8497 7.21345 16.139 7.27211 16.4189C7.28774 16.4861 7.29891 16.5403 7.30784 16.5836C7.41052 16.952 7.68507 17.6174 7.62257 17.923C7.54667 18.2849 6.58903 20.9809 8.7387 21.6983C8.93538 21.7554 9.10795 21.8724 9.23093 22.032C9.35392 22.1916 9.42083 22.3853 9.42179 22.5846C9.46819 22.9445 9.57529 23.2945 9.73878 23.6206C9.88163 23.8848 10.0923 24.1087 10.3504 24.2707C10.6257 24.5249 10.8858 24.794 11.1295 25.0769C11.8884 26.4401 11.6741 27.1228 13.1385 27.5844C13.5122 27.704 13.8708 27.864 14.2078 28.0612C14.6184 28.3017 15.0587 28.491 15.5181 28.6247L15.5761 28.6442C15.8976 27.8856 16.2257 27.1683 16.5516 26.49C13.9354 23.8893 14.6229 20.9657 14.8752 20.1855C14.8825 20.1624 14.8956 20.1414 14.9134 20.1244C14.9312 20.1075 14.953 20.0951 14.977 20.0884C15.0009 20.0817 15.0262 20.081 15.0505 20.0862C15.0749 20.0914 15.0975 20.1025 15.1163 20.1183C15.6654 20.5865 17.3485 22.2704 17.1409 25.3197C17.7169 24.1992 18.2794 23.2153 18.7928 22.3744C18.1749 21.3889 17.8448 20.2586 17.8382 19.1049C17.8315 17.9511 18.1484 16.8173 18.7549 15.8251C18.7683 15.804 18.787 15.7867 18.8093 15.7746C18.8316 15.7625 18.8566 15.7562 18.8821 15.7562C18.9076 15.7562 18.9327 15.7625 18.955 15.7746C18.9772 15.7867 18.996 15.804 19.0094 15.8251C19.3955 16.3799 20.4402 18.209 19.7929 20.8097C20.2617 20.1118 20.6434 19.5961 20.8934 19.2731C21.5631 14.9387 24.9383 13.517 25.8245 13.2158C25.8482 13.2076 25.8738 13.2054 25.8987 13.2094C25.9236 13.2134 25.947 13.2234 25.9668 13.2385C25.9866 13.2537 26.0022 13.2734 26.0121 13.296C26.0219 13.3185 26.0257 13.3431 26.0231 13.3675C25.8823 14.6875 25.3847 15.9479 24.5807 17.0211C23.7767 18.0944 22.6949 18.9423 21.4448 19.479C20.9738 20.0793 20.5206 20.7122 20.0876 21.3602C21.5832 20.2267 23.677 19.6936 25.4182 20.1032C25.4426 20.1086 25.4652 20.1198 25.4841 20.1358C25.503 20.1518 25.5175 20.1721 25.5263 20.1948C25.5351 20.2175 25.538 20.242 25.5348 20.2661C25.5315 20.2902 25.5221 20.3132 25.5075 20.3329C25.0074 20.9831 23.0163 23.1503 19.2571 22.6497C18.6232 23.6878 18.0428 24.7367 17.5271 25.7423C19.1478 24.5525 21.514 24.0974 23.3489 24.6955C23.3734 24.7032 23.3955 24.7167 23.4133 24.7348C23.431 24.7529 23.4438 24.775 23.4505 24.7992C23.4571 24.8233 23.4575 24.8487 23.4514 24.873C23.4454 24.8973 23.4331 24.9197 23.4158 24.9382C22.8466 25.5342 20.6523 27.4891 17.0427 26.7132C16.7034 27.4067 16.1989 28.5488 15.9534 29.1123C15.8686 29.3073 15.7904 29.5024 15.7302 29.7018C15.5694 30.1612 15.3551 30.7355 15.0984 31.3077C15.0628 31.3895 15.0448 31.4775 15.0455 31.5663C15.0462 31.6552 15.0658 31.7429 15.1028 31.8241C15.1398 31.9054 15.1936 31.9784 15.2608 32.0386C15.328 32.0989 15.4072 32.1452 15.4935 32.1746C18.3406 33.1624 21.4322 33.2737 24.3467 32.4932C24.443 32.4664 24.5319 32.4191 24.6069 32.3545C24.6818 32.29 24.7409 32.21 24.7798 32.1204L24.9003 31.8473C24.9003 31.8473 26.1593 29.0104 26.3446 27.773C26.3975 27.3832 26.5222 27.0058 26.7129 26.659C26.8111 26.4855 26.9533 26.3392 27.1259 26.2338C27.2985 26.1284 27.496 26.0674 27.6996 26.0565C28.6594 26.0067 30.702 25.8766 31.4453 25.6469C32.432 25.3435 32.0034 23.5967 31.952 23.4082C31.9007 23.2196 32.4275 22.7819 32.5347 22.5283C32.6418 22.2747 32.269 22.1837 32.115 21.9041C31.961 21.6246 32.4967 21.4208 32.5615 21.1673C32.6262 20.9137 32.3873 20.6341 32.2847 20.4456C32.2164 20.3087 32.1697 20.1626 32.1462 20.0122C32.1462 20.0122 32.8673 19.4985 33.2624 19.1756C33.6575 18.8527 33.5749 18.584 33.5749 18.5254"
                    fill="black"
                  />
                  <path
                    d="M60.1552 26.058V18.2439L57.2586 23.9338H55.5608L52.6642 18.2439V26.058H49.5693V12.9421H52.9293L56.4007 19.7966L59.8922 12.9421H63.2344V26.058H60.1552Z"
                    fill="white"
                  />
                  <path
                    d="M77.1675 23.3973V26.058H67.7002V12.9421H76.9973V15.6028H70.8112V18.1523H76.1238V20.6079H70.8112V23.3973H77.1675Z"
                    fill="white"
                  />
                  <path
                    d="M91.1896 15.6028H87.1203V26.058H84.0254V15.6028H79.936V12.9421H91.1852L91.1896 15.6028Z"
                    fill="white"
                  />
                  <path d="M94.5835 26.058V12.9421H97.7095V26.058H94.5835Z" fill="white" />
                  <path
                    d="M110.239 16.7948C110.126 16.6751 109.99 16.5775 109.839 16.507C109.563 16.3533 109.277 16.215 108.984 16.0928C108.62 15.9372 108.245 15.8075 107.862 15.7048C107.467 15.5952 107.057 15.5394 106.646 15.5391C106.217 15.5148 105.79 15.6068 105.412 15.8051C105.267 15.8883 105.149 16.0083 105.07 16.152C104.991 16.2957 104.954 16.4577 104.963 16.6204C104.957 16.7536 104.985 16.8862 105.042 17.0071C105.1 17.128 105.187 17.2339 105.295 17.3158C105.585 17.5205 105.91 17.6733 106.255 17.7671C106.673 17.8957 107.187 18.0439 107.795 18.2161C108.57 18.4053 109.322 18.6727 110.039 19.014C110.623 19.2839 111.124 19.6981 111.491 20.2152C111.854 20.7996 112.03 21.4758 111.996 22.1576C112.016 22.802 111.873 23.4414 111.578 24.0193C111.313 24.512 110.928 24.9342 110.456 25.2488C109.961 25.5682 109.409 25.7978 108.829 25.9268C108.213 26.0702 107.582 26.1433 106.949 26.1448C106.271 26.1429 105.595 26.0787 104.929 25.9529C104.251 25.8269 103.586 25.6408 102.943 25.397C102.329 25.1685 101.742 24.8761 101.193 24.525L102.562 21.8851C102.712 22.0172 102.878 22.132 103.055 22.2273C103.39 22.42 103.736 22.5925 104.092 22.744C104.539 22.9345 104.999 23.0919 105.47 23.2149C105.972 23.3492 106.489 23.4174 107.009 23.4176C107.441 23.4455 107.871 23.358 108.255 23.1647C108.382 23.0935 108.487 22.9903 108.559 22.866C108.631 22.7417 108.667 22.6009 108.663 22.4584C108.668 22.305 108.631 22.1531 108.557 22.018C108.482 21.8829 108.371 21.7694 108.237 21.6889C107.876 21.4717 107.485 21.3045 107.077 21.1918C106.588 21.0458 106.029 20.8801 105.394 20.697C104.683 20.4971 103.998 20.22 103.352 19.8708C102.858 19.606 102.445 19.2195 102.153 18.7502C101.877 18.2422 101.743 17.6722 101.765 17.0978C101.737 16.2742 101.972 15.4624 102.438 14.774C102.893 14.1404 103.522 13.6441 104.254 13.3417C105.04 13.0122 105.889 12.8466 106.745 12.8556C107.363 12.8524 107.979 12.9257 108.578 13.0736C109.145 13.2123 109.698 13.3975 110.232 13.6273C110.746 13.8453 111.204 14.0633 111.61 14.2922L110.239 16.7948Z"
                    fill="white"
                  />
                </svg>
              </div>
            ) : (
              <div
                className={`${
                  ifMobile ? 'lh-120 fz-22 top-54 left-37' : 'fz-42  top-64 left-67'
                } fw-700 lh-110 color-fff position-absolute`}
              >
                Decentralized
                <br />
                Sequencer Overall
                <br />
                Architecture
              </div>
            )}

            <img
              onClick={() => {
                jumpLink('https://docs.metis.io/dev/decentralized-sequencer/overview', '_blank');
              }}
              style={ifMobile ? { objectFit: 'cover' } : {}}
              className={`${ifMobile ? 'w-full h-452 radius-30' : 'w-784 pointer'}`}
              src={
                ifMobile
                  ? getImageUrl('@/assets/images/_global/m_Decentralized_Sequencer.png')
                  : getImageUrl('@/assets/images/_global/Decentralized_Sequencer.png')
              }
            />
          </div>
        </div>
      </div>

      {/* waitinglist campagin */}
      <div
        className={`sc4 main-section main-section-4 flex flex-col items-center gap-64 pt-97 pb-121 ${
          ifMobile ? 'pl-22 pr-22' : ''
        }`}
      >
        <div className="flex flex-col gap-12 items-center">
          <span className={`${ifMobile ? 'fz-30' : 'fz-56'} fw-700 raleway color-fff`}>Whitelisting Campaign</span>
        </div>

        <Progress col={section4} activeIndex="1" verticle={ifMobile} />

        {ifMobile ? null : (
          <Button
            className="light h-60 w-400"
            onClick={() => {
              jumpLink('https://ceg.vote/c/infrastructure-sequencer/30', '_blank');
            }}
          >
            <div className="fz-20 fw-500 color-000 raleway">Apply now for the next round</div>
          </Button>
        )}
      </div>

      {/* FAQ */}
    </Container>
  );
}

Component.displayName = 'Home';
