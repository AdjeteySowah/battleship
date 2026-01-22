jest.mock('../src/modules/components/gameboard.js', () => ({
  createGameboard: jest.fn(() => ({
    receiveAttack: jest.fn(() => 'mock-result'),
  })),
}));

import { createPlayer } from '../src/modules/components/player.js';
import { createGameboard } from '../src/modules/components/gameboard.js';

describe('createPlayer()', () => {
  test('returns an object with playerName, isComputer, gameboard and attack function', () => {
    const player = createPlayer({ playerName: 'Abena', isComputer: false });
    expect(player.playerName).toBe('Abena');
    expect(player.isComputer).toBe(false);
    expect(player.gameboard).toBeDefined();
    expect(typeof player.attack).toBe('function');
  });

  test('uses createGameboard to create its gameboard', () => {
    createGameboard.mockClear();
    const player = createPlayer({ playerName: 'Nadia' });
    expect(createGameboard).toHaveBeenCalled();
    expect(player.gameboard).toBe(createGameboard.mock.results[0].value);
  });

  test('attack delegates to opponent.gameboard.receiveAttack and returns its result', () => {
    const attacker = createPlayer({ playerName: 'Attacker' });
    const opponentGameboard = { receiveAttack: jest.fn(() => 'hit') };
    const opponent = { gameboard: opponentGameboard };

    const result = attacker.attack(opponent, 2, 3);

    expect(opponentGameboard.receiveAttack).toHaveBeenCalledWith(2, 3);
    expect(result).toBe('hit');
  });

  test('attack works with a mocked createGameboard opponent (returns mocked value)', () => {
    const attacker = createPlayer();
    const opponent = createPlayer();
    const res = attacker.attack(opponent, 0, 0);

    expect(opponent.gameboard.receiveAttack).toHaveBeenCalledWith(0, 0);
    expect(res).toBe('mock-result');
  });
});
