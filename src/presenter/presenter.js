import { render } from '../render.js';
import PointListView from '../view/point-list-view.js';
import SortListView from '../view/sort-list-view.js';
import PointView from '../view/point-view.js';
import NewEventFormView from '../view/new-event-form-view.js';

export default class Presenter {
  pointListComponent = new PointListView();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(new SortListView(), this.container);
    render(this.pointListComponent, this.container);
    render(new NewEventFormView(), this.pointListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }
  }
}
