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

  constructor ({pointListContainer, onDataChange, onDestroy, pointsModel}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destinations: this.#pointsModel.destinations,
      typeOffers: this.#pointsModel.getOffersByType(this.#point.type),
      onFormSubmit: this.#handleFormSubmit,
      onPointClick: this.#handleDeleteClick,
      onDeleteClick: this.#onDeleteClick,
    });

    render(this.#pointEditComponent, this.#pointListContainer.element, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      // eslint-disable-next-line no-useless-return
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
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.destroy();
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
