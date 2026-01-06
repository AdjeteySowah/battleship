import startHtml from '../../pages/start.html';
import placementHtml from '../../pages/placement.html';
import battleHtml from '../../pages/battle.html';
import winnerHtml from '../../pages/winner.html';
import startSound from '../../assets/audio/start.mp3';

import {
  toggleSoundIcon,
  displayInputErrMsg,
  showCurrentAxis,
  showPlacedShip,
} from './dom.js';
import { createPlayer } from '../components/player.js';
import { getCurrentShipDetails, isValidPlacement } from '../utils/helpers.js';
import { genRandomPlacementCoord } from '../components/ai.js';
import { boardSize } from '../utils/constants.js';

const startAudio = new Audio(startSound);
startAudio.preload = 'auto';
async function playStartingSound() {
  try {
    await startAudio.play();
    startAudio.loop = true;
    startAudio.volume = 0.2;
  } catch (err) {
    console.error('play failed:', err);
  }
}

function muteStartingSound() {
  startAudio.pause();
}

export function initWindowListener() {
  let handled = false;

  const onFirstGesture = async () => {
    if (handled) return;
    handled = true;

    window.removeEventListener('pointerdown', onFirstGesture);
    window.removeEventListener('touchstart', onFirstGesture);
    window.removeEventListener('keydown', onFirstGesture);

    await playStartingSound();
  };

  window.addEventListener('pointerdown', onFirstGesture, { passive: true });
  window.addEventListener('touchstart', onFirstGesture, { passive: true });
  window.addEventListener('keydown', onFirstGesture, { passive: true });
}

export function listenForAudioIconClick() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.header__audio')) {
      const audioBtn = e.target.closest('.header__audio');
      if (audioBtn.classList.contains('header__audio--on')) {
        muteStartingSound();
        toggleSoundIcon(e);
      } else {
        playStartingSound();
        toggleSoundIcon(e);
      }
    }
  });
}

const pages = {
  start: { html: startHtml, init: initStartPage },
  placement: { html: placementHtml, init: initPlacementPage },
  battle: { html: battleHtml, init: initBattlePage },
  // winner: { html: winnerHtml, init: initWinnerPage },
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
  const titleName = container.querySelector('.placement__title-name');
  const titleShip = container.querySelector('.placement__title-ship');
  const axisBtn = container.querySelector('.placement__axis');
  const boardCells = container.querySelectorAll('.board__cell');
  const player1 = opts.player1;
  const player2 = opts.player2;

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
          return document.querySelector(`button[aria-label="${cellCoord}"]`);
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
  function placeShip(e) {
    const currentShipDetails = getCurrentShipDetails(false);
    const nextShipDetails = getCurrentShipDetails(true);
    const xP1 = Number(e.target.getAttribute('aria-label').split('')[0]);
    const yP1 = Number(e.target.getAttribute('aria-label').split('')[1]);
    const computerCoord = genRandomPlacementCoord(
      currentShipDetails.length,
      player1.gameboard.axis,
      player2.gameboard.board,
      boardSize,
    ); // for each placement, the computer will use tha same axis the player used
    const xP2 = computerCoord[0];
    const yP2 = computerCoord[1];

    showPlacedShip(currentShipDetails.name, e, player1.gameboard.axis);
    player1.gameboard.placeShip(
      xP1,
      yP1,
      currentShipDetails.name,
      player1.gameboard.axis,
    );
    player2.gameboard.placeShip(
      xP2,
      yP2,
      currentShipDetails.name,
      player1.gameboard.axis,
    ); // for each placement, the computer will use tha same axis the player used

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

export function initBattlePage(container, navigateTo, opts = {}) {
  const body = container.querySelector('.page');
  console.log('Battle Started!');
}
