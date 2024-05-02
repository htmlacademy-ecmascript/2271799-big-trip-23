import {render} from './render.js';
import Presenter from './presenter/presenter.js';
import FilterListView from './view/filter-list-view.js';

const filterElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-events');
const presenter = new Presenter({container: mainElement});

render(new FilterListView(), filterElement);

presenter.init();
