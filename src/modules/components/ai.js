import { isValidAttack, isValidPlacement } from '../utils/helpers.js';

let shot = [];
let hitTracker = [];
let ship = undefined;
let rightward = false;
let leftward = false;
let upward = false;
let downward = false;
let skipRight = false;
let skipLeft = false;

export function genRandomAttackCoord(shots, board) {
  let x = Math.floor(Math.random() * 10);
  let y = Math.floor(Math.random() * 10);
  const randomCoord = [x, y];

  const valid = isValidAttack(x, y, shots);

  if (valid) {
    if (shot.length > 0) {
      if (hitTracker.length > 0 && ship && ship.isSunk() === false) {
        const prevHit = hitTracker.at(-1);
        const a = prevHit[0];
        const b = prevHit[1];
        const directionSet = rightward || leftward || upward || downward;
        x = a; // gen rightward
        y = b + 1;
        if (skipRight || !isValidAttack(x, y, shots)) {
          if (shots[x][y] === 'H') {
            if (!directionSet) rightward = true;
          } else {
            x = a; // gen leftward
            y = b - 1;
            if (skipLeft || !isValidAttack(x, y, shots)) {
              if (shots[x][y] === 'H') {
                if (!directionSet) leftward = true;
              } else {
                x = a - 1; // gen upward
                y = b;
                if (!isValidAttack(x, y, shots)) {
                  if (shots[x]?.[y] === 'H') {
                    if (!directionSet) upward = true;
                  } else {
                    x = a + 1; // gen downward
                    y = b;
                    if (!isValidAttack(x, y, shots)) {
                      if (shots[x]?.[y] === 'H') {
                        if (!directionSet) downward = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (rightward || leftward || upward || downward) {
          if (rightward) {
            while (!isValidAttack(x, y, shots) && y < 10) {
              y += 1;
            }
            if (board[x][y] === null) {
              rightward = false;
              hitTracker.push([x, y - 1]);
            }
            if (board[x][y] === undefined) {
              rightward = false;
              leftward = true;
              hitTracker.push([x, y - 1]);
              y = b - 1;
            }
          } else if (leftward) {
            while (!isValidAttack(x, y, shots) && y >= 0) {
              y -= 1;
            }
            if (board[x][y] === null) {
              leftward = false;
              hitTracker.push([x, y + 1]);
            }
            if (board[x][y] === undefined) {
              leftward = false;
              rightward = true;
              hitTracker.push([x, y + 1]);
              y = b + 1;
            }
          } else if (upward) {
            while (!isValidAttack(x, y, shots) && x >= 0) {
              x -= 1;
            }
            if (board[x]?.[y] === null) {
              upward = false;
              skipRight = true;
              skipLeft = true;
              hitTracker.push([x + 1, y]);
            }
            if (board[x]?.[y] === undefined) {
              upward = false;
              downward = true;
              skipRight = true;
              skipLeft = true;
              hitTracker.push([x + 1, y]);
              x = a + 1;
            }
          } else if (downward) {
            while (!isValidAttack(x, y, shots) && x < 10) {
              x += 1;
            }
            if (board[x]?.[y] === null) {
              downward = false;
              skipRight = true;
              skipLeft = true;
              hitTracker.push([x - 1, y]);
            }
            if (board[x]?.[y] === undefined) {
              downward = false;
              upward = true;
              skipRight = true;
              skipLeft = true;
              hitTracker.push([x - 1, y]);
              x = a - 1;
            }
          }
        }
      } else {
        if (ship) ship = undefined;
        if (rightward) rightward = false;
        if (leftward) leftward = false;
        if (upward) upward = false;
        if (downward) downward = false;
        if (skipRight) skipRight = false;
        if (skipLeft) skipLeft = false;
      }

      const prevShot = shot[0];
      const a = prevShot[0];
      const b = prevShot[1];
      if (shots[a][b] === 'H' && ship === undefined) {
        hitTracker.push([a, b]);
        ship = board[a][b];
        x = a; // gen rightward
        y = b + 1;
        if (!isValidAttack(x, y, shots)) {
          x = a; // gen leftward
          y = b - 1;
          if (!isValidAttack(x, y, shots)) {
            x = a - 1; // gen upward
            y = b;
            if (!isValidAttack(x, y, shots)) {
              x = a + 1; // gen downward
              y = b;
              if (!isValidAttack(x, y, shots)) {
                x = randomCoord[0];
                y = randomCoord[1];
              }
            }
          }
        }
      }
      if (!isValidAttack(x, y, shots)) {
        // a guard against the final generation of an invalid attack coord
        x = randomCoord[0];
        y = randomCoord[1];
      }
      shot.pop();
    }
    shot.push([x, y]);
    return [x, y];
  } else {
    return genRandomAttackCoord(shots, board);
  }
}

export function genRandomPlacementCoord(length, axis, board, size) {
  let x;
  let y;
  if (axis === 'x') {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * (length + 1));
  } else {
    x = Math.floor(Math.random() * (length + 1));
    y = Math.floor(Math.random() * 10);
  }

  const valid = isValidPlacement(x, y, length, axis, board, size).valid;
  return valid ? [x, y] : genRandomPlacementCoord(length, axis, board, size);
}

export function resetTrackers() {
  shot = [];
  hitTracker = [];
  ship = undefined;
  rightward = false;
  leftward = false;
  upward = false;
  downward = false;
  skipRight = false;
  skipLeft = false;
}
