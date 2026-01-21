import { createShip } from './ship.js';

export function createGameboard({
  size = 10,
  defaultAxis = 'x',
  totalShips = 5,
} = {}) {
  function makeGrid(fillValue) {
    const grid = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(fillValue);
      }
      grid.push(row);
    }
    return grid;
  }

  let board = makeGrid(null); // holds ship objects or null
  let shots = makeGrid('U'); // 'U' unknown, 'H' hit, 'M' miss
  let sunkShips = 0;
  let axis = defaultAxis;

  function setAxis(a) {
    return a === 'y' ? 'y' : 'x';
  }

  function placeShip(x, y, shipName, useAxis = axis) {
    const ship = createShip(shipName);
    const length = ship.length;

    if (useAxis === 'x') {
      for (let i = 0; i < length; i++) {
        board[x][y + i] = ship;
      }
    } else {
      for (let i = 0; i < length; i++) {
        board[x + i][y] = ship;
      }
    }
  }

  function receiveAttack(x, y) {
    if (shots[x][y] !== 'U') return false;

    if (board[x][y] === null) {
      shots[x][y] = 'M';
      return { attacked: true, hit: false };
    } else {
      shots[x][y] = 'H';
      board[x][y].hit();
      if (board[x][y].isSunk()) {
        sunkShips += 1;
      }
      return { attacked: true, hit: true };
    }
  }

  function allSunk() {
    return sunkShips >= totalShips;
  }

  return {
    axis,
    board,
    shots,
    setAxis,
    placeShip,
    receiveAttack,
    allSunk,
  };
}
