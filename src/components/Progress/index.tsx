import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { styled } from 'styled-components';

const Bar = styled.div<{ activePercent?: string; activeIndex?: string }>`
  width: 100%;
  position: absolute;
  /* top: calc(50% - 10px); */
  left: 50%;
  transform: translate(-50%, -50%);
  height: 2px;
  background: #e8f1fb;
  border-radius: 26px;
  z-index: 0;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    transition: all linear 0.2s;
    display: inline-block;
    border-radius: 26px;
    width: ${({ activePercent, activeIndex }) =>
  (BigNumber(activePercent || 0).gt(0)
    ? `calc(${activePercent || 0}% + ${BigNumber(activeIndex || 0)
      .minus(1)
      .multipliedBy(84)
      .toString()}px)`
    : '0')};
    height: 100%;
    background: rgba(0, 210, 193, 1);
  }
`;

const Container = styled.div`
  .progress-bar {
    position: relative;
    width: 1000px;
    margin: auto;
  }

  .index {
    width: 42px;
    height: 42px;
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

  .active-index {
    .index {
      background: rgba(0, 210, 193, 1);
    }
    span {
      font-weight: bolder;
    }
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
`;

const IconRoundGray = ({ className }: { className?: any }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="84" height="84" viewBox="0 0 84 84" fill="none">
    <circle cx="42" cy="42" r="21" fill="white" fillOpacity="0.2" />
    <circle cx="42" cy="42" r="16" fill="white" fillOpacity="0.2" />
    <g filter="url(#filter0_d_361_2492)">
      <circle cx="42" cy="42" r="12" fill="white" />
    </g>
    <defs>
      <filter
        id="filter0_d_361_2492"
        x="0"
        y="0"
        width="84"
        height="84"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="15" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_361_2492" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_361_2492" result="shape" />
      </filter>
    </defs>
  </svg>
);

const IconRoundBlue = ({ className }: { className?: any }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10" fill="#00D2FF" />
    <circle cx="14" cy="14" r="14" fill="#00D2FF" fillOpacity="0.25" />
  </svg>
);

const Progress = ({
  verticle,
  needIndex = true,
  col,
  activeIndex,
}: {
  verticle?: boolean;
  needIndex?: boolean;
  col: any;
  activeIndex: string;
}) => {
  const activePercent = useMemo(() => {
    const len = col?.length;
    const activeLen = BigNumber(activeIndex).minus(1).gt(0) ? BigNumber(activeIndex).minus(1).toString() : '0';

    const p = BigNumber(100).div(len).multipliedBy(activeLen).toString();
    return p;
  }, [col, activeIndex]);

  return (
    <Container className={verticle ? 'w-full h-474 pl-22 pr-22' : ''}>
      <div className={`progress-bar flex ${verticle ? 'w-full flex-col h-full' : 'flex-row items-center'}`}>
        <Bar
          style={
            verticle
              ? {
                left: 0,
                top: '50%',
                height: '100%',
                width: '2px',
              }
              : {
                top: needIndex ? 'calc(50% + 10px)' : 'calc(50% - 10px)',
              }
          }
          className={'bar z-1'}
          activeIndex={activeIndex}
          activePercent={activePercent}
        />
        {verticle ? (
          <>
            {col.map((i, index) => (
              <div
                key={i.index}
                className={`flex ${verticle
                  ? `flex-row ${index === 0
                    ? 'flex-1 items-start'
                    : index === col.length - 1
                      ? 'flex-1 items-end'
                      : 'flex-2 items-center'
                  }`
                  : `flex-col items-center ${index === 0 || index === col.length - 1 ? 'flex-1' : 'flex-2'}`
                  }`}
              >
                <div className="h-78 w-56 minw-56 flex flex-col justify-center">
                  <div className="position-relative progress-line w-full">
                    {index === +activeIndex - 1 ? (
                      <IconRoundGray
                        className={`position-absolute topr-50  translateYTop left-0 ${index === 0 ? 'top-0' : index === col.length - 1 ? 'topr-100' : 'topr-50'
                          }`}
                      />
                    ) : (
                      <IconRoundBlue
                        className={`position-absolute topr-50  translateYTop left-0 ${index === 0 ? 'top-0' : index === col.length - 1 ? 'topr-100 translateYBottom' : 'topr-50'
                          }`}
                      />
                    )}
                  </div>
                </div>

                <div className={`flex flex-row items-center gap-12 ${index === col.length - 1 ? 'translateYr-50' : 'translateYr--50'}`}>
                  {needIndex ? (
                    <div
                      className={'fz-35 fw-400 inter color-fff align-center'}
                    >
                      {i.index}
                    </div>
                  ) : null}

                  <div className={'h-20 w-full fz-20 fw-400 inter color-fff'}>
                    {i.content}
                  </div>
                </div>


              </div>
            ))}
          </>
        ) : (
          <>
            {col.map((i, index) => (
              <div
                key={i.index}
                className={`flex ${verticle ? 'flex-row' : 'flex-col'} items-center ${index === 0 || index === col.length - 1 ? 'flex-1' : 'flex-2'
                  }`}
              >
                {needIndex ? (
                  <div
                    className={`fz-40 fw-400 inter color-fff align-center ${index === 0
                      ? 'self-start translateXr--50 whiteSpace-nowrap'
                      : index === col.length - 1
                        ? 'self-end translateXr-50 whiteSpace-nowrap'
                        : ''
                      }`}
                  >
                    {i.index}
                  </div>
                ) : null}

                <div className="h-78 w-full flex flex-col justify-center">
                  <div className="position-relative progress-line w-full">
                    {index === +activeIndex - 1 ? (
                      <IconRoundGray
                        className={`position-absolute topr-50 translateCenter ${index === 0 ? 'left-0' : index === col.length - 1 ? 'leftr-100' : 'leftr-50'
                          }`}
                      />
                    ) : (
                      <IconRoundBlue
                        className={`position-absolute topr-50 translateCenter ${index === 0 ? 'left-0' : index === col.length - 1 ? 'leftr-100' : 'leftr-50'
                          }`}
                      />
                    )}
                  </div>
                </div>

                <div className="h-20 w-full position-relative desc">
                  <span
                    className={`position-absolute fz-18 fw-400 inter color-fff whiteSpace-nowrap ${index === 0
                      ? 'self-start translateXr--50 align-left'
                      : index === col.length - 1
                        ? 'self-end align-center leftr-100 translateXr--50'
                        : 'align-center leftr-50 translateXr--50'
                      }`}
                  >
                    {i.content}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </Container>
  );
};

export default Progress;
