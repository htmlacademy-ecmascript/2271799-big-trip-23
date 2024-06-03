function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export {getRandomArrayElement, capitalizeFirstLetter};
