import startHtml from '../../pages/start.html';
import placementHtml from '../../pages/placement.html';
import battleHtml from '../../pages/battle.html';
import winnerHtml from '../../pages/winner.html';

import startSound from '../../assets/audio/start.mp3';
import shotSound from '../../assets/audio/fire_shot.mp3';
import hitSound from '../../assets/audio/shot_hit.mp3';
import missSound from '../../assets/audio/shot_miss.mp3';

import {
  renderAudioIcon,
  displayInputErrMsg,
  showCurrentAxis,
  showPlacedShip,
  showAttackedCell,
  lockBoard,
  unlockBoard,
  revealShip,
} from './dom.js';
import { createPlayer } from '../components/player.js';
import {
  getCurrentShipDetails,
  isValidPlacement,
  isValidAttack,
  hasShipSunk,
} from '../utils/helpers.js';
import {
  genRandomAttackCoord,
  genRandomPlacementCoord,
} from '../components/ai.js';
import { boardSize } from '../utils/constants.js';

const startAudio = new Audio(startSound);
const shotAudio = new Audio(shotSound);
const hitAudio = new Audio(hitSound);
const missAudio = new Audio(missSound);
startAudio.preload = 'auto';
shotAudio.preload = 'auto';
hitAudio.preload = 'auto';
missAudio.preload = 'auto';

async function playSound(aHit) {
  const page = document.querySelector('.page');
  const notBattlePage =
    page.classList.contains('page--start') ||
    page.classList.contains('page--placement') ||
    page.classList.contains('page--winner');

  if (notBattlePage) {
    try {
      startAudio.loop = true;
      startAudio.volume = 0.5;
      startAudio.muted = false;
      await startAudio.play();
    } catch (err) {
      console.error('play failed:', err);
    }
  } else {
    try {
      await shotAudio.play();

      await new Promise((res) => setTimeout(res, 1500));

      const sfx = aHit ? hitAudio : missAudio;
      await sfx.play();
    } catch (err) {
      console.error('play failed:', err);
    }
  }
}

function muteSound() {
  startAudio.volume = 0;
  startAudio.muted = true;
}

function getAudioState() {
  return sessionStorage.getItem('audioState') || 'on'; // on at start page mount
}

function setAudioState(state) {
  sessionStorage.setItem('audioState', state);
}

export function initWindowListener() {
  let handled = false;

  const onFirstGesture = async () => {
    if (handled) return;
    handled = true;

    window.removeEventListener('pointerdown', onFirstGesture);
    window.removeEventListener('touchstart', onFirstGesture);
    window.removeEventListener('keydown', onFirstGesture);

    if (getAudioState() === 'on') {
      await playSound();
    } else {
      muteSound();
    }
  };

  window.addEventListener('pointerdown', onFirstGesture, { passive: true });
  window.addEventListener('touchstart', onFirstGesture, { passive: true });
  window.addEventListener('keydown', onFirstGesture, { passive: true });
}

const onAudioIconClick = (e, fromBattePage = false) => {
  const btn = e.target.classList.contains('header__audio') ? e.target : null;
  if (!btn) return;

  const current = getAudioState();
  const next = current === 'on' ? 'off' : 'on';

  setAudioState(next);

  if (!fromBattePage) {
    if (next === 'off') {
      muteSound();
    } else {
      playSound();
    }
  }

  renderAudioIcon(document, next);
};

export function listenForAudioIconClick() {
  document.addEventListener('click', onAudioIconClick);
}

const pages = {
  start: { html: startHtml, init: initStartPage },
  placement: { html: placementHtml, init: initPlacementPage },
  battle: { html: battleHtml, init: initBattlePage },
  winner: { html: winnerHtml, init: initWinnerPage },
};

// mount and navigate
export function mount(pageKey, opts = {}) {
  const body = document.querySelector('.page');

  if (body._cleanup) {
    body._cleanup();
    body._cleanup = null;
  }

  const page = pages[pageKey];
  if (!page) throw new Error(`Unknown page ${pageKey}`);

  body.className = `page page--${pageKey}`;

  const tpl = document.createElement('template');
  tpl.innerHTML = page.html.trim();
  body.replaceChildren(tpl.content.cloneNode(true));
  renderAudioIcon(body, getAudioState());

  const cleanup = page.init ? page.init(body, navigateTo, opts) : null;
  if (typeof cleanup === 'function') body._cleanup = cleanup;
  // Using _cleanup makes it clear it’s a private, custom field; not a normal DOM property
}

function navigateTo(pageKey, opts = {}) {
  mount(pageKey, opts);
}

