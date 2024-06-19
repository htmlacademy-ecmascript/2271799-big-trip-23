import {render, remove, RenderPosition} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortListView from '../view/sort-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { sortByDay, sortByPrice, sortByTime } from '../utils/sort.js';
import { FilterType, SortType, TimeLimit, UpdateType, UserAction } from '../const.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-button-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class Presenter {
  #loadingComponent = new LoadingView();
  #pointListComponent = new PointListView();
  #sortComponent = null;
  #noPointComponent = null;

  #container = null;
  #filterModel = null;

  #filterType = FilterType.EVERYTHING;
  #activeSortButton = SortType.ALL;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #points = [];

  #pointPresenters = new Map();
  #newPointPresenter = null;

  #isLoading = true;

  constructor({container, pointModel, filterModel, onNewPointDestroy}) {
    this.#container = container;
    this.#points = pointModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
      pointsModel: this.#points
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
        filteredPoints.sort(sortByPrice);
        break;
      case SortType.TIME:
        filteredPoints.sort(sortByTime);
        break;
      case SortType.ALL:
        filteredPoints.sort(sortByDay);
    }
    return filteredPoints;
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#points.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id);
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#points.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#points.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id);
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#activeSortButton = SortType.ALL;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderSort() {
    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new SortListView({
      currentSortType: this.#activeSortButton,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#activeSortButton === sortType) {
      return;
    }
    this.#activeSortButton = sortType;
    this.#renderSort();
    this.#clearPointList();

    this.points.forEach((point) => {
      this.#renderPoint(point, this.#points.destinations, this.#points.offers, this.#points);
    });
  };

  #renderPoint(point, destinations, typeOffers, pointModel) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      pointModel: this.#points
    });
    pointPresenter.init(point, destinations, typeOffers, pointModel);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoint() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent, this.#container);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#pointListComponent.element.innerHTML = '';
    remove(this.#loadingComponent);
    remove(this.#noPointComponent);
  }

  #renderBoard() {
    this.#clearPointList();

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(this.points.length === 0) {
      this.#renderNoPoint();
    } else {
      this.points.forEach((point) => {
        this.#renderPoint(point, this.#points.destinations, this.#points.offers, this.#points);
      });
    }

    this.#renderSort();
    render(this.#pointListComponent, this.#container);
  }

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
        this.#clearPointList();
        this.#activeSortButton = SortType.ALL;
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#noPointComponent);
        this.#renderBoard();
        break;
    }
  };
}
