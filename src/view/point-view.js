import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDueDate, humanizePointDueTime } from '../utils';

function createPointTemplate(point, destinations, typeOffers) {
  const {isFavorite, basePrice, type, destination, dateFrom, dateTo, offers} = point;

  const currentDestination = destinations.find((dest) => dest.id === destination);
  const typeOffer = typeOffers.find((item) => item.type === type);
  const checkedOffers = typeOffer.offers.filter((offer) => offers.includes(offer.id));

  const startDate = dayjs(dateFrom);
  const endDate = dayjs(dateTo);
  const diff = endDate.diff(startDate);
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMin = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const diffDays = Math.ceil(diffHours / 24);

  return `
  <li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${humanizePointDueDate(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${currentDestination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time
          class="event__start-time"
          datetime="${dateFrom}">${humanizePointDueTime(dateFrom)}</time>
        &mdash;
        <time
          class="event__end-time"
          datetime="${dateTo}">${humanizePointDueTime(dateTo)}</time>
      </p>
      <p class="event__duration">${diffDays}D ${diffHours}H ${diffMin}M</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${checkedOffers.map((offer) =>
    `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
  ).join('')}
    </ul>
    <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
}

export default class PointView extends AbstractView {
  #point = null;
  #destinations = null;
  #typeOffers = null;

  constructor({point, destinations, typeOffers}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#typeOffers = typeOffers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#typeOffers);
  }
}
