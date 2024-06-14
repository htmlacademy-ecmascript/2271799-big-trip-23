import Presenter from './presenter/presenter.js';
import PointModel from './model/point-model.js';
import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const filterElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const pointModel = new PointModel();
const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  filterModel,
  pointsModel: pointModel,
});

const presenter = new Presenter({
  container: mainElement,
  pointModel,
  destinationsModel,
  offersModel,
  filterModel
});

presenter.init();
filterPresenter.init();
