import Presenter from './presenter/presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButton from './view/new-point-button.js';
import { RenderPosition, render } from './framework/render.js';
import PointsApiService from './points-api-service.js';
import TripDetails from './view/trip-details.js';

const AUTHORIZATION = 'Basic hS2sf044wcl3sa44fgt4j';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';

const headerElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const pointModel = new PointModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  filterModel,
  pointsModel: pointModel,
});

const presenter = new Presenter({
  container: mainElement,
  pointModel,
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

render(new TripDetails(), headerElement, RenderPosition.AFTERBEGIN);
filterPresenter.init();

async function init() {
  presenter.init();
  await pointModel.init().finally(() => {
    render(newPointButtonComponent, headerElement);
  });
}

init();
