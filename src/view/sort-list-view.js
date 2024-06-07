import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../const';

const DISABLES_SORT_TYPES = [SortType.EVENT, SortType.OFFERS];

function createSortListTemplate({currentSortType}) {
  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${Object.values(SortType).map((sortType) => (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
    <input
      id="sort-${sortType}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${sortType}"
      ${sortType === currentSortType ? 'checked' : ''}
      ${DISABLES_SORT_TYPES.includes(sortType) ? 'disabled' : ''}>
    <label data-sort-type=${sortType} class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
  </div>`
  )).join(' ')}

  </form>`;
}

export default class SortListView extends AbstractView {
  #handleSortTypeChange = null;
  #activeSortType = null;

  constructor({onSortTypeChange, currentSortType}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#activeSortType = currentSortType;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortListTemplate({
      currentSortType: this.#activeSortType,
    });
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
