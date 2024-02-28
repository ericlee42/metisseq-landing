import { Button, Input, Modal } from '@/components';
import { styled } from 'styled-components';

const Container = styled(Modal)`
  .avatar {
    width: 64px;
    height: 64px;
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
`;

const DetailModal = ({ refetchGraph, visible, onOk, onClose }: { refetchGraph?: any; visible: boolean; onOk?: any; onClose?: any }) => {
  return (
    <Container
      visible={visible}
      onCancel={onClose}
      onClose={onClose}
      onOk={onOk}
      title="Sequencer details"
      middleHeader
    >
      <div className="c flex flex-col gap-32 items-center">
        <span className="f-12 align-center">Please describe the basic information of your Sequencer</span>
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex-2 f-14">Logo</div>
          <div className="flex flex-row items-center flex-3 gap-80">
            <div className="avatar" />
            <Button className="metis-solid" style={{ height: 'fit-content' }}>
              <div
                style={{
                  padding: '14px 27px',
                  color: 'rgba(0, 210, 193, 1)',
                }}
              >
                Upload
              </div>
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex-2  f-14">Website</div>
          <Input solid className="flex-3" />
        </div>

        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex-2 f-14">Decription</div>
          <Input solid className="flex-3" />
        </div>

        <Button className="" type="metis">
          <div className="" style={{ padding: '14px 102px' }}>
            Save
          </div>
        </Button>
      </div>
    </Container>
  );
};
export default DetailModal;
