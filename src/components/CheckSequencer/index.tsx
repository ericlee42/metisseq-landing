import { styled } from 'styled-components';
import { Button, Modal } from '..';
import { getImageUrl } from '@/utils/tools';

const Container = styled(Modal)`
  .inside {
    width: 467px;
    .f-16-bold {
      font-size: 16px;
      font-family: Poppins-Bold, Poppins;
      font-weight: bold;
      color: #313146;
      line-height: 25px;
    }

    .f-12 {
      font-size: 12px;
      font-family: Poppins-Regular, Poppins;
      font-weight: 400;
      color: #333347;
      line-height: 18px;
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
      justify-content: center;
      position: relative;
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
  }
`;

const CheckSequencer = ({
  visible,
  onClose,
  onOk,
  invalid,
}: {
  visible: boolean;
  onClose?: any;
  onOk?: any;
  invalid: boolean;
}) => {
  return (
    <Container visible={visible} onClose={onClose} onOk={onOk}>
      <div className="flex flex-col gap-80 items-center">
        <div className="flex flex-col gap-24 items-center">
          <img
            style={{ width: '64px', height: '64px' }}
            src={
              invalid
                ? getImageUrl('@/assets/images/_global/ic_limits_of_authority.svg')
                : getImageUrl('@/assets/images/_global/ic_create.svg')
            }
          />
          <div className="f-16-bold">Notice</div>
          <div className="f-12" style={{ maxWidth: '313px', textAlign: 'center' }}>
            {invalid
              ? 'You haven‘t applied for Sequencer yet.Please apply for permission to become a Sequencer. Waiting for the platform to agree before creating.'
              : 'You already have a Sequencer.Only one Sequencer can be created per account.'}
          </div>
        </div>

        <div className="flex flex-row items-center gap-20 w-full">
          <Button type="metis" className="flex-1" onClick={onClose}>
            <div style={{ padding: '14px 0' }}>Got it</div>
          </Button>
          <Button type="metis-solid" className="flex-1" onClick={onClose}>
            <div style={{ padding: '14px 0' }}>Check my sequencer</div>
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CheckSequencer;
