import { isValidAttack, isValidPlacement } from '../utils/helpers.js';

let shot = [];
let hitTracker = [];
let ship = undefined;
let rightward = false;
let leftward = false;
let upward = false;
let downward = false;

export function genRandomAttackCoord(shots, board) {
  let x = Math.floor(Math.random() * 10);
  let y = Math.floor(Math.random() * 10);

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
        if (!isValidAttack(x, y, shots)) {
          if (shots[x][y] === 'H') {
            if (!directionSet) rightward = true;
          } else {
            x = a; // gen leftward
            y = b - 1;
            if (!isValidAttack(x, y, shots)) {
              if (shots[x][y] === 'H') {
                if (!directionSet) leftward = true;
              } else {
                x = a - 1; // gen upward
                y = b;
                if (!isValidAttack(x, y, shots)) {
                  if (shots[x][y] === 'H') {
                    if (!directionSet) upward = true;
                  } else {
                    x = a + 1; // gen downward
                    y = b;
                    if (!isValidAttack(x, y, shots)) {
                      if (shots[x][y] === 'H') {
                        if (!directionSet) downward = true;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (directionSet) {
          if (rightward) {
            while (!isValidAttack(x, y, shots)) {
              y += 1;
            }
            if (board[x][y] === null) {
              rightward = false;
              hitTracker.push([x, y - 1]);
            }
          } else if (leftward) {
            while (!isValidAttack(x, y, shots)) {
              y -= 1;
            }
            if (board[x][y] === null) {
              leftward = false;
              hitTracker.push([x, y + 1]);
            }
          } else if (upward) {
            while (!isValidAttack(x, y, shots)) {
              x -= 1;
            }
            if (board[x][y] === null) {
              upward = false;
              hitTracker.push([x + 1, y]);
            }
          } else if (downward) {
            while (!isValidAttack(x, y, shots)) {
              x += 1;
            }
            if (board[x][y] === null) {
              downward = false;
              hitTracker.push([x - 1, y]);
            }
          }
        }
      } else {
        if (ship) ship = undefined;
        if (rightward) rightward = false;
        if (leftward) leftward = false;
        if (upward) upward = false;
        if (downward) downward = false;
      }

      const prevShot = shot[0];
      const a = prevShot[0];
      const b = prevShot[1];
      if (shots[a][b] === 'H' && ship === undefined) {
        hitTracker.push([a, b]);
        ship = board[a][b];
        x = a;
        y = b + 1;
        if (!isValidAttack(x, y, shots)) {
          x = a;
          y = b - 1;
          if (!isValidAttack(x, y, shots)) {
            x = a - 1;
            y = b;
            if (!isValidAttack(x, y, shots)) {
              x = a + 1;
              y = b;
            }
          }
        }
      }
      shot.pop();
    }
    shot.push([x, y]);
    // if (board[x][y] !== null) hitTracker.push([x, y]);
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
}
