import { shipTypes } from "./constants.js";

let itemNum = 0;
export function setCurrentShipName() {
  let s = shipTypes[itemNum].name;
  itemNum+= 1;
  return s;
}

export function isValidPlacement(x, y, length, axis, board, size) {
  function collideX() {
    for (let i = 0; i < length; i++) {
      if (board[x][y + i] !== null) {
        return true;
      }
    }
    return false;
  }

  function collideY() {
    for (let i = 0; i < length; i++) {
      if (board[x + i][y] !== null) {
        return true;
      }
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
      return collideX() ? false : true;
    } else {
      return false;
    }
  } else if (axis === 'y') {
    if (
      (length === 5 && x <= size - length && y < size) ||
      (length === 4 && x <= size - length && y < size) ||
      (length === 3 && x <= size - length && y < size) ||
      (length === 2 && x <= size - length && y < size)
    ) {
      return collideY() ? false : true;
    } else {
      return false;
    }
  }
}