// all page inits functionality
function initStartPage(container, navigateTo) {
  const input = container.querySelector('.start__input');
  const btn = container.querySelector('.start__button');

  function validate() {
    const ok = input.value.trim() !== '';
    return ok;
  }

  const onStart = () => {
    if (!validate()) {
      displayInputErrMsg(container, input);
      input.focus();
      return;
    }
    const name = input.value.trim();
    sessionStorage.setItem('playerName', name);
    const player1 = createPlayer({ playerName: name, isComputer: false });
    const player2 = createPlayer({ playerName: 'COMPUTER', isComputer: true });
    navigateTo('placement', { player1, player2 });
  };

  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onStart();
    }
  };

  document.addEventListener('keydown', onKey);
  btn.addEventListener('click', onStart);

  input.focus();

  return function cleanup() {
    document.removeEventListener('keydown', onKey);
    btn.removeEventListener('click', onStart);
  };
}

function initPlacementPage(container, navigateTo, opts = {}) {
  const player1 = opts.player1;
  const player2 = opts.player2;
  const titleName = container.querySelector('.placement__title-name');
  const titleShip = container.querySelector('.placement__title-ship');
  const axisBtn = container.querySelector('.placement__axis');
  const boardCells = container.querySelectorAll('.board__cell');

  titleName.textContent =
    player1.playerName || sessionStorage.getItem('playerName');
  titleShip.textContent = 'CARRIER';

  function changeAxis() {
    const toAxis = showCurrentAxis(axisBtn);
    player1.gameboard.axis = player1.gameboard.setAxis(toAxis);
  }

  let validBtns;
  function changeBgColorOfPossPlac(e) {
    if (e.type === 'mouseenter') {
      const x = Number(e.target.getAttribute('aria-label').split('')[0]);
      const y = Number(e.target.getAttribute('aria-label').split('')[1]);
      const currentShipDetails = getCurrentShipDetails(false);
      const validCells = isValidPlacement(
        x,
        y,
        currentShipDetails.length,
        player1.gameboard.axis,
        player1.gameboard.board,
        boardSize,
      ).cells;

      if (validCells) {
        const validCellsStringified = validCells.map((pair) => pair.join(''));
        validBtns = validCellsStringified.map((cellCoord) => {
          return container.querySelector(`button[aria-label="${cellCoord}"]`);
        });
        validBtns.forEach((btn) => {
          btn.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
          btn.disabled = false;
        });
      } else {
        e.target.style.backgroundColor = 'rgba(255, 107, 107, 0.6)';
        e.target.disabled = true;
      }
    }

    if (e.type === 'mouseleave') {
      if (validBtns) {
        validBtns.forEach((btn) => {
          btn.style.backgroundColor = 'transparent';
        });
      }
      e.target.style.backgroundColor = 'transparent';
    }
  }

  let placementCounter = 0;
  const arr1 = [];
  const arr2 = [];
  function placeShip(e) {
    const currentShipDetails = getCurrentShipDetails(false);
    const nextShipDetails = getCurrentShipDetails(true);
    const targetCell = e.target;
    const xP1 = Number(targetCell.getAttribute('aria-label').split('')[0]);
    const yP1 = Number(targetCell.getAttribute('aria-label').split('')[1]);
    const computerCoord = genRandomPlacementCoord(
      currentShipDetails.length,
      player1.gameboard.axis,
      player2.gameboard.board,
      boardSize,
    ); // for each placement, the computer will use tha same axis the player used
    const xP2 = computerCoord[0];
    const yP2 = computerCoord[1];

    showPlacedShip(
      currentShipDetails.name,
      targetCell,
      player1.gameboard.axis,
      currentShipDetails.length,
    );

    player1.gameboard.placeShip(
      xP1,
      yP1,
      currentShipDetails.name,
      player1.gameboard.axis,
    );
    targetCell.style.backgroundColor = 'rgba(255, 107, 107, 0.6)';
    targetCell.disabled = true;
    arr1.push({
      name: currentShipDetails.name,
      label: targetCell.getAttribute('aria-label'),
      axis: player1.gameboard.axis,
      length: currentShipDetails.length,
    });
    player1.gameboard.ships = arr1;

    player2.gameboard.placeShip(
      xP2,
      yP2,
      currentShipDetails.name,
      player1.gameboard.axis,
    ); // for each placement, the computer will use tha same axis the player used
    arr2.push({
      name: currentShipDetails.name,
      label: computerCoord.join(''),
      axis: player1.gameboard.axis,
      length: currentShipDetails.length,
    });
    player2.gameboard.ships = arr2;
    player2.gameboard.board[xP2][yP2].origin = computerCoord.join('');

    placementCounter += 1;
    if (placementCounter === 5) {
      navigateTo('battle', { player1, player2 });
    } else {
      titleShip.textContent = nextShipDetails.name;
    }
  }

  axisBtn.addEventListener('click', changeAxis);
  boardCells.forEach((cell) => {
    cell.addEventListener('mouseenter', changeBgColorOfPossPlac);
    cell.addEventListener('mouseleave', changeBgColorOfPossPlac);
    cell.addEventListener('click', placeShip);
  });

  return function cleanup() {
    axisBtn.removeEventListener('click', changeAxis);
    boardCells.forEach((cell) => {
      cell.removeEventListener('mouseenter', changeBgColorOfPossPlac);
      cell.removeEventListener('mouseleave', changeBgColorOfPossPlac);
      cell.removeEventListener('click', placeShip);
    });
  };
}

