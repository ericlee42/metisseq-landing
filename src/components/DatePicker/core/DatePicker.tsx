/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import classNames from 'classnames';
import { getImageUrl } from '@/utils/tools';
import dayjs, { Dayjs } from 'dayjs';
// import locale from 'dayjs/locale/zh-cn';
import localeEn from 'dayjs/locale/en';

import weekday from 'dayjs/plugin/weekday';
import toObject from 'dayjs/plugin/toObject';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(weekday);
dayjs.extend(toObject);
dayjs.extend(isToday);

const LOCALE_DAYJS = {
  'en-US': localeEn,
};

interface DayType {
  date: Dayjs;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isCurrentDay: boolean;
  isMonthStartDay: boolean;
  isMonthEndDay: boolean;
  isWeekStartDay: boolean;
  isWeekEndDay: boolean;
  isInsideRange?: boolean;
  isOuterRange?: boolean;
  isMinDateInRange?: boolean;
  isMaxDateInRange?: boolean;
  isInRangeHover?: boolean;
  isStartRangeHover?: boolean;
  isEndRangeHover?: boolean;
}

export interface CalendarProps {
  value?: number;
  isForRange?: boolean;
  rangeDateList?: number[];
  hoverRangeDateList?: number[];
  propMonth?: Dayjs;
  onChange?: (date: dayjs.Dayjs) => any;
  onChangeMonth?: (firstDate: Dayjs) => any;
  onOver?: (date: number) => any;
}

type WeekType = DayType[];

