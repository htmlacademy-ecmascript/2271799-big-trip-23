import {render} from './framework/render.js';
import Presenter from './presenter/presenter.js';
import FilterListView from './view/filter-list-view.js';
import PointModel from './model/point-model.js';
import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';

const filterElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const pointModel = new PointModel();
const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();

const presenter = new Presenter({
  container: mainElement,
  pointModel,
  destinationsModel,
  offersModel
});

render(new FilterListView(), filterElement);

presenter.init();
