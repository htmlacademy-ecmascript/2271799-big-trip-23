import dayjs from 'dayjs';

const TIME_FORMAT = 'H:m';
const DATE_FORMAT = 'MMM DD';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDueTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORMAT) : '';
}

function humanizePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

export {getRandomArrayElement, humanizePointDueDate, humanizePointDueTime};

