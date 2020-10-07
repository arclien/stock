import React, { useState } from 'react';
import {
  defaultOffset,
  OffsetList,
  chartStartDate,
  CalendarFormat,
} from 'constants/calendar';
import dayjs from 'dayjs';
import { isWeekend, getAdjustDateToWeekDay } from 'utils/day';

import {
  DateInput,
  Container,
  OffsetContainer,
  OffsetDate,
  Cursor,
} from './StockCalendar.styles';

const StockCalendar = ({ startDate, setStartDate, endDate, setEndDate }) => {
  const [calendarOffset, setCalendarOffset] = useState(defaultOffset);

  const handleChange = (e) => {
    const target = e.target.name;
    const date = e.target.value;
    if (date.length === 10) {
      const newDate = new Date(date);
      const today = new Date();
      const _chartStartDate = new Date(chartStartDate);
      if (+newDate >= +_chartStartDate && +newDate <= +today) {
        target === 'startDate' ? setStartDate(date) : setEndDate(date);
      }
    }
  };

  const handleCalendarOffset = (offset, offsetValue) => {
    let date = dayjs(endDate, CalendarFormat);
    date = date.subtract(offsetValue, 'month');
    setCalendarOffset(offset);
    if (isWeekend(date)) {
      date = getAdjustDateToWeekDay(date);
    }
    setStartDate(dayjs(date).format(CalendarFormat));
  };

  const handleDateByOffset = (dir) => {
    let _endDate = dayjs(endDate, CalendarFormat);
    let _startDate = dayjs(startDate, CalendarFormat);
    const offsetValue = OffsetList.find((el) => el.name === calendarOffset)
      .value;
    if (dir === 'next') {
      _endDate = _endDate.add(offsetValue, 'month');
      _startDate = _startDate.add(offsetValue, 'month');
    } else if (dir === 'prev') {
      _endDate = _endDate.subtract(offsetValue, 'month');
      _startDate = _startDate.subtract(offsetValue, 'month');
    }

    if (isWeekend(_endDate)) {
      _endDate = getAdjustDateToWeekDay(_endDate);
    }
    if (isWeekend(_startDate)) {
      _startDate = getAdjustDateToWeekDay(_startDate);
    }
    setEndDate(dayjs(_endDate).format(CalendarFormat));
    setStartDate(dayjs(_startDate).format(CalendarFormat));
  };

  return (
    <Container>
      <Cursor onClick={() => handleDateByOffset('prev')}>{'<'}</Cursor>
      <DateInput
        mask={[
          /[0-9]/,
          /[0-9]/,
          /[0-9]/,
          /[0-9]/,
          '-',
          /[0-9]/,
          /[0-9]/,
          '-',
          /[0-9]/,
          /[0-9]/,
        ]}
        type="text"
        name="startDate"
        value={startDate}
        required
        onChange={handleChange}
        placeholder="8자리 숫자 입력(2015-01-02)"
      />
      ~
      <DateInput
        mask={[
          /[0-9]/,
          /[0-9]/,
          /[0-9]/,
          /[0-9]/,
          '-',
          /[0-9]/,
          /[0-9]/,
          '-',
          /[0-9]/,
          /[0-9]/,
        ]}
        type="text"
        name="endDate"
        value={endDate}
        required
        onChange={handleChange}
        placeholder="8자리 숫자 입력(2015-01-02)"
      />
      <Cursor onClick={() => handleDateByOffset('next')}>{'>'}</Cursor>
      <OffsetContainer>
        {OffsetList &&
          OffsetList.map((el) => (
            <>
              <OffsetDate
                isChecked={calendarOffset === el.name}
                onClick={() => handleCalendarOffset(el.name, el.value)}
              />
              <span>{el.name}</span>
            </>
          ))}
      </OffsetContainer>
    </Container>
  );
};

export default StockCalendar;
