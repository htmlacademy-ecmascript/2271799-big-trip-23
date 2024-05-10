import {render} from './render.js';
import Presenter from './presenter/presenter.js';
import FilterListView from './view/filter-list-view.js';
import PointModel from './model/point-model.js';

const filterElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const pointModel = new PointModel();
const presenter = new Presenter({
  container: mainElement,
  pointModel
});

render(new FilterListView(), filterElement);

presenter.init();