function initBattlePage(container, navigateTo, opts = {}) {
  const player1 = opts.player1;
  const player2 = opts.player2;
  const enemyCells = container.querySelectorAll('.board__cell--enemy');
  const audioBtn = container.querySelector('.header__audio');

  document.removeEventListener('click', onAudioIconClick);
  muteSound();

  function renderPlayerShipsOnBattleGrid() {
    const playerShips = player1.gameboard.ships;
    const computerShips = player2.gameboard.ships;

    playerShips.forEach((ship) => {
      const name = ship.name;
      const ariaLabel = ship.label;
      const targetCell = container.querySelector(
        `.board__cell--friendly[aria-label='${ariaLabel}']`,
      );
      const length = ship.length;
      const axis = ship.axis;

      showPlacedShip(name, targetCell, axis, length);
    });

    computerShips.forEach((ship) => {
      const name = ship.name;
      const ariaLabel = ship.label;
      const targetCell = container.querySelector(
        `.board__cell--enemy[aria-label='${ariaLabel}']`,
      );
      const length = ship.length;
      const axis = ship.axis;

      showPlacedShip(name, targetCell, axis, length, true);
    });
  }

  renderPlayerShipsOnBattleGrid();

  function playOrMuteSound(e) {
    const fromBattePage = true;
    onAudioIconClick(e, fromBattePage); // render icon state before muting/unmuting sound

    if (getAudioState() === 'on') {
      shotAudio.volume = 0.5;
      hitAudio.volume = 0.5;
      missAudio.volume = 0.5;
    } else if (getAudioState() === 'off') {
      shotAudio.volume = 0;
      hitAudio.volume = 0;
      missAudio.volume = 0;
    }
  }

  function changeBgColor(e) {
    if (e.type === 'mouseenter') {
      const label = e.target.getAttribute('aria-label');
      const x = Number(label.split('')[0]);
      const y = Number(label.split('')[1]);

      const valid = isValidAttack(x, y, player2.gameboard.shots);
      if (valid) {
        e.target.style.cssText =
          'cursor: crosshair; background-color: rgba(107, 255, 107, 0.6);';
        e.disabled = false;
      } else {
        e.target.style.cssText =
          'cursor: not-allowed; background-color: rgba(255, 107, 107, 0.6);';
        e.target.disabled = true;
      }
    }

    if (e.type === 'mouseleave') {
      e.target.style.backgroundColor = 'transparent';
    }
  }

  function attack(e) {
    const targetCell = e.target;
    const xP1 = Number(targetCell.getAttribute('aria-label').split('')[0]);
    const yP1 = Number(targetCell.getAttribute('aria-label').split('')[1]);
    const computerCoord = genRandomAttackCoord(player1.gameboard.shots);
    const xP2 = computerCoord[0];
    const yP2 = computerCoord[1];

    function attackComputer() {
      const isAHit = player1.attack(player2, xP1, yP1).hit;
      showAttackedCell(targetCell, isAHit);
      playSound(isAHit);
      targetCell.style.cssText =
        'cursor: not-allowed; background-color: rgba(255, 107, 107, 0.6);';
      targetCell.disabled = true;

      if (player2.gameboard.allSunk()) {
        navigateTo('winner', { player1 });
        return;
      }

      lockBoard(container);

      const shipSunk = hasShipSunk(xP1, yP1, player2.gameboard.board);
      if (shipSunk) revealShip(xP1, yP1, player2.gameboard.board, container);
    }
    async function attackPlayer() {
      const label = computerCoord.join('');
      const targetCell = container.querySelector(
        `.board__cell--friendly[aria-label="${label}"]`,
      );
      const isAHit = player2.attack(player1, xP2, yP2).hit;
      showAttackedCell(targetCell, isAHit);
      await playSound(isAHit);

      if (player1.gameboard.allSunk()) {
        navigateTo('winner', { player2 });
        return;
      }

      unlockBoard(container);
    }

    attackComputer();
    if (!player2.gameboard.allSunk()) {
      setTimeout(() => {
        attackPlayer();
      }, 3500);
    }
  }

  audioBtn.addEventListener('click', playOrMuteSound);
  enemyCells.forEach((cell) => {
    cell.addEventListener('click', attack);
    cell.addEventListener('mouseenter', changeBgColor);
    cell.addEventListener('mouseleave', changeBgColor);
  });

  return function cleanup() {
    audioBtn.removeEventListener('click', playOrMuteSound);
    enemyCells.forEach((cell) => {
      cell.removeEventListener('click', attack);
      cell.removeEventListener('mouseenter', changeBgColor);
      cell.removeEventListener('mouseleave', changeBgColor);
    });
  };
}

function initWinnerPage(container, navigateTo, opts = {}) {
  console.log('winner page initiated!');

  // return function cleanup() {
  //   if (btn) btn.removeEventListener('click', onPlayAgain);
  // };
}
