import { createGameboard } from './gameboard.js';

export function createPlayer({ playerName, isComputer } = {}) {
  const gameboard = createGameboard();

  function attack(opponent, x, y) {
    return opponent.gameboard.receiveAttack(x, y);
  }

  return {
    playerName,
    isComputer,
    gameboard,
    attack,
  };
}
