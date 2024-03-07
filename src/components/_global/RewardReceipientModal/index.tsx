/* eslint-disable max-len */
import { Button, Checkbox, Input, Modal, message } from '@/components';
import { defaultRewardRecipient } from '@/configs/common';
import useLock from '@/hooks/useLock';
import useSequencerInfo from '@/hooks/useSequencerInfo';
import useUpdate from '@/hooks/useUpdate';
import { recoilRewardRecipientModalVisible } from '@/models';
import { catchError, getImageUrl } from '@/utils/tools';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { styled } from 'styled-components';
import { Address, checksumAddress, isAddress } from 'viem';

const Container = styled(Modal)`
  .f-20-bold {
    font-size: 20px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: #333347;
    line-height: 30px;
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
      padding: 0 25px 25px;
    }
  }
`;

const RewardReceipientModal = () => {
  const { sequencerId } = useUpdate();

  const { sequencerInfo, runOnce } = useSequencerInfo();
  const [rewardRecipientModalVisible, setRewardRecipientModalVisible] = useRecoilState(
    recoilRewardRecipientModalVisible,
  );

  const onClose = () => {
    setRewardRecipientModalVisible(false);
  };
  const changeRecipientVisible = useMemo(
    () =>
      sequencerInfo?.sequencers?.rewardRecipient &&
      sequencerInfo?.sequencers?.rewardRecipient !== defaultRewardRecipient,
    [sequencerInfo?.sequencers?.rewardRecipient],
  );

  const { setRewardRecipient } = useLock();

  const [recipient, setRecipient] = useState<undefined | string>();
  const [checkbox, setCheckbox] = useState(false);
  const [doubleCheckbox, setDoubleCheckbox] = useState(false);

  const [errorMsg, setErrorMsg] = useState<undefined | string>();
  const [hintMsg, setHintMsg] = useState<undefined | string>();

  const handleRecipientChange = (v) => {
    if (!v) {
      setErrorMsg(undefined);
    }
    setRecipient(v);
  };

  useEffect(() => {
    if (rewardRecipientModalVisible && !!recipient) {
      const t = isAddress(recipient as Address);
      if (!t) {
        setErrorMsg(
          'You entered the wrong address, please check. The wrong address will cause you to lose the rewards and require you to recreate the sequencer.',
        );
        return;
      }
      const ifSameAddress =
        (recipient as Address)?.toLowerCase() ===
        (sequencerInfo?.sequencers?.rewardRecipient as Address)?.toLowerCase();
      if (ifSameAddress) {
        setHintMsg('You have changed the receiving address, which cannot be changed after confirmation.');
      }
      setErrorMsg(undefined);
    }
  }, [rewardRecipientModalVisible, recipient, sequencerInfo?.sequencers?.rewardRecipient]);

  const [handleSubmitRecipientChangeLoading, setHandleSubmitRecipientChangeLoading] = useState(false);
  const handleSubmitRecipientChange = async () => {
    if (hintMsg) {
      onClose?.();
      return;
    }
    try {
      setHandleSubmitRecipientChangeLoading(true);
      const t = isAddress(recipient as unknown as `0x${string}`);
      if (!t) {
        throw { message: 'Invalid Address', shortMessage: 'Invalid Address' };
      }

      const result = await setRewardRecipient({ sequencerId, recipient: checksumAddress(recipient as Address) });
      if (result?.status === 'success') {
        message.success('Success');
        onClose?.();
      } else {
        throw { message: 'Transaction Failed', shortMessage: 'Transaction Failed' };
      }
    } catch (e) {
      message.error(catchError(e));
    } finally {
      runOnce({ sequencerId: sequencerId, self: true });
      setHandleSubmitRecipientChangeLoading(false);
    }
  };

  useEffect(() => {
    if (!rewardRecipientModalVisible) {
      setRecipient(undefined);
      setCheckbox(false);
      setDoubleCheckbox(false);
      setErrorMsg(undefined);
    }
  }, [rewardRecipientModalVisible]);

  return (
    <Container
      visible={rewardRecipientModalVisible}
      onCancel={onClose}
      onClose={onClose}
      onOk={onClose}
      title="Claim Rewards"
      middleHeader
    >
      <div className="c flex flex-col gap-10 items-center w-full">
        <div className="fz-12">
          {changeRecipientVisible
            ? 'Changing Your Rewards Receiving Address'
            : 'Providing Your Rewards Receiving Address'}
        </div>
        <div className="w-full fz-12 p-10 bg-color-db161619 radius-10 flex flex-row gap-5 items-center">
          <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M28 24.5159C28 25.3241 27.417 25.9779 26.6999 25.984V26H1.32418V25.984L1.31216 25.986C0.588968 25.986 0 25.3281 0 24.5159C0 24.2211 0.0801316 23.9443 0.214352 23.7137L0.206339 23.7077L12.8952 0.663838L12.9012 0.669855C13.1198 0.264856 13.5392 0.00895185 13.999 0C14.4758 0 14.8905 0.2888 15.1208 0.715983L15.1289 0.709966L27.8157 23.7538L27.8077 23.7598C27.9337 23.9918 27.9999 24.2518 28 24.5159ZM15.7499 8.33508C15.7499 7.25008 14.9666 6.37164 13.999 6.37164C13.0314 6.37164 12.2501 7.25208 12.2501 8.33508V15.6894C12.2501 16.7724 13.0334 17.6509 14.001 17.6509C14.9686 17.6509 15.7519 16.7724 15.7519 15.6894V8.33508H15.7499ZM12.2481 21.0844C12.2481 19.9994 13.0334 19.121 13.999 19.121C14.9666 19.121 15.7499 20.0014 15.7499 21.0844C15.7499 22.1674 14.9666 23.0458 13.999 23.0458C13.0314 23.0458 12.2481 22.1694 12.2481 21.0844Z"
              fill="#DB1616"
            />
          </svg>
          <span>Reward will be claimed to this address on Metis Layer2.</span>{' '}
        </div>

        <div className="flex flex-col gap-5 w-full">
          <Input
            className="w-full"
            inputClassName="fz-12"
            solid
            value={recipient}
            onChange={handleRecipientChange}
            suffix={
              <div className="flex flex-row items-center gap-8">
                <img className="size-12" src={getImageUrl('@/assets/images/_global/ic_edit.svg')} />
              </div>
            }
          />
          {errorMsg ? <div className="mt-8 fz-12 color-FF0000">{errorMsg}</div> : null}
          {hintMsg ? <div className="mt-8 fz-12 color-000">{hintMsg}</div> : null}
        </div>

        <div className="flex flex-col gap-12 mt-24">
          {changeRecipientVisible ? null : (
            <div
              className="w-full flex flex-row items-center gap-5 p-10 radius-10"
              style={{ border: checkbox ? '1px solid #00EA5E' : '1px solid #858585' }}
            >
              <Checkbox checked={checkbox} onChange={(v) => setCheckbox(v)}>
                <div className="color-858585 fz-12">
                  <span className="color-000">Confirm</span> the default address is your lock-up address.
                </div>
              </Checkbox>
            </div>
          )}

          <div
            className="w-full flex flex-row items-center gap-5 p-10 radius-10"
            style={{ border: doubleCheckbox ? '1px solid #00EA5E' : '1px solid #858585' }}
          >
            <Checkbox checked={doubleCheckbox} onChange={(v) => setDoubleCheckbox(v)}>
              <div className="color-858585 fz-12">
                <span className="color-000">Confirm Double-check</span> ownership and accuracy of the address provided
                before submitting.
              </div>
            </Checkbox>
          </div>
        </div>

        <div className="mt-24 w-full flex flex-row items-center justify-between gap-12">
          {changeRecipientVisible ? (
            <Button
              style={{ padding: '14px 50px' }}
              type="metis-solid"
              onClick={onClose}
              className="flex-1 flex items-center justify-center"
            >
              <div className="flex items-center justify-center">Cancel</div>
            </Button>
          ) : null}
          <Button
            disabled={
              !recipient || !!errorMsg || (changeRecipientVisible ? !doubleCheckbox : !doubleCheckbox || !checkbox)
            }
            style={{ padding: '14px 50px' }}
            type="metis"
            onClick={handleSubmitRecipientChange}
            className="flex-1 flex items-center justify-center"
            loading={handleSubmitRecipientChangeLoading}
          >
            <div className="flex items-center justify-center">
              {changeRecipientVisible ? 'Confirm' : 'Confirm Address'}
            </div>
          </Button>
        </div>
      </div>
    </Container>
  );
};
export default RewardReceipientModal;
