import { Priority } from '../types';
import type { Behavior } from '../types';
import { CLICK_LINES } from '../lines';
import { pick } from './util';

/** Reacts when the robot itself is tapped. */
export const clickReactions: Behavior = {
  id: 'click-reactions',
  setup({ api, on, reducedMotion }) {
    return on('tap', () => {
      if (!reducedMotion()) api.hop();
      api.speak(pick(CLICK_LINES), { priority: Priority.User, holdMs: 3500 });
    });
  },
};
