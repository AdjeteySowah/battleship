import { shipTypes } from './constants.js';

let itemNum = 0;
export function getCurrentShipDetails(getNext) {
  if (getNext) itemNum += 1;
  const details = shipTypes[itemNum];
  return details;
}

export function isValidPlacement(x, y, length, axis, board, size) {
  const cells = [];

  function collideX() {
    for (let i = 0; i < length; i++) {
      if (board[x][y + i] !== null) {
        return true;
      }
      cells.push([x, y + i]);
    }
    return false;
  }

  function collideY() {
    for (let i = 0; i < length; i++) {
      if (board[x + i][y] !== null) {
        return true;
      }
      cells.push([x + i, y]);
    }
    return false;
  }

  if (axis === 'x') {
    if (
      (length === 5 && x < size && y <= size - length) ||
      (length === 4 && x < size && y <= size - length) ||
      (length === 3 && x < size && y <= size - length) ||
      (length === 2 && x < size && y <= size - length)
    ) {
      return collideX()
        ? { valid: false, cells: null }
        : { valid: true, cells: cells };
    } else {
      return { valid: false, cells: null };
    }
  } else if (axis === 'y') {
    if (
      (length === 5 && x <= size - length && y < size) ||
      (length === 4 && x <= size - length && y < size) ||
      (length === 3 && x <= size - length && y < size) ||
      (length === 2 && x <= size - length && y < size)
    ) {
      return collideY()
        ? { valid: false, cells: null }
        : { valid: true, cells: cells };
    } else {
      return { valid: false, cells: null };
    }
  }
}

export function isValidAttack(x, y, shots) {
  return shots[x][y] === 'U' ? true : false;
}
