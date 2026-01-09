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

export function showPlacedShip(ship, e, axis) {
  const wrapper = document.createElement('div');
  const img = document.createElement('img');
  img.style.height = '3rem';
  img.style.display = 'block';

  if (ship === 'carrier') {
    wrapper.classList.add('ship-appe', 'l-5');
    if (axis === 'y') wrapper.classList.add('axis-y');

    img.src = carrierSvg;
    img.alt = 'carrier ship';

    wrapper.appendChild(img);
    e.target.appendChild(wrapper);
    if (axis === 'y') e.target.style.position = 'relative';
  } else if (ship === 'battleship') {
    wrapper.classList.add('ship-appe', 'l-4');
    if (axis === 'y') wrapper.classList.add('axis-y');

    img.src = battleshipSvg;
    img.alt = 'battleship ship';

    wrapper.appendChild(img);
    e.target.appendChild(wrapper);
    if (axis === 'y') e.target.style.position = 'relative';
  } else if (ship === 'cruiser') {
    wrapper.classList.add('ship-appe', 'l-3');
    if (axis === 'y') wrapper.classList.add('axis-y');

    img.src = cruiserSvg;
    img.alt = 'cruiser ship';

    wrapper.appendChild(img);
    e.target.appendChild(wrapper);
    if (axis === 'y') e.target.style.position = 'relative';
  } else if (ship === 'submarine') {
    wrapper.classList.add('ship-appe', 'l-3');
    if (axis === 'y') wrapper.classList.add('axis-y');

    img.src = submarineSvg;
    img.alt = 'submarine ship';

    wrapper.appendChild(img);
    e.target.appendChild(wrapper);
    if (axis === 'y') e.target.style.position = 'relative';
  } else {
    wrapper.classList.add('ship-appe', 'l-2');
    if (axis === 'y') wrapper.classList.add('axis-y');

    img.src = destroyerSvg;
    img.alt = 'destroyer ship';

    wrapper.appendChild(img);
    e.target.appendChild(wrapper);
    if (axis === 'y') e.target.style.position = 'relative';
  }
}

export function showAttackedCell(e, hit) {
  if (!e.target.classList.contains('board__cell--unknown')) return;

  const bullet = document.createElement('div');
  bullet.style.cssText = 'width: 1.5rem; height: 1.5rem; border-radius: 50%;';
  hit
    ? (bullet.style.backgroundColor = 'rgb(255, 107, 107)')
    : (bullet.style.backgroundColor = 'rgb(255, 255, 255)');

  e.target.classList.replace('board__cell--unknown', 'board__cell--known');
  e.target.appendChild(bullet);
}
