import {render} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortListView from '../view/sort-list-view.js';
import PointView from '../view/point-view.js';
// import NewEventFormView from '../view/new-event-form-view.js';

export default class Presenter {
  #pointListComponent = new PointListView();

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
    const points = this.#pointModel.points;
    const destinations = this.#destinationsModel.destinations;
    const offers = this.#offersModel.offers;

    render(new SortListView(), this.#container);
    render(this.pointListComponent, this.#container);

    for (const point of points) {
      render(new PointView({point: point, destinations: destinations, typeOffers: offers}), this.#pointListComponent.element);
    }
  }
}
