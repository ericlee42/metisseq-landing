import * as React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Scrollbar } from '@/components';
import Header from './Header';
import '@/assets/styles/index.scss';
import Footer from './Footer';
import useUpdate from '@/hooks/useUpdate';
import useAuth from '@/hooks/useAuth';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import SubHeader from './SubHeader';
import useBlock from '@/hooks/useBlock';
import useMetisPrice from '@/hooks/useMetisPrice';
import { useEffect } from 'react';
import { updateLocalChainId, defaultChainId } from '@/configs/common';
import { useNetwork } from 'wagmi';
import useDevice from '@/hooks/useDevice';

function BasicLayout() {
  const { address, chainId } = useAuth(true);
  const { run, cancel } = useBlock();
  const { chain } = useNetwork();
  const { sequencerId, run: updateRun, cancel: updateCancel } = useUpdate();
  const { allSequencerInfo, run: sequencerInfoRun, cancel: sequencerInfoCancel, getAllUserRun } = useSequencerInfo();
  const { run: getMetisPrice } = useMetisPrice();

  const seqAddress = React.useMemo(
    () =>
      (allSequencerInfo
        ? Object?.values?.(allSequencerInfo)?.find(
            (i: any) => address && i?.address && i?.address?.toLowerCase() === address?.toLowerCase(),
            // @ts-ignore
          )?.seq_addr
        : undefined),
    [address, allSequencerInfo],
  );

  useEffect(() => {
    if (chain) {
      updateLocalChainId((chain?.unsupported ? defaultChainId : chain?.id || defaultChainId)?.toString());
    }
  }, [chain]);

  React.useEffect(() => {
    if (chainId) {
      cancel();
      run(chainId);
    }
    getAllUserRun();

    return () => {
      cancel();
    };
  }, [chainId]);

  useEffect(() => {
    getMetisPrice();
  }, []);

  React.useEffect(() => {
    // if (!seqAddress) return;
    updateCancel();
    updateRun({ address, seqAddress });
    return () => {
      updateCancel();
    };
  }, [seqAddress, address, chainId]);

  React.useEffect(() => {
    // if (!sequencerId) return;
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

  return (
    <React.Fragment>
      <Header />
      {ifMobile ? null : <SubHeader />}
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
