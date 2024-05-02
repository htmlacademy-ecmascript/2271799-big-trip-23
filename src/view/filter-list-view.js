import {createElement} from '../render.js';

const FILTER_TYPES = ['Everything', 'Future', 'Present', 'Past'];

function createFilterItemTemplate(type) {
  return `
  <div class="trip-filters__filter">
    <input
      id="filter-${type}"
      class="trip-filters__filter-input visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}">
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>
  `;
}

function createFilterListTemplate() {
  return `
  <form class="trip-filters" action="#" method="get">
    ${FILTER_TYPES.map((type) => createFilterItemTemplate(type)).join('')}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
}

export default class FilterListView {
  getTemplate() {
    return createFilterListTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
