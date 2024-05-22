import { mockDestinations } from '../mock/destination';

export default class DestinationModel {
  #destinations = mockDestinations;

  get destinations() {
    return this.#destinations;
  }
}
