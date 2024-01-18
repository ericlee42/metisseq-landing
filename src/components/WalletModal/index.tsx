import { styled } from 'styled-components';
import { Button, Select } from '..';
import useAuth from '@/hooks/useAuth';
import { injectedConnector } from '@/configs/wallet';
import { filterHideText } from '@/utils/tools';
import React from 'react';
import CheckSequencer from '../CheckSequencer';
import MyAccount from '../MyAccount';
import { generateAvatar } from '@/utils/jazzIcon';
import NetworkSelect from '../NetworkSelect';
import useDevice from '@/hooks/useDevice';

const Container = styled.div`
  .f-14 {
    font-size: 14px;
    line-height: 21px;
  }

  .p-14-53 {
    padding: 14px 53px;
  }
`;

const WalletModal = () => {
  const { connect, isConnected, isConnecting, address } = useAuth(true);

  const [claimable, setClaimable] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const handleShow = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };

  const becomeSequencer = () => {
    handleShow();
    setClaimable(true);
  };

  const bridgeNow = () => {
    handleShow();
    setClaimable(false);
  };

  const showAccount = () => {
    if (!isConnected) {
      connect({ connector: injectedConnector });
    } else {
      handleShow();
    }
  };

  const { ifMobile } = useDevice()

  return (
    <Container className={`h-50 flex flex-row items-center z-1 ${ifMobile ? 'w-full' : ''}`}>
      <div className={`flex h-full ${ifMobile ? 'w-full flex-col gap-12' : 'flex-row items-center '}`}>
        {
          (address && !ifMobile) ? <NetworkSelect /> : null
        }
        <div className={`${ifMobile ? 'w-full' : ''} flex flex-row items-center bg-color-000 radius-40 pl-6 ${address ? 'pr-25' : 'pr-6'} h-full z-1`}>
          <Button onClick={showAccount} className={ifMobile ? 'h-50 w-full' : ''}>
            <div className="flex flex-row items-center gap-9">
              {
                address ? <img className="radiusp-50 s-38" src={generateAvatar(address || '', 200)} /> : null
              }

              <div className="fz-18 fw-500 color-fff">
                {isConnected
                  ? filterHideText(address as string, 8, 2)
                  : isConnecting
                    ? 'Loading...'
                    : 'Connect Wallet'}
              </div>
            </div>
          </Button>
        </div>

        {
          (address && ifMobile) ? <NetworkSelect /> : null
        }

      </div>
      {/* <Button
        type="solid"
        onClick={() => {
          if (isConnecting || isConnected) {
            handleShow()
            return;
          }
          connect({ connector: injectedConnector });
        }}
      >
        <div className="p-14-53 flex flex-row items-center gap-10">
          <div className="f-14">
            {isConnected
              ? filterHideText(address as string, 8, 2)
              : isConnecting
              ? "Loading..."
              : "Connect Wallet"}
          </div>
        </div>
      </Button> */}

      <MyAccount
        visible={visible}
        claimable={claimable}
        onClose={handleClose}
        onOk={handleClose}
      />
    </Container>
  );
};

export default WalletModal;
