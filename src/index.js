import './styles.css';
import {
  initFirstGesture,
  mount,
  listenForAudioIconClick,
} from './modules/ui/controller.js';
import { showWelcomeAlert } from './modules/utils/helpers.js';

window.addEventListener('load', showWelcomeAlert);

function init() {
  initFirstGesture();
  mount('start');
  listenForAudioIconClick();
}

init();
