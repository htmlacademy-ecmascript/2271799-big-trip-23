import AbstractView from '../framework/view/abstract-view';

function createNewPointButton() {
  return (
    `<button class='trip-main__event-add-btn  btn  btn--big  btn--yellow' type='button'>
    New event</button>`
  );
}

export default class NewPointButton extends AbstractView {
  #handleClick = null;

  constructor ({onClick}) {
    super();
    this.#handleClick = onClick;

    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButton();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
