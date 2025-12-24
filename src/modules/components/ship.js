import { shipTypes } from "../utils/constants.js";

export function createShip(shipType) {
  const length = getLength(shipType);
  function getLength(shipType) {
    for (let i = 0; i < shipTypes.length; i++) {
      if (shipType === shipTypes[i].name) {
        return shipTypes[i].length;
      }
    }
  }

  let hitTimes = 0;
  function hit() {
    hitTimes+= 1;
  }

  function isSunk() {
    return length === hitTimes ? true : false;
  }

  return {
    length,
    hit,
    isSunk,
  }
}
