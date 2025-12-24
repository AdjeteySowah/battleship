import { setCurrentShipName, isValidPlacement } from "../utils/helpers.js";
import { createShip } from "./ship.js";

const gameboardOne = [
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null]
];

  // U = unknown, H = hit, M = miss
const shotsInGameboardOne = [
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U']
];

const gameboardTwo = [
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null]
];

  // U = unknown, H = hit, M = miss
const shotsInGameboardTwo = [
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
  ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U']
];

export let defaultAxis = 'x';
function placeShip(x, y, axis = defaultAxis) {
  // const axis = defaultAxis;  // revisit this and determine if axis should be declared this way
  const currentShipName = setCurrentShipName();
  const shipType = createShip(currentShipName);
  const valid = isValidPlacement(x, y, shipType.length, axis);
  if (valid && axis === 'x') {
      shipType.segment = {};
    for (let i = 0; i < shipType.length; i++) {
      gameboardOne[x][y] = shipType;
      shipType.segment[`coord${i}`] = [x, y];
      y+= 1;
    }
  } else if (valid && axis === 'y') {
      shipType.segment = {};
    for (let i = 0; i < shipType.length; i++) {
      gameboardOne[x][y] = shipType;
      shipType.segment[`coord${i}`] = [x, y];
      x+= 1;
    }
  } else {
    // handle error. invalid coordinate
  }

  // a function should be called here to let the computer place his 1st ship too
}

function receiveAttack(x, y) {
  let playerHasAttacked = false;
  if (shotsInGameboardTwo[x][y] === 'U') {
    if (gameboardTwo[x][y] === null) {  // a miss
      shotsInGameboardTwo[x][y] = 'M';
    } else {  // a hit
      shotsInGameboardTwo[x][y] = 'H';
      gameboardTwo[x][y].hit();
      if (gameboardTwo[x][y].isSunk()) {
        // let UI react if true
      }
    }
    playerHasAttacked = true;
  }

  // a function should be called that will make gameboardOne receive attacks from the computer
  // this function should check if playerHasAttacked === true before running
  return playerHasAttacked;
}
