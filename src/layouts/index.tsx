import '@/assets/styles/index.css';
import { Scrollbar } from '@/components';
import RewardReceipientModal from '@/components/_global/RewardReceipientModal';
import useAuth from '@/hooks/useAuth';
import useDevice from '@/hooks/useDevice';
import useL2Block from '@/hooks/useL2Block';
import useMetisPrice from '@/hooks/useMetisPrice';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useUpdate from '@/hooks/useUpdate';
import * as React from 'react';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import SubHeader from './SubHeader';

function BasicLayout() {
  const { address, chainId } = useAuth();
  const { sequencerId, run: updateRun, cancel: updateCancel } = useUpdate();
  const { allSequencerInfo, run: sequencerInfoRun, cancel: sequencerInfoCancel, getAllUserRun } = useSequencerInfo();

  const { run: getMetisPrice } = useMetisPrice();

  const ownerAddress = React.useMemo(
    () => (address ? allSequencerInfo?.[address?.toLowerCase?.()]?.address : undefined),
    [address, allSequencerInfo],
  );

  useEffect(() => {
    getMetisPrice();
  }, []);

  React.useEffect(() => {
    updateCancel();
    updateRun({ address, ownerAddress });
    return () => {
      updateCancel();
    };
  }, [ownerAddress, address, chainId]);

  React.useEffect(() => {
    sequencerInfoCancel();
    sequencerInfoRun({ sequencerId: sequencerId, self: true });
    return () => {
      sequencerInfoCancel();
    };
  }, [sequencerId, chainId, address]);

  const { hash, pathname } = useLocation();

  const { ifMobile } = useDevice();

  useEffect(() => {
    if (hash && ifMobile) {
      const ele = document.querySelectorAll(hash)?.[0];
      if (ele) {
        ele.scrollIntoView();
      }
    }
  }, [hash, pathname, ifMobile]);

  useL2Block(Number(chainId));
  useEffect(() => {
    getAllUserRun();
  }, [chainId]);

  return (
    <React.Fragment>
      <Header />
      {ifMobile ? null : <SubHeader />}

      <RewardReceipientModal />
      <Scrollbar id="vite-content" trackGap={[10, 10, 10, 10]}>
        <main>
          <Outlet />
        </main>
        <Footer />
      </Scrollbar>
    </React.Fragment>
  );
}

export default BasicLayout;
