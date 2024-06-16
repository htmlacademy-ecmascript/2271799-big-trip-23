import {render, remove, RenderPosition} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortListView from '../view/sort-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { sortPoints } from '../utils/sort.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import { filter, getDifferenceInMinutes } from '../utils/filter.js';
import dayjs from 'dayjs';
import NewPointPresenter from './new-point-button-presenter.js';

export default class Presenter {
  #pointListComponent = new PointListView();
  #sortComponent = null;
  #noPointComponent = null;

  #container = null;
  // #pointModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;
  #filterModel = null;

  #filterType = FilterType.EVERYTHING;
  #activeSortButton = SortType.ALL;

  #points = [];

  #pointPresenters = new Map();
  #newPointPresenter = null;

  constructor({container, pointModel, destinationsModel, offersModel, filterModel, onNewPointDestroy}) {
    this.#container = container;
    this.#points = pointModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;


    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
      destinations: this.#destinations,
      offers: this.#offers
    });

    this.#points.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#points.points;
    const filteredPoints = filter[this.#filterType](points);
    switch (this.#activeSortButton) {
      case SortType.PRICE:
        filteredPoints.sort((a, b) => b.price - a.price);
        break;
      case SortType.TIME:
        filteredPoints.sort((a, b) => {
          const timeA = getDifferenceInMinutes(a.dateFrom, a.dateTo);
          const timeB = getDifferenceInMinutes(b.dateFrom, b.dateTo);
          return timeB - timeA;
        });
        break;
      case SortType.ALL:
        filteredPoints.sort((a, b) => {
          const dateA = dayjs(a.dateFrom).valueOf();
          const dateB = dayjs(b.dateFrom).valueOf();
          return dateA - dateB;
        });
    }
    return filteredPoints;
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#points.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#points.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#points.deletePoint(updateType, update);
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
      this.#points.points,
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
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderNoPoint() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });
    render(new NoPointView(), this.#pointListComponent, RenderPosition.AFTERBEGIN);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#pointListComponent.element.innerHTML = '';
  }

  createPoint() {
    this.#newPointPresenter.init();
    this.#activeSortButton = SortType.ALL;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  #renderBoard() {
    this.#clearPointList();
    // this.#points = this.#points.points;
    this.#destinations = this.#destinationsModel.destinations;
    this.#offers = this.#offersModel.offers;

    this.#renderSort();
    render(this.#pointListComponent, this.#container);

    // if(this.#points.length === 0) {
    //   this.#renderNoPoint();
    // } else {
    console.log(this.#points.points)

    this.#points.points.forEach((point) => {
      this.#renderPoint(point, this.#destinations, this.#offers);
    });
    // }
  }
}
