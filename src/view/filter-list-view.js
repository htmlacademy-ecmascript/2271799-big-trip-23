import AbstractView from '../framework/view/abstract-view.js';


function createItemFilterTemplate(filter) {
  const {type, isChecked, isDisabled} = filter;
  return (
    `<div class="trip-filters__filter">
    <input
    id="filter-${type}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio"
    name="trip-filter"
    value="${type}"
    ${isChecked ? 'checked' : ''}
    ${isDisabled ? 'disabled' : ''}
    >
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`
  );
}
function createFilterListTemplate(filters) {
  return (
    `
      <form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => createItemFilterTemplate(filter)).join(' ')}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
}

export default class FilterListView extends AbstractView {
  #filters = null;
  #handleFilterTypeChange = null;
  #currentFilterType = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterListTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
