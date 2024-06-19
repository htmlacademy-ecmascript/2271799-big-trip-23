import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES } from '../const.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { humanizePointDueDate } from '../utils/point.js';

const setButtonName = (id, isDeleting) => {
  if (!id) {
    return 'Cancel';
  }
  return isDeleting ? 'Deleting...' : 'Delete';
};

function createPointEditView(state, destinations, typeOffers) {
  const {point} = state;
  const {basePrice, type, destination, offers, isSaving, isDeleting, id, dateFrom, dateTo} = point;
  const typeOffer = typeOffers ? typeOffers.offers.find((item) => item.type === type) : '';
  const currentDestination = destinations ? destinations.find((dest) => dest.id === destination) : '';
  const checkedOffers = typeOffer.offers ? typeOffer.offers.filter((offer) => offers.includes(offer.id)) : '';

  return `
  <li class="trip-events__item">
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
        value="${currentDestination ? currentDestination.name : ''}"
        list="destination-list-1">
      <datalist id="destination-list-1">
       ${destinations ? destinations.map((dest) => `
       <option value='${dest.name}'></option>
       `).join('') : ''}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointDueDate(dateFrom)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointDueDate(dateTo)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>${isSaving ? 'Saving' : 'Save'}</button>
    <button class="event__reset-btn" type="reset"${isDeleting ? 'disabled' : ''}>${setButtonName(id, isDeleting)}</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>

  <section class="event__details">
  ${typeOffer.offers.length !== 0 ? `
  <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${typeOffers ? typeOffer.offers.map((offer) => `
      <div class="event__offer-selector">
        <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${offer.id}"
        type="checkbox"
        name="event-offer"
        data-offer-id="${offer.id}"
        ${checkedOffers.some((item) => item.id === offer.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join('') : ''}
      </div>
    </section>` : ''}

${currentDestination ? `
${currentDestination.description || currentDestination.pictures.length > 0 ? `
<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  ${currentDestination.description ? `<p class="event__destination-description">${currentDestination.description}</p>` : ''}
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${currentDestination.pictures ? currentDestination.pictures.map((item) => `<img class="event__photo" src="${item.src}" alt="${item.description}">`).join('') : ''}
    </div>
  </div>
</section>
` : ''}

` : ''}
  </section>
</form>
</li>`;
}

export default class PointEditView extends AbstractStatefulView {
  #destinations = null;
  #typeOffers = null;

  #handleFormSubmit = null;
  #handlePointClick = null;
  #handleDelete = null;

  #datepickerFrom = null;
  #datepickerTo = null;


  constructor({point, destinations, typeOffers, onFormSubmit, onPointClick, onDeleteClick}) {
    super();
    this._state = point;
    this._setState(PointEditView.parsePointToState({point}));
    this.#destinations = destinations;
    this.#typeOffers = typeOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handlePointClick = onPointClick;
    this.#handleDelete = onDeleteClick;

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
    const formElement = this.element.querySelector('form');
    formElement?.addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#pointClickHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.#setDatepickers();
  };

  #typeChangeHandler = (evt) => {
    const newType = evt.target.value;

    this._setState({
      point: {
        ...this._state.point,
        type: newType,
        offers: []
      },
    });
    this.updateElement(this._state);
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((dest) => dest.name === evt.target.value);
    if (selectedDestination) {
      this.updateElement({
        point: {
          ...this._state.point,
          destination: selectedDestination.id,
        },
      });
    }
  };

  #offerChangeHandler = () => {
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.dataset.offerId)
      }
    });
  };

  #priceChangeHandler = (evt) => {
    const updatedPrice = Number(evt.target.value);
    this._setState({
      point: {
        ...this._state.point,
        basePrice: updatedPrice,
      },
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #pointClickHandler = (evt) => {
    evt.preventDefault();
    this.#handlePointClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDelete(PointEditView.parseStateToPoint(this._state));
  };

  #setDatepickers = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
      },
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      },
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate,
      },
    });
  };

  static parsePointToState = ({point}) => ({point});
  static parseStateToPoint = (state) => state.point;
}
