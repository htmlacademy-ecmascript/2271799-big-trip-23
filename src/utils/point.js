import dayjs from 'dayjs';

const TIME_FORMAT = 'H:m';
const DATE_FORMAT = 'MMM DD';


function humanizePointDueTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORMAT) : '';
}

function humanizePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

export {humanizePointDueDate, humanizePointDueTime};
