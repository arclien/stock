import { CalendarFormat } from 'constants/calendar';
import dayjs from 'dayjs';

export const getTodayDate = () => dayjs().format(CalendarFormat);

export const isWeekend = (date) =>
  dayjs(date).day() === 0 || dayjs(date).day() === 6;

export const getDayOfWeek = (date) => dayjs(date).day();

export const getAdjustDateToWeekDay = (date) => {
  const day = getDayOfWeek(date);
  let index = day === 0 ? 2 : 1;
  return dayjs(date).subtract(index, 'day').format(CalendarFormat);
};
