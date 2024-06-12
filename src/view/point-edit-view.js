import _ from 'lodash';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES } from '../const.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: '0',
  dateFrom: null,
  dateTo: null,
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight',
};

function createPointEditView(state, destinations, typeOffers) {
  const {point} = state;
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
                <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}"
                  ${item === type ? 'checked' : ''}>
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
      <p class="event__destination-description">${currentDestination.description}</p>
    </section>
  </section>
</form>`;
}

export default class PointEditView extends AbstractStatefulView {
  #destinations = null;
  #typeOffers = null;

  #handleFormSubmit = null;
  #handlePointClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;


  constructor({point = BLANK_POINT, destinations, typeOffers, onFormSubmit, onPointClick}) {
    super();
    this._state = point;
    this._setState(PointEditView.parsePointToState({point}));
    this.#destinations = destinations;
    this.#typeOffers = typeOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handlePointClick = onPointClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditView(this._state, this.#destinations, this.#typeOffers);
  }

  reset = (point) => this.updateElement({point});

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  _restoreHandlers = () => {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#pointClickHandler);

    // this.element.querySelector('.event__reset-btn')
    //   .addEventListener('click', this.#deleteClickHandler);

    // this.element.querySelector('form')
    //   .addEventListener('submit', this.#submitHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);


    // this.element.querySelector('.event__available-offers')
    //   ?.addEventListener('change', this.#offerChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.#setDatepickers();
  };

  setHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
  }

  #typeChangeHandler = (evt) => {
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offer: [],
      },
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.valueAsNumber,
        offer: []
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations ? this.#destinations.find((pointDestination) => pointDestination.name === _.capitalize(evt.target.value)) : '';
    const selectedDestinationId = (selectedDestination) ? selectedDestination.id : this._state.point.destination;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestinationId,
      }
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #pointClickHandler = (evt) => {
    evt.preventDefault();
    this.#handlePointClick();
  };

  #dateFromCloserHandler = ([userDate]) => {
    this._setState({
      data: {
        ...this._state.data,
        dateFrom: userDate
      }
    });
    this.#datepickerTo.set('minDate', this._state.data.dateFrom);
  };

  #dateToCloserHandler = ([userDate]) => {
    this._setState({
      data: {
        ...this._state.data,
        dateTo: userDate
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.data.dateTo);
  };

  #setDatepickers = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromCloserHandler,
        maxDate: this._state.point.dateTo,
      },
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToCloserHandler,
        minDate: this._state.point.dateFrom,
      },
    );
  };

  static parsePointToState = ({point}) => ({point});

  static parseStateToPoint = (state) => state.point;
}
