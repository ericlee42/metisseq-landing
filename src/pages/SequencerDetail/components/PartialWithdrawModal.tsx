import { compareDecimals, subtractDecimals } from '@/utils/decimal';
import { parseTokenAmount } from '@/utils/amount';
import { Button, Input, Modal } from '@/components';
import Loading from '@/components/_global/Loading';
import NumberText from '@/components/NumberText';
import useLock from '@/hooks/useLock';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useUpdate from '@/hooks/useUpdate';
import { getImageUrl } from '@/utils/tools';
import { useBoolean, useCountDown } from 'ahooks';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { styled } from 'styled-components';

const Container = styled(Modal)`
  .f-12 {
    font-size: 12px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #333347;
    line-height: 18px;
  }
  .f-14 {
    font-size: 14px;
    font-family: Poppins-Regular, Poppins;
    font-weight: 400;
    color: #333347;
    line-height: 21px;
  }

  .f-14-bold {
    font-size: 14px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: #333347;
    line-height: 21px;
  }

  .bg-dark {
    background: rgba(248, 248, 248, 1);
  }

  .radius-8 {
    border-radius: 8px;
  }

  .p-24 {
    padding: 24px;
  }

  .inside {
    width: 460px;
    .c {
      padding: 0 35px 35px;
    }
  }
  .link {
    background: rgba(0, 210, 255, 0.1);
    color: #00d2ff;
    border-radius: 10px;
    padding: 10px 20px;
    margin-top: 20px;
  }
  .error-font {
    color: #b50000;
  }
  .pointer {
    width: 100px;
  }
  .input-style {
    background: #fff;
    border-radius: 8px;
    label {
      border: none !important;
    }
    &-max {
      border: 1px solid #000;
      border-radius: 45px;
      padding: 4px 16px;
      font-size: 15px;
      cursor: pointer;
    }
  }
  .max-tooltip {
    color: #7b7b7b;
    font-weight: 400;
  }
`;

const PartialWithdrawModal = ({
  refetchGraph,
  visible,
  onOk,
  onClose,
  lockedup,
}: {
  refetchGraph?: any;
  visible: boolean;
  onOk?: any;
  onClose?: any;
  lockedup: string;
}) => {
  const { sequencerInfo, run } = useSequencerInfo();
  const [relockAmount, setRelockAmount] = React.useState('');
  const unlockTo = useMemo(
    () => dayjs.unix(sequencerInfo?.unlockClaimTime || 0).format('YYYY-MM-DD HH:mm:ss'),
    [sequencerInfo?.unlockClaimTime],
  );

  const [indexPage, setIndexPage] = React.useState(0);

  const [countdown] = useCountDown({
    targetDate: unlockTo,
  });
  const [isError] = React.useState(false);
  const { withdraw } = useLock();
  const { sequencerId } = useUpdate();

  const [withdrawLoading, { setTrue, setFalse }] = useBoolean(false);
  const setMax = () => {
    setRelockAmount(subtractDecimals(lockedup, 20000));
  };
  const handleWithdraw = async () => {
    if (countdown) return;
    try {
      setTrue();
      await withdraw({ sequencerId, relockAmount: parseTokenAmount(relockAmount) });
      setFalse();
    } catch {
      setFalse();
    } finally {
      run?.({ sequencerId: sequencerId, self: true });
      refetchGraph?.();
    }
  };

  return (
    <Container visible={visible} onCancel={onClose} onClose={onClose} onOk={onOk} title="Partial Withdraw" middleHeader>
      {indexPage === 0 ? (
        <div className="c flex flex-col gap-24">
          <div className=" flex flex-col gap-12">
            <div>Partial withdrawals must maintain the minimum METIS balance required for Sequencer status.</div>
            <div>Only one withdrawal is allowed per reward cycle; additional attempts will not be processed.</div>
          </div>

          <div className="flex flex-row items-center gap-20">
            <Button style={{ padding: '14px 50px' }} type="metis" className="flex-1" onClick={() => setIndexPage(1)}>
              <div className="flex items-center justify-center">Acknowledge</div>
            </Button>
          </div>
        </div>
      ) : (
        <div className="c flex flex-col gap-24">
          <div className="flex flex-col p-8 gap-12  bg-dark radius-8" style={{ padding: '40px' }}>
            <div className="flex justify-center p-24">
              <img className="pointer" src={getImageUrl('@/assets/images/_global/metis_logo_dark.svg')} />
            </div>
            <Input
              value={relockAmount}
              onChange={setRelockAmount}
              max={subtractDecimals(lockedup, 20000)}
              solid
              className="flex-1 p-8 input-style"
              suffix={
                <div className="flex flex-row items-center gap-8">
                  <span className="f-12 input-style-max" onClick={setMax}>
                    Max
                  </span>
                </div>
              }
            />
            <span className="f-14 max-tooltip">
              {' '}
              Max. withdrawal: <NumberText value={subtractDecimals(lockedup, 20000) || '0'} /> METIS{' '}
            </span>
            {isError ? <span className="f-12 error-font">Insufficient balance for withdrawal</span> : null}
          </div>
          <div className="f-12">This operation will withdraw your locked-up to your owner address on Ethereum.</div>
          <div className="flex flex-row items-center gap-20">
            <Button
              disabled={!(compareDecimals(relockAmount, 0) > 0) || withdrawLoading}
              style={{ padding: '14px 50px' }}
              type="metis"
              className="flex-1"
              onClick={handleWithdraw}
            >
              <div className="flex items-center justify-center">
                {withdrawLoading ? <Loading color="#fff" /> : 'Withdraw'}
              </div>
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};
export default PartialWithdrawModal;