const Calendar = (props: CalendarProps) => {
  const { value, onChange, isForRange, rangeDateList, hoverRangeDateList, onChangeMonth, onOver, propMonth } = props;

  const defaultMonth = (value ? dayjs(value) : dayjs()).locale(LOCALE_DAYJS['en-US']);
  const [currentMonth, setCurrentMonth] = React.useState<Dayjs>(propMonth || defaultMonth);

  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(value ? dayjs(value) : dayjs());
  const [arrayOfDays, setArrayOfDays] = React.useState<WeekType[]>([]);

  const handlePrevMonth = (params: 'month' | 'year') => {
    const minus = (currentMonth as Dayjs).subtract(1, params);

    if (isForRange === true) {
      typeof onChangeMonth === 'function' && onChangeMonth(minus);
      return;
    }

    setCurrentMonth(minus);
  };

  const handleNextMonth = (params: 'month' | 'year') => {
    const plus = currentMonth.add(1, params);
    if (isForRange === true) {
      typeof onChangeMonth === 'function' && onChangeMonth(plus);
      return;
    }
    setCurrentMonth(plus);
  };

  const handleClickCells = (day: DayType) => {
    if (day.isOuterRange || !day.isCurrentMonth) {
      return;
    }
    setSelectedDate(day.date);
    typeof onChange === 'function' && onChange(day.date);
  };

  const handleMouseOverCells = (day: DayType) => {
    if (isForRange !== true || rangeDateList === undefined || rangeDateList[1] !== undefined || !day.isCurrentMonth) {
      return;
    }
    typeof onOver === 'function' && onOver(day.date.valueOf());
  };

  const getCellClassNames = (d: DayType) => {
    const isHoverEdgeStart = d.isInRangeHover && (d.isMonthStartDay || d.isWeekStartDay);
    const isHoverEdgeEnd = d.isInRangeHover && (d.isMonthEndDay || d.isWeekEndDay);
    const isSelected = d.isMinDateInRange || d.isMaxDateInRange || d.isCurrentDay;
    return classNames(
      'cell',
      { disabled: !d.isCurrentMonth },
      { cell__selected: isSelected },
      { cell__inview: d.isInsideRange },
      { cell__noSelect: d.isOuterRange },
      { start: d.isMinDateInRange },
      { end: d.isMaxDateInRange },
      { cell__hover: d.isInRangeHover || d.isStartRangeHover || d.isEndRangeHover },
      { 'cell__hover--start': d.isStartRangeHover },
      { 'cell__hover--end': d.isEndRangeHover },
      { 'cell__hover-edge--start': isHoverEdgeStart && (!isHoverEdgeEnd || isSelected) },
      { 'cell__hover-edge--end': isHoverEdgeEnd && (!isHoverEdgeStart || isSelected) },
      {
        'cell__hover--both':
          (isHoverEdgeStart && isHoverEdgeEnd && !isSelected) ||
          (d.isEndRangeHover && isHoverEdgeStart && !isSelected) ||
          (d.isStartRangeHover && isHoverEdgeEnd && !isSelected),
      },
    );
  };

  const formatDateObject = React.useCallback(
    (date: Dayjs) => {
      const clonedObject = { ...date.toObject() };
      const formatedObject: DayType = {
        date,
        day: clonedObject.date,
        month: clonedObject.months,
        year: clonedObject.years,
        isCurrentMonth: clonedObject.months === currentMonth.month(),
        isCurrentDay: date.isSame(selectedDate, 'day'),
        isMonthStartDay: date.isSame(date.startOf('month'), 'day'),
        isMonthEndDay: date.isSame(date.endOf('month'), 'day'),
        isWeekStartDay: date.isSame(date.startOf('week'), 'day'),
        isWeekEndDay: date.isSame(date.endOf('week'), 'day'),
        isInsideRange: false,
        isOuterRange: false,
        isMaxDateInRange: false,
        isMinDateInRange: false,
        isInRangeHover: false,
        isStartRangeHover: false,
        isEndRangeHover: false,
      };

      if (isForRange === true && Array.isArray(rangeDateList) && rangeDateList.length > 0) {
        const minDate: Dayjs = dayjs(rangeDateList[0]);
        formatedObject['isCurrentDay'] = date.isSame(minDate, 'day');

        if (Array.isArray(hoverRangeDateList) && hoverRangeDateList.length === 2 && rangeDateList.length === 1) {
          const maxHoverDate: Dayjs = dayjs(Math.max(...hoverRangeDateList));
          const minHoverDate: Dayjs = dayjs(Math.min(...hoverRangeDateList));
          formatedObject['isInRangeHover'] =
            date.isAfter(minHoverDate.subtract(1, 'day'), 'day') && date.isBefore(maxHoverDate.add(1, 'day'), 'day');
          formatedObject['isStartRangeHover'] = date.isSame(minHoverDate, 'day') && !date.isSame(maxHoverDate, 'day');
          formatedObject['isEndRangeHover'] = date.isSame(maxHoverDate, 'day') && !date.isSame(minHoverDate, 'day');
        }

        if (rangeDateList[1]) {
          const maxDate = dayjs(rangeDateList[1]);
          formatedObject['isInRangeHover'] = false;
          formatedObject['isEndRangeHover'] = false;
          formatedObject['isStartRangeHover'] = false;
          formatedObject['isMinDateInRange'] = date.isSame(minDate, 'day');
          formatedObject['isMaxDateInRange'] = date.isSame(maxDate, 'day');
          formatedObject['isInsideRange'] = date.isAfter(minDate, 'day') && date.isBefore(maxDate, 'day');
          formatedObject['isOuterRange'] = date.isBefore(minDate, 'day') && date.isAfter(maxDate, 'day');
          formatedObject['isCurrentDay'] = date.isSame(maxDate, 'day');
        }
      }

      return formatedObject;
    },
    [rangeDateList, currentMonth, selectedDate, isForRange, hoverRangeDateList],
  );

  const getAllDays = React.useCallback(() => {
    let currentDate = currentMonth.startOf('month').weekday(0);
    const nextMonth = currentMonth.add(2, 'month').month();

    const allDates: any = [];
    let weekDates: any = [];

    let weekCounter = 1;

    const pushWeekDates = () => {
      allDates.push(weekDates);
      weekDates = [];
      weekCounter = 0;
    };

    while (currentDate.weekday(0).toObject().months !== nextMonth) {
      const formated = formatDateObject(currentDate);

      weekDates.push(formated);

      if (weekCounter === 7) {
        pushWeekDates();
      }

      weekCounter++;
      currentDate = currentDate.add(1, 'day');
    }

    setArrayOfDays(allDates.slice(0, 6));
  }, [formatDateObject, currentMonth]);

  React.useEffect(() => {
    getAllDays();
  }, [getAllDays]);

  React.useEffect(() => {
    if (isForRange === true && propMonth) {
      setCurrentMonth(propMonth);
    }
  }, [propMonth, isForRange, getAllDays]);

  return (
    <div className={`component-datepicker-date ${isForRange === true ? '' : 'shadow'}`}>
      <div className="header flex flex-row items-center justify-center">
        <img
          src={getImageUrl('@/assets/images/profile/icon-DoubleLeftOutlined.svg')}
          alt="icon"
          onClick={() => handlePrevMonth('year')}
        />
        <img
          src={getImageUrl('@/assets/images/profile/icon-LeftOutlined.svg')}
          alt="icon"
          onClick={() => handlePrevMonth('month')}
        />
        <span>{currentMonth.format('MMM YYYY')}</span>
        <img
          src={getImageUrl('@/assets/images/profile/icon-RightOutlined.svg')}
          alt="icon"
          onClick={() => handleNextMonth('month')}
        />
        <img
          src={getImageUrl('@/assets/images/profile/icon-DoubleRightOutlined.svg')}
          alt="icon"
          onClick={() => handleNextMonth('year')}
        />
      </div>
      <ul className="week flex flex-row items-center justify-center">
        {[...Array(7).keys()].map((ele) => (
          <li key={ele}>{defaultMonth.weekday(ele).format('dd')}</li>
        ))}
      </ul>
      <div className="content">
        {arrayOfDays.map((week, index) => (
          <div className="flex flex-row items-center justify-center days" key={index}>
            {week.map((d, i) => (
              <div
                className={getCellClassNames(d)}
                key={i}
                onClick={() => handleClickCells(d)}
                onMouseOver={() => handleMouseOverCells(d)}
              >
                <div className="cell-inner">{d.day}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
