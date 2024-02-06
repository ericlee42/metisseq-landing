import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { styled } from 'styled-components';

const Bar = styled.div<{ activePercent?: string; activeIndex?: string }>`
  width: 100%;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  height: 24px;
  background: #e8f1fb;
  border-radius: 26px;
  z-index: -1;
  overflow: hidden;
  &::after {
    content: '';
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

const Progress = ({ col, activeIndex }: { col: any; activeIndex: string }) => {
  const activePercent = useMemo(() => {
    const len = col?.length;
    const activeLen = BigNumber(activeIndex).minus(1).gt(0) ? BigNumber(activeIndex).minus(1).toString() : '0';

    const p = BigNumber(100).div(len).multipliedBy(activeLen).toString();
    return p;
  }, [col, activeIndex]);

  return (
    <Container>
      <div className="progress-bar flex flex-row items-center">
        <Bar className="bar" activeIndex={activeIndex} activePercent={activePercent} />
        {col.map((i, index) => (
          <div
            key={i.index}
            className={`c flex-1 flex flex-col items-center gap-16 c-${index} ${
              BigNumber(activeIndex).gte(i?.index) ? 'active-index' : ''
            }`}
          >
            <div className="index">{i.index}</div>
            <span>{i.content}</span>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Progress;
