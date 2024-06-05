import {render} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortListView from '../view/sort-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './pointPresenter.js';
import { updateItem } from '../utils/common.js';

export default class Presenter {
  #pointListComponent = new PointListView();
  #sortComponent = new SortListView();
  #noPointComponent = new NoPointView();

  #container = null;
  #pointModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;

  #points = [];

  #pointPresenters = new Map();

  constructor({container, pointModel, destinationsModel, offersModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#renderBoard();
  }


  #renderSort() {
    render(this.#sortComponent, this.#container);
  }

  #renderPoint(point, destinations, typeOffers) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handlePointChange
    });

    pointPresenter.init(point, destinations, typeOffers);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

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
  }

  #renderBoard() {
    this.#points = this.#pointModel.points;
    this.#destinations = this.#destinationsModel.destinations;
    this.#offers = this.#offersModel.offers;

    this.#renderSort();
    render(this.#pointListComponent, this.#container);

    for (const point of this.#points) {
      this.#renderPoint(point, this.#destinations, this.#offers);
    }

    if(this.#renderPoint.length === 0) {
      this.#renderNoPoint();
    }
  }

}

