import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../const';

function createSortListTemplate() {
  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--${SortType.ALL}">
    <input
      id="sort-${SortType.ALL}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${SortType.ALL}">
    <label data-sort-type=${SortType.ALL} class="trip-sort__btn" for="sort-${SortType.ALL}">${SortType.ALL}</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--${SortType.EVENT}">
    <input
      id="sort-${SortType.EVENT}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${SortType.EVENT}">
    <label data-sort-type=${SortType.EVENT} class="trip-sort__btn" for="sort-${SortType.EVENT}">${SortType.EVENT}</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--${SortType.EVENT}">
    <input
      id="sort-${SortType.TIME}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${SortType.TIME}">
    <label data-sort-type=${SortType.TIME} class="trip-sort__btn" for="sort-${SortType.TIME}">${SortType.TIME}</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--${SortType.PRICE}">
    <input
      id="sort-${SortType.PRICE}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${SortType.PRICE}">
    <label data-sort-type=${SortType.PRICE} class="trip-sort__btn" for="sort-${SortType.PRICE}">${SortType.PRICE}</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--${SortType.OFFERS}">
    <input
      id="sort-${SortType.OFFERS}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${SortType.OFFERS}">
    <label data-sort-type=${SortType.OFFERS} class="trip-sort__btn" for="sort-${SortType.OFFERS}">${SortType.OFFERS}</label>
  </div>
  </form>`;
}

export default class SortListView extends AbstractView {
  get template() {
    return createSortListTemplate();
  }
}
