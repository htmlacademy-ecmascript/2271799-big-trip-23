import dayjs from 'dayjs';
import { FilterType } from '../const';

// const filter = {
//   [FilterType.EVERYTHING]: (points) => points,
//   [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),
//   [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs())),
//   [FilterType.PRESENT]: (points) => points.filter((point) => dayjs(point.dateFrom).isBefore(dayjs()) && dayjs(point.dateTo).isAfter(dayjs()))
// };

function getDifferenceInMinutes(start, end) {
  return dayjs(end).diff(dayjs(start), 'minute');
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}

function isPointPresent(point) {
  return dayjs().isBefore(point.dateTo) && dayjs().isAfter(point.dateFrom);
}

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

export {filter, getDifferenceInMinutes};
