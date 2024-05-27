import {render, replace} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortListView from '../view/sort-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import NoPointView from '../view/no-point-view.js';
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
    this.#renderBoard();
  }

  #renderBoard() {
    const points = this.#pointModel.points;
    const destinations = this.#destinationsModel.destinations;
    const offers = this.#offersModel.offers;

    render(new SortListView(), this.#container);
    render(this.#pointListComponent, this.#container);

    for (const point of points) {
      this.#renderPoint(point, destinations, offers);
    }

    if(this.#renderPoint.length === 0) {
      render(new NoPointView(), this.#pointListComponent);
    }
  }


  #renderPoint(point, destinations, typeOffers) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      destinations,
      typeOffers,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new PointEditView({
      point,
      destinations,
      typeOffers,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onPointClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#pointListComponent.element);
  }
}
