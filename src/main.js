import Presenter from './presenter/presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButton from './view/new-point-button.js';
import { RenderPosition, render } from './framework/render.js';
import PointsApiService from './points-api-service.js';
import TripDetails from './view/trip-details.js';
import { FilterType } from './const.js';

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
  ableNewPointButton: handleNewPointFormClose,
});

const presenter = new Presenter({
  container: mainElement,
  pointModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
  newButtonDisable: makeNewButtonDisable
});

const newPointButtonComponent = new NewPointButton({
  onClick: handleNewPointButtonClick
});

function handleNewPointButtonClick() {
  filterModel.set('updateType', FilterType.EVERYTHING);
  presenter.createPoint();
  newPointButtonComponent.element.disabled = true;
  presenter.removeNoPointText();
}

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function makeNewButtonDisable() {
  newPointButtonComponent.element.disabled = true;
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
