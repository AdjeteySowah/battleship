import musicOnIcon from '../../assets/images/music-on.svg';
import musicOffIcon from '../../assets/images/music-off.svg';

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
