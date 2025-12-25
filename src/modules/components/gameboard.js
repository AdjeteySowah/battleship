import { setCurrentShipName, isValidPlacement } from "../utils/helpers.js";
import { createShip } from "./ship.js";

export function createGameboard({ size = 10, defaultAxis = 'x', totalShips = 5 } = {}) {
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

  let board = makeGrid(null);   // holds ship objects or null
  let shots = makeGrid('U');    // 'U' unknown, 'H' hit, 'M' miss
  let sunkShips = 0;
  let axis = defaultAxis;

  function setAxis(a) { 
    axis = a === 'y' ? 'y' : 'x'; 
  }

  function placeShip(x, y, useAxis = axis) {
    const currentShipName = setCurrentShipName();
    const shipType = createShip(currentShipName);
    const length = shipType.length;

    const valid = isValidPlacement(x, y, length, useAxis, board, size);
    if (!valid) return false;

    if (useAxis === 'x') {
      for (let i = 0; i < length; i++) {
        board[x][y + i] = shipType;
      }
    } else {
      for (let i = 0; i < length; i++) {
        board[x + i][y] = shipType;
      }
    }
    return true;
  }

  function receiveAttack(x, y) {
    if (shots[x][y] !== 'U') return false;

    if (board[x][y] === null) {
      shots[x][y] = 'M';
    } else {
      shots[x][y] = 'H';
      board[x][y].hit();
      if (board[x][y].isSunk()) {
        sunkShips += 1;
      }
    }
    return true;
  }

  function allSunk() {
    return sunkShips >= totalShips;
  }

  function reset() {
    board = makeGrid(null);
    shots = makeGrid('U');
    sunkShips = 0;
    axis = defaultAxis;
  }

  return {
    setAxis,
    placeShip,
    receiveAttack,
    allSunk,
    reset,
  };
}
