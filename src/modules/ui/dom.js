import musicOnIcon from '../../assets/images/music-on.svg';
import musicOffIcon from '../../assets/images/music-off.svg';
import carrierSvg from '../../assets/images/carrier-img.svg';
import battleshipSvg from '../../assets/images/battleship-img.svg';
import cruiserSvg from '../../assets/images/cruiser-img.svg';
import submarineSvg from '../../assets/images/submarine-img.svg';
import destroyerSvg from '../../assets/images/destroyer-img.svg';

export function renderAudioIcon(container, state) {
  const btn = container.querySelector('.header__audio');
  if (!btn) return;

  const icon = btn.querySelector('img');

  if (state === 'off') {
    btn.classList.remove('header__audio--on');
    btn.classList.add('header__audio--off');
    btn.setAttribute('aria-pressed', 'true');
    icon.src = musicOffIcon;
    icon.alt = 'music-off icon';
  } else {
    btn.classList.remove('header__audio--off');
    btn.classList.add('header__audio--on');
    btn.setAttribute('aria-pressed', 'false');
    icon.src = musicOnIcon;
    icon.alt = 'music-on icon';
  }
}

export function displayInputErrMsg(body, input) {
  const errMsg = body.querySelector('.start__err-msg');
  errMsg.textContent = 'NAME REQUIRED';
  errMsg.classList.replace(
    'start__err-msg--invisible',
    'start__err-msg--visible',
  );
  input.value = '';
}

export function showCurrentAxis(btn) {
  btn.textContent.trim() === 'AXIS: X'
    ? (btn.textContent = 'AXIS: Y')
    : (btn.textContent = 'AXIS: X');
  return btn.textContent.at(-1).toLowerCase();
}

export function showPlacedShip(
  shipName,
  targetCell,
  axis,
  length,
  isEnemyGrid = false,
) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('ship-appe', `l-${length}`);
  if (axis === 'x') {
    wrapper.classList.add('axis-x');
  } else {
    wrapper.classList.add('axis-y');
  }
  if (isEnemyGrid) wrapper.classList.add('ship-hidden');

  const img = document.createElement('img');
  img.style.height = '3rem';
  img.style.display = 'block';
  img.alt = `${shipName} ship`;
  img.classList.add('ship-svg');

  switch (shipName) {
    case 'carrier':
      img.src = carrierSvg;
      break;
    case 'battleship':
      img.src = battleshipSvg;
      break;
    case 'cruiser':
      img.src = cruiserSvg;
      break;
    case 'submarine':
      img.src = submarineSvg;
      break;
    default:
      img.src = destroyerSvg;
  }

  wrapper.appendChild(img);
  targetCell.appendChild(wrapper);
}

export function showAttackedCell(targetCell, hit) {
  if (!targetCell.classList.contains('board__cell--unknown')) return;

  const bullet = document.createElement('div');
  bullet.style.cssText =
    'width: 1.5rem; height: 1.5rem; border-radius: 50%; margin: 0 auto;';
  hit
    ? (bullet.style.backgroundColor = 'rgb(255, 107, 107)')
    : (bullet.style.backgroundColor = 'rgb(255, 255, 255)');

  targetCell.classList.replace('board__cell--unknown', 'board__cell--known');
  targetCell.appendChild(bullet);
}

export function lockBoard(container) {
  const enemyBoard = container.querySelector('.board--enemy');
  enemyBoard.classList.add('board-locked');
}
export function unlockBoard(container) {
  const enemyBoard = container.querySelector('.board--enemy');
  enemyBoard.classList.remove('board-locked');
}

export function revealShip(x, y, board, container) {
  const label = board[x][y].origin;
  const cellWithShip = container.querySelector(
    `.board__cell--enemy[aria-label="${label}"]`,
  );
  cellWithShip.children[0].classList.replace('ship-hidden', 'ship-shown');
}
