import { isValidPlacement } from '../utils/helpers.js';

export function genRandomAttackCoord() {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  return [x, y];
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
