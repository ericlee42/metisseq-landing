import * as React from 'react';
import Calendar from './DatePicker';
import dayjs, { Dayjs } from 'dayjs';

import localeEn from 'dayjs/locale/en';

const LOCALE_DAYJS = {
  'en-US': localeEn,
};

export interface RangeCalendarProps {
  value?: number[];
  onChange: (timeStampList: number[]) => any;
}

const RangeCalendar = (props: RangeCalendarProps) => {
  const { value = [], onChange } = props;

  const now = dayjs(value[0]).locale(LOCALE_DAYJS['en-US']);
  const next = now.add(1, 'month');
  const currentStepRef = React.useRef(0);
  const [sequenceMonth, setSequenceMonth] = React.useState<Dayjs[]>([now, next]);
  const [rangeDateList, setRangeDateList] = React.useState<number[]>(value);
  const [hoverDateList, setHoverDateList] = React.useState<number[]>([]);

  const handleChooseDate = React.useCallback(
    (date: dayjs.Dayjs) => {
      let tempRangeDateList: number[] = [];

      const isMin = currentStepRef.current % 2 === 0;
      if (isMin) {
        tempRangeDateList = [date.startOf('day').valueOf()];
      } else {
        const prevTime = rangeDateList[0];
        const nowChooseTime = +date;
        if (prevTime <= nowChooseTime) {
          tempRangeDateList = [prevTime, date.endOf('day').valueOf()];
        } else {
          tempRangeDateList = [nowChooseTime, dayjs(prevTime).endOf('day').valueOf()];
        }
      }

      currentStepRef.current++;
      setRangeDateList(tempRangeDateList);

      if (tempRangeDateList.length === 2) {
        setHoverDateList([]);
      }

      if (typeof onChange === 'function' && !isMin) {
        onChange(tempRangeDateList);
      }
    },
    [setRangeDateList, rangeDateList, onChange],
  );

  const handleChangeMonth = React.useCallback(
    (type: 'left' | 'right', d: Dayjs) => {
      if (type === 'left') {
        setSequenceMonth([d, d.add(1, 'M')]);
      }
      if (type === 'right') {
        setSequenceMonth([d.subtract(1, 'M'), d]);
      }
    },
    [setSequenceMonth],
  );

  const handleHoverDate = React.useCallback(
    (date: number) => {
      if (rangeDateList.length !== 1) return;
      setHoverDateList([rangeDateList[0], date]);
    },
    [rangeDateList],
  );

  return (
    <div className="flex flex-row items-center justify-center">
      <Calendar
        isForRange
        value={rangeDateList[0]}
        propMonth={sequenceMonth[0]}
        onChange={handleChooseDate}
        onOver={handleHoverDate}
        rangeDateList={rangeDateList}
        hoverRangeDateList={hoverDateList}
        onChangeMonth={(d) => handleChangeMonth('left', d)}
      />
      <Calendar
        isForRange
        value={rangeDateList[1]}
        propMonth={sequenceMonth[1]}
        onChange={handleChooseDate}
        onOver={handleHoverDate}
        rangeDateList={rangeDateList}
        hoverRangeDateList={hoverDateList}
        onChangeMonth={(d) => handleChangeMonth('right', d)}
      />
    </div>
  );
};

export default RangeCalendar;
