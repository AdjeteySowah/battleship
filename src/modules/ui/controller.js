import startHtml from '../../pages/start.html';
import placementHtml from '../../pages/placement.html';
import battleHtml from '../../pages/battle.html';
import winnerHtml from '../../pages/winner.html';
import startSound from '../../assets/audio/start.mp3';

import { toggleSoundIcon, displayInputErrMsg } from './dom.js';

const startAudio = new Audio(startSound);
startAudio.preload = 'auto';
async function playStartingSound() {
  try {
    await startAudio.play();
    startAudio.loop = true;
    startAudio.volume = 0.5;
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
  // battle: { html: battleHtml, init: initBattlePage },
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
    navigateTo('placement', { playerName: name });
    // createplayers
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
  const playerName = opts.playerName || sessionStorage.getItem('playerName');
  const span = container.querySelector('.placement__title-name');

  span.textContent = playerName;
}
