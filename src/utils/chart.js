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
