import './styles.css';
import {
  initWindowListener,
  mount,
  listenForAudioIconClick,
} from './modules/ui/controller.js';
import { showWelcomeAlert } from './modules/utils/helpers.js';

window.addEventListener('load', showWelcomeAlert);

function init() {
  initWindowListener();
  mount('start');
  listenForAudioIconClick();
}

init();
