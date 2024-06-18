import dayjs from 'dayjs';
// import { SortType } from '../const';

// const getTimeDiff = ({dateFrom, dateTo}) => (new Date(dateTo)).getTime() - (new Date(dateFrom)).getTime();

const getTimeDifference = ({dateFrom, dateTo}) => dayjs(dateTo).diff(dayjs(dateFrom));

const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortByTime = (pointA, pointB) => getTimeDifference(pointB) - getTimeDifference(pointA);

const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);

// const sortPointsBy = {
//   [SortType.ALL]: (points) => [...points],
//   [SortType.PRICE]: (points) => [...points].sort((a, b) => b.basePrice - a.basePrice),
//   [SortType.TIME]: (points) => [...points].sort((a, b) => getTimeDiff(b) - getTimeDiff(a)),
// };

// const sortPoints = (points, sortType) => sortPointsBy[sortType](points);

export {sortByDay, sortByPrice, sortByTime};
