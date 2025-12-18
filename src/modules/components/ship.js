import { shipTypes } from "../utils/constants.js";

function createShip(shipType) {
  const length = getLength(shipType);
  function getLength(shipType) {
    for (let i = 0; i < shipTypes.length; i++) {
      if (shipType === shipTypes[i].name) {
        return shipTypes[i].length;
      }
    }
  }

  const hitTimes = 'l';
  function hit() {

  }

  return {
    length,
  }
}
