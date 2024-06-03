import {render} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortListView from '../view/sort-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './pointPresenter.js';

export default class Presenter {
  #pointListComponent = new PointListView();
  #sortComponent = new SortListView();
  #noPointComponent = new NoPointView();

  #container = null;
  #pointModel = null;
  #destinationsModel = null;
  #offersModel = null;

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
    });

    pointPresenter.init(point, destinations, typeOffers);
  }

  #renderNoPoint() {
    render(new NoPointView(), this.#pointListComponent);
  }

  #renderBoard() {
    const points = this.#pointModel.points;
    const destinations = this.#destinationsModel.destinations;
    const offers = this.#offersModel.offers;

    this.#renderSort();
    render(this.#pointListComponent, this.#container);

    for (const point of points) {
      this.#renderPoint(point, destinations, offers);
    }

    if(this.#renderPoint.length === 0) {
      this.#renderNoPoint();
    }
  }
}

