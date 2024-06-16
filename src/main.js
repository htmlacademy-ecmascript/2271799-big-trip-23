import Presenter from './presenter/presenter.js';
import PointModel from './model/point-model.js';
import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButton from './view/new-point-button.js';
import { render } from './framework/render.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic hS2sf044wcl3sa44fgt4j';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';

const headerElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const pointModel = new PointModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();
pointModel.init();

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  filterModel,
  pointsModel: pointModel,
});
console.log(pointModel, 'main');
const presenter = new Presenter({
  container: mainElement,
  pointModel,
  destinationsModel,
  offersModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const newPointButtonComponent = new NewPointButton({
  onClick: handleNewPointButtonClick
});

function handleNewPointButtonClick() {
  presenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

render(newPointButtonComponent, headerElement);
presenter.init();
filterPresenter.init();
