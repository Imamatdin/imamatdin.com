import { Priority } from '../types';
import type { Behavior } from '../types';
import { CLICK_LINES } from '../lines';
import { pick } from './util';

/**
 * Tapping the robot opens the tray. Tapping it while sulking in the corner
 * brings it straight back, because making someone navigate a menu to undo
 * "leave me alone" is a bad joke to play twice.
 */
export const tapTray: Behavior = {
  id: 'tap-tray',
  setup({ api, on, emit, reducedMotion }) {
    return on('tap', () => {
      const state = api.getState();

      if (state.dnd) {
        emit('tray', { id: 'come-back' });
        return;
      }

      if (state.trayOpen) {
        api.setTray(false);
        return;
      }

      // A reaction on the way in, so tapping still feels like poking it.
      if (!reducedMotion()) api.hop();
      api.speak(pick(CLICK_LINES), { priority: Priority.User, holdMs: 2500 });
      api.setTray(true);
    });
  },
};
