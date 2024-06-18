import dayjs from 'dayjs';
import { FilterType } from '../const';

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// const filter = {
//   [FilterType.EVERYTHING]: (points) => points,
//   [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),
//   [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs())),
//   [FilterType.PRESENT]: (points) => points.filter((point) => dayjs(point.dateFrom).isBefore(dayjs()) && dayjs(point.dateTo).isAfter(dayjs()))
// };

function getDifferenceInMinutes(start, end) {
  return dayjs(end).diff(dayjs(start), 'minute');
}

const TimeInMilliseconds = {
  HOUR: 3600000,
  DAY: 86400000,
};

const isEventOver = (dueDate) => dueDate && dayjs(dueDate).isBefore(dayjs(new Date() - TimeInMilliseconds.DAY));

const isFutureEvent = (dueDate) => dueDate && dayjs(dueDate).isAfter(dayjs(new Date() + TimeInMilliseconds.DAY));

const isPresentEvent = (dateFrom, dateTo) => dayjs(dateFrom).isSameOrBefore(dayjs(), 'D') && dayjs(dateTo).isSameOrAfter(dayjs(), 'D');


const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureEvent(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isEventOver(point.dateTo)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentEvent(point.dateFrom, point.dateTo)),
};

export {filter, getDifferenceInMinutes};
