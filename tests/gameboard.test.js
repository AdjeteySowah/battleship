// For simplicity, even though the ship names and lengths here don't match what I have in my ship module, it is used to make test runnig easier.
jest.mock('../src/modules/components/ship.js', () => ({
  createShip: jest.fn((name) => {
    const lengths = { sub: 1, van: 2 };
    const length = lengths[name] ?? 2;

    return {
      name,
      length,
      hits: 0,
      hit() {
        this.hits += 1;
      },
      isSunk() {
        return this.hits >= this.length;
      },
    };
  }),
}));

import { createGameboard } from '../src/modules/components/gameboard.js';
import { createShip } from '../src/modules/components/ship.js';

describe('createGameboard()', () => {
  test('initializes board and shots with correct default size and values', () => {
    const gb = createGameboard({ size: 5 });
    expect(gb.board).toHaveLength(5);
    expect(gb.shots).toHaveLength(5);
    expect(gb.board[0][0]).toBeNull();
    expect(gb.shots[0][0]).toBe('U');
  });

  test('placeShip places ship horizontally (axis x) on the board', () => {
    const gb = createGameboard({ size: 5 });
    gb.placeShip(0, 0, 'van', 'x');
    const ship = gb.board[0][0];
    expect(ship).toBeDefined();
    expect(gb.board[0][1]).toBe(ship); // same ship reference occupies next cell
    // other cell untouched
    expect(gb.board[0][2]).toBeNull();
  });

  test('placeShip places ship vertically (axis y) on the board', () => {
    const gb = createGameboard({ size: 5 });
    gb.placeShip(1, 1, 'van', 'y'); // vertical placement
    const ship = gb.board[1][1];
    expect(ship).toBeDefined();
    expect(gb.board[2][1]).toBe(ship);
    expect(gb.board[3][1]).toBeNull();
  });

  test('receiveAttack records a miss and returns attacked', () => {
    const gb = createGameboard({ size: 5 });
    const res = gb.receiveAttack(4, 4);
    expect(res).toEqual({ attacked: true, hit: false });
    expect(gb.shots[4][4]).toBe('M');
  });

  test('receiveAttack on ship records a hit, calls ship.hit(), and marks shots as H', () => {
    const gb = createGameboard({ size: 5 });
    gb.placeShip(0, 0, 'van', 'x');
    const ship = gb.board[0][0];
    // spy on ship.hit
    const hitSpy = jest.spyOn(ship, 'hit');
    const res = gb.receiveAttack(0, 0);
    expect(res).toEqual({ attacked: true, hit: true });
    expect(gb.shots[0][0]).toBe('H');
    expect(hitSpy).toHaveBeenCalled();
    hitSpy.mockRestore();
  });

  test('sunkShips increments and allSunk() becomes true when all ships are sunk', () => {
    // totalShips = 1 so after sinking one ship allSunk() === true
    const gb = createGameboard({ size: 5, totalShips: 1 });
    gb.placeShip(0, 0, 'sub', 'x');
    const ship = gb.board[0][0];
    expect(ship.length).toBe(1);
    // attack the single cell, should sink immediately
    const res = gb.receiveAttack(0, 0);
    expect(res).toEqual({ attacked: true, hit: true });
    expect(ship.isSunk()).toBe(true);
    // allSunk should now reflect sunkShips >= totalShips
    expect(gb.allSunk()).toBe(true);
  });

  test('setAxis returns "y" for "y" input and "x" for "x" input', () => {
    const gb = createGameboard();
    expect(gb.setAxis('y')).toBe('y');
    expect(gb.setAxis('x')).toBe('x');
  });
});
