import musicOnIcon from '../../assets/images/music-on.svg';
import musicOffIcon from '../../assets/images/music-off.svg';
import carrierSvg from '../../assets/images/carrier-img.svg';
import battleshipSvg from '../../assets/images/battleship-img.svg';
import cruiserSvg from '../../assets/images/cruiser-img.svg';
import submarineSvg from '../../assets/images/submarine-img.svg';
import destroyerSvg from '../../assets/images/destroyer-img.svg';

export function toggleSoundIcon(e) {
  const btn = e.target.closest('.header__audio');
  if (!btn) return;

  if (btn.classList.contains('header__audio--on')) {
    btn.classList.replace('header__audio--on', 'header__audio--off');
    btn.setAttribute('aria-pressed', 'true');

    const icon = btn.querySelector('img');
    icon.setAttribute('src', musicOffIcon);
    icon.setAttribute('alt', 'music-off icon');
  } else {
    btn.classList.replace('header__audio--off', 'header__audio--on');
    btn.setAttribute('aria-pressed', 'false');

    const icon = btn.querySelector('img');
    icon.setAttribute('src', musicOnIcon);
    icon.setAttribute('alt', 'music-on icon');
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
  targetCell.style.position = 'relative';
  targetCell.appendChild(wrapper);
}

export function showAttackedCell(e, hit) {
  if (!e.target.classList.contains('board__cell--unknown')) return;

  const bullet = document.createElement('div');
  bullet.style.cssText =
    'width: 1.5rem; height: 1.5rem; border-radius: 50%; margin: 0 auto;';
  hit
    ? (bullet.style.backgroundColor = 'rgb(255, 107, 107)')
    : (bullet.style.backgroundColor = 'rgb(255, 255, 255)');

  e.target.classList.replace('board__cell--unknown', 'board__cell--known');
  e.target.appendChild(bullet);
}
