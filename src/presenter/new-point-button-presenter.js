import {remove, render, RenderPosition} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import {UserAction, UpdateType, BLANK_POINT} from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #onDeleteClick = null;
  #pointEditComponent = null;
  #point = BLANK_POINT;
  #pointsModel = null;
  #ableNewPointButton = null;

  constructor ({pointListContainer, onDataChange, onDestroy, pointsModel, ableNewPointButton}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#pointsModel = pointsModel;
    this.#ableNewPointButton = ableNewPointButton;
  }

  init() {
    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destinations: this.#pointsModel.destinations,
      typeOffers: this.#pointsModel,
      onFormSubmit: this.#handleFormSubmit,
      onPointClick: this.#handleDeleteClick,
      onDeleteClick: this.#handleCancelClick,
    });

    render(this.#pointEditComponent, this.#pointListContainer.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleCancelClick = () => {
    this.destroy();
  };

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.querySelector('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    this.#pointEditComponent.shake();
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
    this.#ableNewPointButton();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
