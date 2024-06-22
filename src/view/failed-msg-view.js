import AbstractView from '../framework/view/abstract-view.js';

function createFailedMsgTemplate() {
  return (
    `<p class="trip-events__msg">Failed to load latest route information</p>
    `
  );
}

export default class FailedMsgView extends AbstractView {
  get template() {
    return createFailedMsgTemplate();
  }
}
