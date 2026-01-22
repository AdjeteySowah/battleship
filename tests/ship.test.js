jest.mock('../src/modules/utils/constants.js', () => ({
  shipTypes: [
    { name: 'destroyer', length: 2 },
    { name: 'submarine', length: 3 },
  ],
}));

import { createShip } from '../src/modules/components/ship.js';

describe('createShip()', () => {
  test('creates a ship with correct length from shipTypes', () => {
    const ship = createShip('destroyer');
    expect(ship.length).toBe(2);
  });

  test('isSunk() is false before enough hits and true after exact hits', () => {
    const ship = createShip('submarine');
    expect(ship.isSunk()).toBe(false);

    ship.hit();
    expect(ship.isSunk()).toBe(false);

    ship.hit();
    expect(ship.isSunk()).toBe(false);

    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('returned object exposes hit and isSunk methods', () => {
    const ship = createShip('destroyer');
    expect(typeof ship.hit).toBe('function');
    expect(typeof ship.isSunk).toBe('function');
  });

  test('unknown ship type results in undefined length and isSunk() stays false', () => {
    const ship = createShip('unknown-type');
    expect(ship.length).toBeUndefined();
    expect(ship.isSunk()).toBe(false);
  });
});
