import AbstractView from '../framework/view/abstract-view.js';
import { TYPES } from '../const.js';
import { capitalizeFirstLetter } from '../utils/common.js';

function createPointEditView(point, destinations, typeOffers) {
  const {basePrice, type, destination, offers} = point;
  const currentDestination = destinations ? destinations.find((dest) => dest.id === destination) : '';
  const typeOffer = typeOffers ? typeOffers.find((item) => item.type === type) : '';
  const checkedOffers = typeOffer ? typeOffer.offers.filter((offer) => offers.includes(offer.id)) : '';

  return `
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${TYPES.map((item) => {
    const capitalizedItem = capitalizeFirstLetter(item);
    return `
              <div class="event__type-item">
                <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
                <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${capitalizedItem}</label>
              </div>
            `;
  }).join('')}


        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input
        class="event__input  event__input--destination"
        id="event-destination-1"
        type="text"
        name="event-destination"
        value="${currentDestination.name}"
        list="destination-list-1">
      <datalist id="destination-list-1">
       ${destinations ? destinations.map((dest) => `
       <option value='${dest.name}'></option>
       `) : ''}

      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${typeOffer ? typeOffer.offers.map((offer) => `
      <div class="event__offer-selector">
        <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-luggage-1"
        type="checkbox"
        name="event-offer-luggage"
        ${checkedOffers.map((item) => item.id === offer.id).join(' ') ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join(' ') : ''}
      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description"></p>
    </section>
  </section>
</form>`;
}

export default class PointEditView extends AbstractView {
  #point = null;
  #destinations = null;
  #typeOffers = null;

  #handleFormSubmit = null;
  #handlePointClick = null;


  constructor({point, destinations, typeOffers, onFormSubmit, onPointClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#typeOffers = typeOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handlePointClick = onPointClick;


    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#pointClickHandler);
  }

  get template() {
    return createPointEditView(this.#point, this.#destinations, this.#typeOffers);
  }

  setHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };

  #pointClickHandler = (evt) => {
    evt.preventDefault();
    this.#handlePointClick();
  };
}
