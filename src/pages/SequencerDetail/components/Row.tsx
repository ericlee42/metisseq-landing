/* eslint-disable no-negated-condition */
import { IconGlobalSpin } from '@/assets/icons/IconGroup';
import { Tooltip } from '@/components';
import useDevice from '@/hooks/useDevice';
import useL2EpochStatus from '@/hooks/useL2EpochStatus';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';

const getSignedStatus = ({
  start,
  end,
  current,
}: {
  start: string | number;
  end: string | number;
  current: string | number;
}) => {
  if (BigNumber(current).gte(end)) return 'Done';
  if (BigNumber(current).lt(end) && BigNumber(current).gte(start)) return 'In Progress';
  return 'Pending';
};

const Row = ({ col }: { col: any }) => {
  const { ifMobile } = useDevice();
  const { l2Block: currentBlockNumber, l2BlockLoading } = useL2EpochStatus();
  return (
    <tr>
      <td>
        {col?.startBlock} - {col?.endBlock}
      </td>
      <td>
        {l2BlockLoading ? (
          <IconGlobalSpin color="#000" />
        ) : (
          <div
            style={{ width: 'fit-content' }}
            className={`pl-10 pr-10 radius-5 ${
              getSignedStatus({ start: col?.startBlock, end: col?.endBlock, current: currentBlockNumber }) === 'Done'
                ? 'bg-color-00DACC33'
                : 'bg-color-E9B26133'
            }`}
          >
            <span
              className={
                getSignedStatus({
                  start: col?.startBlock,
                  end: col?.endBlock,
                  current: currentBlockNumber,
                }) === 'Done'
                  ? 'success-color'
                  : 'pending-color'
              }
            >
              {getSignedStatus({ start: col?.startBlock, end: col?.endBlock, current: currentBlockNumber })}
            </span>
          </div>
        )}
      </td>
      <td>
        <span className="fw-700 inter">
          {getSignedStatus({
            start: col?.startBlock,
            end: col?.endBlock,
            current: currentBlockNumber,
          }) !== 'Done'
            ? 'Calculating'
            : `${col?.rewards} METIS`}
        </span>
      </td>
      <td>{dayjs.unix(col?.blockTimestamp).format('DD/MM/YYYY')}</td>
      {ifMobile ? null : <td>{dayjs.unix(col?.blockTimestamp).format('HH:mm:ss')}</td>}
    </tr>
  );
};
export default Row;
