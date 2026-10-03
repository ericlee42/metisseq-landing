import { network } from '@/configs/wallet';
import useChainWatcher from '@/hooks/useChainWatcher';
import useDevice from '@/hooks/useDevice';
import { useEffect, useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { useConnection } from 'wagmi';
import { Select } from '..';

const Container = styled.div`
  .f-14 {
    font-size: 14px;
    line-height: 21px;
  }

  .p-14-53 {
    padding: 14px 53px;
  }
`;

const options = network?.map((i) => {
  return {
    ...i,
    label: i?.name,
    value: i?.id,
    name: i?.name,
  };
});

const NetworkSelect = () => {
  const { unsupported, setupNetwork } = useChainWatcher();

  const { chain } = useConnection();

  const [curOption, setCurOption] = useState<number>();

  const curOptionName = useMemo(() => options.find((i) => i.value === curOption)?.name, [curOption]);

  const handleOption = (ele: any) => {
    setCurOption(ele?.value);
  };
  const handleChange = async (ele: any) => {
    if (!ele?.value) return;
    try {
      await setupNetwork(ele?.value);
    } catch {}
  };

  useEffect(() => {
    const t = options.find((i) => i.id === chain?.id);
    if (t) {
      handleOption(t);
    }
  }, [chain?.id]);

  useEffect(() => {
    if (unsupported) {
      setupNetwork();
    } else if (!curOption) {
      if (chain?.id) {
        handleChange({ value: chain.id });
      } else {
        handleChange(options?.[0]);
      }
    }
  }, [curOption, unsupported, chain?.id]);

  const { ifMobile } = useDevice();

  if (ifMobile) {
    return (
      <Container className="h-50">
        <Select
          className="h-50 bg-color-00D2FF radius-40  pl-18 pr-60 z-0"
          style={{ transform: ifMobile ? '' : 'translate(25%, 0)' }}
          triggerClassName="w-full pl-0"
          type="primary"
          options={options}
          arrowPlacement="left"
          placement="right"
          value={curOption}
          renderSelector={<div className="fz-15 fw-500 color-000">{curOptionName}</div>}
          allowClear={false}
          placeholder={<div className="fz-15 fw-500 color-000">Wrong network</div>}
          onChange={(ele) => {
            handleChange?.(ele);
          }}
        />
      </Container>
    );
  }

  return (
    <Container className="h-full">
      <Select
        className="h-full bg-color-00D2FF radius-40  pl-18 pr-60 z-0"
        style={{ transform: 'translate(25%, 0)' }}
        triggerClassName="w-full pl-0"
        type="primary"
        options={options}
        arrowPlacement="left"
        placement="right"
        value={curOption}
        renderSelector={<div className="fz-15 fw-500 color-000">{curOptionName}</div>}
        allowClear={false}
        placeholder={<div className="fz-15 fw-500 color-000">Wrong network</div>}
        onChange={(ele) => {
          handleChange?.(ele);
        }}
      />
    </Container>
  );
};

export default NetworkSelect;
