import { createGameboard } from './gameboard.js';
import { genRandomAttackCoord } from './ai.js';

export function createPlayer({ playerName, isComputer } = {}) {
  const gameboard = createGameboard();

  function manualAttack(opponent, x, y) {
    return opponent.gameboard.receiveAttack(x, y);
  }

  function autoAttack(opponent) {
    const coord = genRandomAttackCoord();
    const x = coord[0];
    const y = coord[1];
    return opponent.gameboard.receiveAttack(x, y);
  }

  return {
    playerName,
    isComputer,
    gameboard,
    attack: isComputer ? autoAttack : manualAttack,
  };
}
