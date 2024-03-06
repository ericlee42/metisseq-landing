import './index.scss';
import { styled } from 'styled-components';
import { getImageUrl } from '@/utils/tools';

import SequencerHeader from '@/components/_global/SequencerHeader';

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
      width: calc(50% - 32px);
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
          height: 80px;
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
        }
      }
    }
  }
`;

export function Component() {
  return (
    <Container className="pages-landing flex flex-col ">
      <SequencerHeader />
    </Container>
  );
}

Component.displayName = 'Sequencer';
