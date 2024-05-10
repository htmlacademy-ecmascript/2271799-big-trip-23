import { render } from '../render.js';
import PointListView from '../view/point-list-view.js';
import SortListView from '../view/sort-list-view.js';
import PointView from '../view/point-view.js';
import NewEventFormView from '../view/new-event-form-view.js';

export default class Presenter {
  pointListComponent = new PointListView();

  constructor({container, pointModel}) {
    this.container = container;
    this.pointModel = pointModel;
  }

  init() {
    const points = this.pointModel.getPoints();
    const destinations = this.pointModel.getDestinations();
    const offers = this.pointModel.getOffers();

    render(new SortListView(), this.container);
    render(this.pointListComponent, this.container);
    render(new NewEventFormView(), this.pointListComponent.getElement());

    for (const point of points) {
      render(new PointView({point: point, destinations: destinations, typeOffers: offers}), this.pointListComponent.getElement());
    }
  }
}
