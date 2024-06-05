import { remove, render, replace } from '../framework/render';
import PointEditView from '../view/point-edit-view';
import PointView from '../view/point-view';

export default class PointPresenter {
  #pointListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;

  #point = null;
  #destinations = null;
  #typeOffers = null;

  #handleDataChange = null;

  constructor({pointListContainer, onDataChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(point, destinations, typeOffers) {
    this.#point = point;
    this.#destinations = destinations;
    this.#typeOffers = typeOffers;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destinations: this.#destinations,
      typeOffers: this.#typeOffers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });
    this.#editPointComponent = new PointEditView({
      point: this.#point,
      destinations: this.#destinations,
      typeOffers: this.#typeOffers,
      onFormSubmit: this.#handleFormSubmit,
      onPointClick: this.#handleCancelEdit,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#editPointComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  #replacePointToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleCancelEdit = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
