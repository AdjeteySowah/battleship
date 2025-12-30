// import plyerName, computerName, isNameFromInput
import { createGameboard } from "./gameboard.js";
import { generateRandomCoordinate } from "./ai.js";

function createPlayer() {
  const name = isNameFromInput ? playerName : computerName;

  const isComputer = isNameFromInput ? false : true;

  const gameboard = createGameboard();

  function attack(opponent, x, y) {
    opponent.receiveAttack(x, y);
  }

  function autoAttack(opponent) {
    const x = generateRandomCoordinate()[0];
    const y = generateRandomCoordinate()[1];
    opponent.receiveAttack(x, y);
  }
  
  isNameFromInput = false;

  return {
    name,
    isComputer,
    gameboard,
    attack,
    autoAttack,
  };
}