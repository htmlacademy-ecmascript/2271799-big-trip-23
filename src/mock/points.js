import { getRandomArrayElement } from '../utils/common';

const mockPoints = [
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2807c',
    basePrice: 300,
    dateFrom: '2024-04-20T14:55:56.845Z',
    dateTo: '2024-04-24T11:22:13.375Z',
    destination: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa31',
      'b4c3e4e6-9053-42ce-b747-e281314baa33',
      'b4c3e4e6-9053-42ce-b747-e281314baa34'
    ],
    type: 'train'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    basePrice: 1100,
    dateFrom: '2024-07-10T11:20:56.845Z',
    dateTo: '2024-07-11T11:50:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e05',
    isFavorite: true,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa31',
      'b4c3e4e6-9053-42ce-b747-e281314baa38'
    ],
    type: 'taxi'
  },
  {
    id: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e07',
    basePrice: 1209,
    dateFrom: '2024-08-10T08:55:56.845Z',
    dateTo: '2024-08-17T11:40:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e07',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa33'
    ],
    type: 'bus'
  }
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export {getRandomPoint};
