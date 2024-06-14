import Observable from '../framework/observable';
import { SortType } from '../const';

export default class FilterModel extends Observable {
  #filter = SortType.ALL;

  get filter() {
    return this.#filter;
  }

  set(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
