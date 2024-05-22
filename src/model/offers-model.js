import { mockOffers } from '../mock/offers';

export default class OffersModel {
  #offers = mockOffers;

  get offers() {
    return this.#offers;
  }
}
