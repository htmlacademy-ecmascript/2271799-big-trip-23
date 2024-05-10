import { getRandomPoint } from '../mock/points';
import { mockDestinations } from '../mock/destination';
import { mockOffers } from '../mock/offers';

const POINT_COUNT = 3;

export default class PointModel {

  points = Array.from({length: POINT_COUNT}, getRandomPoint);
  destinations = mockDestinations;
  offers = mockOffers;

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
