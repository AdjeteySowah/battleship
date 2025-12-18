import { shipTypes } from "./constants.js";

let current = 0;
export function setCurrentShipLength() {
  let shipLength = shipTypes[current].length;
  current++;
  if (current === 5) current = 0;
  return shipLength;
}

export function isValidPlacement(x, y, shipLength, axis) {
  if (axis === 'x') {
    if (
      (shipLength === 5 && x <= 9 && y <= 5) ||
      (shipLength === 4 && x <= 9 && y <= 6) ||
      (shipLength === 3 && x <= 9 && y <= 7) ||
      (shipLength === 2 && x <= 9 && y <= 8)
    ) {
      return true;
    } else {
      return false;
    }
  } else if (axis === 'y') {
    if (
      (shipLength === 5 && x <= 5 && y <= 9) ||
      (shipLength === 4 && x <= 6 && y <= 9) ||
      (shipLength === 3 && x <= 7 && y <= 9) ||
      (shipLength === 2 && x <= 8 && y <= 9)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
