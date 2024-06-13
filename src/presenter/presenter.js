import {render, remove} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortListView from '../view/sort-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './pointPresenter.js';
import { updateItem } from '../utils/common.js';
import { sortPoints } from '../utils/sort.js';
import { SortType, UpdateType, UserAction } from '../const.js';

export default class Presenter {
  #pointListComponent = new PointListView();
  #sortComponent = null;
  #noPointComponent = new NoPointView();

  #container = null;
  #pointModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;

  #activeSortButton = SortType.ALL;

  #points = [];

  #pointPresenters = new Map();

  constructor({container, pointModel, destinationsModel, offersModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#activeSortButton) {
      case SortType.PRICE:
        return sortPoints([...this.#pointModel.points], SortType.PRICE);
      case SortType.TIME:
        return sortPoints([...this.#pointModel.points], SortType.TIME);
      case SortType.ALL:
        return sortPoints([...this.#pointModel.points], SortType.ALL);
    }
    return this.#pointModel.points;
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#pointPresenters.forEach((presenter) => presenter.destroy());
        this.#pointPresenters.clear();

        remove(this.#sortComponent);
        remove(this.#noPointComponent);
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        break;
    }
  };

  init() {
    this.#renderBoard();
  }

  #renderSort() {
    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new SortListView({
      currentSortType: this.#activeSortButton,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container, 'afterbegin');
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#activeSortButton === sortType) {
      return;
    }
    this.#activeSortButton = sortType;
    this.#clearPointList();
    this.#points = sortPoints(
      this.#pointModel.points,
      this.#activeSortButton
    );

    this.#renderSort();

    this.#points.forEach((point) => {
      this.#renderPoint(point, this.#destinations, this.#offers);
    });
  };

  #renderPoint(point, destinations, typeOffers) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point, destinations, typeOffers);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderNoPoint() {
    render(new NoPointView(), this.#pointListComponent);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#pointListComponent.element.innerHTML = '';
  }

  #renderBoard() {
    this.#clearPointList();
    this.#points = this.#pointModel.points;
    this.#destinations = this.#destinationsModel.destinations;
    this.#offers = this.#offersModel.offers;

    this.#renderSort();
    render(this.#pointListComponent, this.#container);

    if(this.#points.length === 0) {
      this.#renderNoPoint();
    } else {
      this.#points.forEach((point) => {
        this.#renderPoint(point, this.#destinations, this.#offers);
      });
    }
  }
}
