import React, { useState } from 'react';
import { chartStartDate } from 'constants/chart';

import {
  DateInput,
  Container,
  OffsetContainer,
  OffsetDate,
} from './StockCalendar.styles';

const StockCalendar = ({ startDate, setStartDate, endDate, setEndDate }) => {
  const [radioId, setRadioId] = React.useState(1);
  const setRadio = (id) => setRadioId(id);

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
  return (
    <Container>
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
      <OffsetContainer>
        <OffsetDate isChecked={radioId === 1} onClick={() => setRadio(1)} />
        <span>옵션1</span>
        <OffsetDate isChecked={radioId === 2} onClick={() => setRadio(2)} />
        <span>옵션2</span>
      </OffsetContainer>
    </Container>
  );
};

export default StockCalendar;
