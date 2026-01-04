import './styles.css';
import {
  initWindowListener,
  mount,
  listenForAudioIconClick,
} from './modules/ui/controller.js';

function init() {
  initWindowListener();
  mount('start');
  listenForAudioIconClick();
}

init();
