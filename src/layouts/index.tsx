/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import useMetisPrice from '@/hooks/useMetisPrice';
import { useEffect } from 'react';
import { defaultRewardRecipient, setL2Provider } from '@/configs/common';
import useDevice from '@/hooks/useDevice';
import RewardReceipientModal from '@/components/_global/RewardReceipientModal';
import { useSetRecoilState } from 'recoil';
import { recoilRewardRecipientModalVisible } from '@/models';
import useL2EpochStatus from '@/hooks/useL2EpochStatus';
import useL2Block from '@/hooks/useL2Block';
import BigNumber from 'bignumber.js';
import { getL2ChainIdByL1ChainId, getL2RpcByL1ChainId } from '@/utils/tools';

function BasicLayout() {
  const { address, chainId } = useAuth();
  const { sequencerId, run: updateRun, cancel: updateCancel } = useUpdate();
  const {
    sequencerInfo,
    allSequencerInfo,
    run: sequencerInfoRun,
    cancel: sequencerInfoCancel,
    getAllUserRun,
  } = useSequencerInfo();

  const { run: getMetisPrice } = useMetisPrice();

  const seqAddress = React.useMemo(
    () => (address ? allSequencerInfo?.[address?.toLowerCase?.()]?.seq_addr : undefined),
    [address, allSequencerInfo],
  );

  const rewardReceipient = React.useMemo(
    () => sequencerInfo?.sequencers?.rewardRecipient,
    [sequencerInfo?.sequencers?.rewardRecipient],
  );

  const setRewardRecipientModalVisible = useSetRecoilState(recoilRewardRecipientModalVisible);
  useEffect(() => {
    if (rewardReceipient && rewardReceipient === defaultRewardRecipient && BigNumber(sequencerId).gt(0)) {
      // set rewardReceipient
      setRewardRecipientModalVisible(true);
    }
  }, [rewardReceipient, sequencerId]);

  useEffect(() => {
    getMetisPrice();
  }, []);

  React.useEffect(() => {
    updateCancel();
    updateRun({ address, seqAddress });
    return () => {
      updateCancel();
    };
  }, [seqAddress, address, chainId]);

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

  const { watchBlock, l2Block } = useL2Block();
  const { checkSeqStatus, initL2Event } = useL2EpochStatus();

  useEffect(() => {
    if (l2Block) {
      checkSeqStatus();
    }
  }, [l2Block]);

  useEffect(() => {
    if (!chainId) return;

    setL2Provider(getL2RpcByL1ChainId(chainId), chainId);

    const initAsync = async () => {
      const handleOffL2Event = await initL2Event();
      const handleOffEvent = await watchBlock(getL2ChainIdByL1ChainId(+chainId));
      getAllUserRun();
      return () => {
        handleOffL2Event?.();
        handleOffEvent?.();
      };
    };

    let handleOffAllEvent;
    initAsync().then((offL2Event) => {
      handleOffAllEvent = offL2Event;
    });

    return () => {
      handleOffAllEvent?.();
    };
  }, [chainId]);

  // event
  // useContractEvent({
  //   ...contracts.lockInfo?.[chainId?.toString() as string],
  //   eventName: 'Locked',
  //   listener(logs: any) {
  //     const logSequencerId = logs?.args?.sequencerId;
  //     console.log('New logs!', logs, sequencerId, logSequencerId);
  //   },
  // });
  // useContractEvent({
  //   ...contracts.lockInfo?.[chainId?.toString() as string],
  //   eventName: 'Relocked',
  //   listener(logs: any) {
  //     const logSequencerId = logs?.args?.sequencerId;
  //     console.log('New logs!', logs, sequencerId, logSequencerId);
  //   },
  // });
  // useContractEvent({
  //   ...contracts.lockInfo?.[chainId?.toString() as string],
  //   eventName: 'Unlocked',
  //   listener(logs: any) {
  //     const logSequencerId = logs?.args?.sequencerId;
  //     console.log('New logs!', logs, sequencerId, logSequencerId);
  //   },
  // });
  // useContractEvent({
  //   ...contracts.lockInfo?.[chainId?.toString() as string],
  //   eventName: 'ClaimRewards',
  //   listener(logs: any) {
  //     const logSequencerId = logs?.args?.sequencerId;
  //     console.log('New logs!', logs, sequencerId, logSequencerId);
  //   },
  // });
  // useContractEvent({
  //   ...contracts.lockInfo?.[chainId?.toString() as string],
  //   eventName: 'UnlockInit',
  //   listener(logs: any) {
  //     const logSequencerId = logs?.args?.sequencerId;
  //     console.log('New logs!', logs, sequencerId, logSequencerId);
  //   },
  // });

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
