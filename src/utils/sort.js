import { SortType } from '../const';

const getTimeDiff = ({dateFrom, dateTo}) => (new Date(dateTo)).getTime() - (new Date(dateFrom)).getTime();

const sortPointsBy = {
  [SortType.ALL]: (points) => [...points],
  [SortType.PRICE]: (points) => [...points].sort((a, b) => b.basePrice - a.basePrice),
  [SortType.TIME]: (points) => [...points].sort((a, b) => getTimeDiff(b) - getTimeDiff(a)),
};

const sortPoints = (points, sortType) => sortPointsBy[sortType](points);

export {sortPoints};
