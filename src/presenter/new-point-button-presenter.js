import {remove, render, RenderPosition} from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import {UserAction, UpdateType} from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #destinations = null;
  #onDeleteClick = null;
  #pointEditComponent = null;
  #offers = null;

  constructor ({pointListContainer, destinations, offers, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init() {
    // if (this.#pointEditComponent !== null) {
    //   // eslint-disable-next-line no-useless-return
    //   return;
    // }

    this.#pointEditComponent = new PointEditView({
      destinations: this.#destinations,
      typeOffers: this.#offers,
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
}
