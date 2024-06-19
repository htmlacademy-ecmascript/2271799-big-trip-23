import { render, replace, remove } from '../framework/render';
import { FilterType, UpdateType } from '../const';
import { filter } from '../utils/filter';
import FilterListView from '../view/filter-list-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #currentFilter = FilterType.EVERYTHING;
  #filterComponent = null;

  constructor ({filterContainer, filterModel, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const point = this.#pointsModel.points;

    return Object.entries(filter).map(([typeFilter, filterPoints]) => ({
      type: typeFilter,
      isChecked: typeFilter === this.#currentFilter,
      isDisabled: filterPoints(point).length === 0
    }));
  }

  init() {
    const filters = this.filters;

    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterListView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (typeFilter) => {
    if (this.#filterModel.filter === typeFilter) {
      return;
    }
    this.#currentFilter = typeFilter;

    this.#filterModel.set(UpdateType.MAJOR, typeFilter);
    this.init();
  };
}
