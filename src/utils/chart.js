import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { CalendarFormat } from 'constants/calendar';
import { LOCALE, CURRENCY } from 'constants/locale';
import { getRoundTwoPrecision } from 'utils/utils';

export const getPercent = (target, value) => {
  return getRoundTwoPrecision(
    ((parseInt(value, 10) - parseInt(target, 10)) / parseInt(target, 10)) * 100
  );
};

export const generateDayBetween = (startDate, endDate) => {
  let _start = dayjs(startDate).format(CalendarFormat);
  const _end = dayjs(endDate).format(CalendarFormat);
  const days = [];

  dayjs.extend(isSameOrBefore);
  while (dayjs(_start).isSameOrBefore(_end)) {
    days.push([_start, '0', '0', '0', '0', '0', '0']);
    _start = dayjs(_start).add(1, 'day').format(CalendarFormat);
  }

  return days;
};

export const getCurrency = (stock) => {
  const nation = (stock && stock[2]) || '';
  if (nation === LOCALE.KO) {
    return CURRENCY.KO;
  }
  if (nation === LOCALE.US) {
    return CURRENCY.US;
  }
  return '';
};

export const getIndexOfDayBetween = (stock, startDate, endDate) => {
  let startDateIndex = stock.findIndex(
    (el) => el[0] === dayjs(startDate).format(CalendarFormat)
  );
  startDateIndex = startDateIndex <= 0 ? 0 : startDateIndex;

  let endDateIndex = stock.findIndex(
    (el) => el[0] === dayjs(endDate).format(CalendarFormat)
  );
  endDateIndex = endDateIndex <= 0 ? stock.length - 1 : endDateIndex;
  return { startDateIndex, endDateIndex };
};

export const getTargetDateValue = (stock, targetDate) => {
  let value = null;
  if (stock.find((el) => el[0] === targetDate)) {
    value = parseInt(stock.find((el) => el[0] === targetDate)[4], 10);
  }
  if (!value || value === 0) {
    const _valueDate = stock.find((el) => el[4] !== '0');
    value = _valueDate ? _valueDate[4] : null;
  }
  return value;
};

export const getMinMaxValue = (stock) => {
  const values = stock
    .map((el) => {
      if (el[4] !== '0') return parseInt(el[4], 10);
      return null;
    })
    .filter((el) => el);

  const minValue = parseInt(Math.min(...values), 10);
  const maxValue = parseInt(Math.max(...values), 10);
  return { minValue, maxValue };
};
