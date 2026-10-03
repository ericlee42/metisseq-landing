import { Button } from '@/components';
import Faq from '@/components/Faq';
import Progress from '@/components/Progress';
import SequencerHeader from '@/components/_global/SequencerHeader';
import useDevice from '@/hooks/useDevice';
import { getImageUrl, jumpLink } from '@/utils/tools';
import { styled } from 'styled-components';

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
    content: 'Submit a Proposal',
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
          Please submit a proposal to become a Sequencer on the Metis Governance forum using the ‘Infrastructure
          proposal’ type. For more details please check{' '}
          <span
            className="underlined pointer"
            onClick={() => {
              jumpLink('https://ceg.vote/t/governance-proposal-decentralized-sequencer-governance/1922/24', '_blank');
            }}
          >
            Decentralized Sequencer Governance Structure
          </span>{' '}
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

  .mobile-width {
    width: 100%;
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
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #313146;
      line-height: 40px;
    }

    .f-16 {
      font-size: 16px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
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
      background:
        url(${getImageUrl('@/assets/images/_global/main_section_2.png')}),
        lightgray 50% / cover no-repeat;
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
          <div className={`position-relative ${ifMobile ? 'mobile-width' : ''}`}>
            {ifMobile ? (
              <div className="flex flex-col gap-21 top-54 left-37 position-absolute" />
            ) : (
              <div
                className={`${
                  ifMobile ? 'lh-120 fz-22 top-54 left-37' : 'fz-42  top-64 left-67'
                } fw-700 lh-110 color-fff position-absolute`}
              />
            )}
            <iframe
              className={`${ifMobile ? 'w-full' : 'w-784'} radius-30`}
              height="452"
              src="https://www.youtube.com/embed/2HXDWP9BcTE?si=J6IaA74zbNFVGGVk"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div
        className={`sc4 main-section main-section-4 flex flex-col items-center gap-64 pt-97 pb-121 ${
          ifMobile ? 'pl-22 pr-22' : ''
        }`}
      >
        <div className="flex flex-col gap-12 items-center">
          <span className={`${ifMobile ? 'fz-30' : 'fz-56'} fw-700 raleway color-fff`}>Whitelisting Campaign</span>
        </div>

        <Progress col={section4} activeIndex="1" verticle={ifMobile} />

        <Button
          className={`light h-60 w-400 ${ifMobile ? 'mobile-width' : ''}`}
          onClick={() => {
            jumpLink('https://ceg.vote/c/infrastructure-sequencer', '_blank');
          }}
        >
          <div className="fz-20 fw-500 color-000 raleway">Apply now for the next round</div>
        </Button>
      </div>

      <div
        className={`sc5 main-section flex ${
          ifMobile
            ? 'mobile pl-22 pr-22 items-start flex-col gap-33 maxwp-100'
            : 'items-center flex-row gap-64 maxw-1200'
        } pt-91 pb-54 m-auto`}
      >
        <div className="flex flex-col gap-2 flex-1">
          <span className="fz-56 fw-700 raleway color-000">FAQ</span>
          {ifMobile ? null : <span className="fz-20 fw-400 raleway color-000">Frequently asked questions</span>}
        </div>
        {ifMobile ? null : (
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="2" height="203" viewBox="0 0 2 203" fill="none">
              <path d="M1 0L1.00001 203" stroke="black" />
            </svg>
          </div>
        )}
        <div className="flex flex-row items-center flex-2 w-full">
          <Faq data={section5} />
        </div>
      </div>
    </Container>
  );
}

Component.displayName = 'Home';
