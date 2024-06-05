function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {getRandomArrayElement, capitalizeFirstLetter, updateItem};
