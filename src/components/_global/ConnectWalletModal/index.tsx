import Modal from '@/components/Modal';
import { injectedConnector, magicAuthConnector, particleConnector, web3AuthConnector } from '@/configs/wallet';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { getImageUrl } from '@/utils/tools';
import './index.scss';

const ConnectWalletModal = ({
  visible,
  onCancel,
  onOk,
}: {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}) => {
  const { connect, isConnected } = useAuth(true);
  useEffect(() => {
    if (isConnected) {
      onOk();
    }
  }, [isConnected]);
  return (
    <Modal title="Connect" visible={visible} onOk={onOk} onCancel={onCancel} className="connect-wallet-modal">
      <div className="flex flex-col w-full" style={{ gap: '24px' }}>
        <div
          className="flex flex-row w-full items-center pointer gap-8 connect-item"
          onClick={() =>
            connect({
              connector: injectedConnector,
            })
          }
        >
          <img src={getImageUrl('@/assets/images/_global/metamask.svg')} />
          <span>Metamask</span>
        </div>
        <div
          className="w-full flex flex-row items-center pointer gap-8 connect-item"
          onClick={() =>
            connect({
              connector: particleConnector,
            })
          }
        >
          {/* <img src={getImageUrl('@/assets/images/_global/particle.png')} /> */}
          <img
            src="https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F1871216767-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FF6uqWeUD7kwCZqSpBtVz%252Ficon%252FQOCttrIxed6mmev66hS2%252Flogo5.png%3Falt%3Dmedia%26token%3De6470b8b-906b-4da8-aa79-619ee168b2ea"
            alt=""
          />
          <span>Particle</span>
        </div>

        <div
          className="w-full flex flex-row items-center pointer gap-8 connect-item"
          onClick={() => {
            connect({
              connector: web3AuthConnector,
            });
            onCancel();
          }}
        >
          <img src={getImageUrl('@/assets/images/_global/web3auth.svg')} />
          <span>Web3Auth</span>
        </div>

        <div
          className="w-full flex flex-row items-center pointer gap-8 connect-item"
          onClick={() => {
            connect({
              connector: magicAuthConnector,
            });
            onCancel();
          }}
        >
          <img src={getImageUrl('@/assets/images/_global/magic.svg')} />
          <span>Magic Link</span>
        </div>

        {/* magicConnector */}
        {/* <div
          className="w-full flex flex-row items-center pointer gap-8 connect-item"
          onClick={() => {
            connect({
              connector: magicConnector,
            });
            onCancel();
          }}
        >
          <img src={getImageUrl('@/assets/images/_global/magic.svg')} />
          <span>Magic Link</span>
        </div> */}
      </div>
    </Modal>
  );
};

export default ConnectWalletModal;
