import React from 'react';
import { MaskingInput } from 'remember-ui';
import { chartStartDate } from 'constants/chart';

const StockCalendar = ({ startDate, setStartDate }) => {
  const handleChange = (e) => {
    const date = e.target.value;
    if (date.length === 10) {
      const newDate = new Date(date);
      const today = new Date();
      const _chartStartDate = new Date(chartStartDate);
      if (+newDate >= +_chartStartDate && +newDate <= +today) {
        setStartDate(date);
      }
    }
  };
  return (
    <>
      <div>시작 날짜가 휴일인 경우에는 그래프가 비어 보입니다.(TODO)</div>
      <MaskingInput
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
        label="시작 날짜"
        placeholder="8자리 숫자 입력(2015-01-02)"
      />
    </>
  );
};

export default StockCalendar;
