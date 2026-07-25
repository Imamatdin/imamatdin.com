import { Priority } from '../types';
import type { Behavior } from '../types';
import {
  DND_LINES,
  DND_RETURN_LINES,
  QUIET_ON_LINE,
  TRAY_HINT,
} from '../lines';
import { FALLBACK_LINES, linesForPath, resolveRoute } from '../routes';
import { createTimers, pick, pickFresh } from './util';

/**
 * What the tray entries actually do. Adding an entry means adding its id to
 * tray.ts and a case here — nothing else in the robot changes.
 */
export const trayActions: Behavior = {
  id: 'tray-actions',
  setup({ api, on, path, reducedMotion }) {
    const timers = createTimers();

    const off = on('tray', ({ id }) => {
      api.setTray(false);

      switch (id) {
        case 'say': {
          const route = resolveRoute(path());
          const line =
            (!route.thin ? pickFresh(linesForPath(path())) : null) ??
            pickFresh(FALLBACK_LINES) ??
            TRAY_HINT;
          api.speak(line, { priority: Priority.User, holdMs: 7000 });
          break;
        }

        case 'shh': {
          // Sulks first, then trudges off. The pause is the whole joke.
          api.speak(pick(DND_LINES), { priority: Priority.User, holdMs: 3000 });
          api.setMood('sad');
          timers.later(() => api.setDnd(true), reducedMotion() ? 0 : 1200);
          break;
        }

        case 'come-back': {
          api.setDnd(false);
          api.speak(pick(DND_RETURN_LINES), { priority: Priority.User, holdMs: 4000 });
          if (!reducedMotion()) api.hop();
          break;
        }

        case 'mute': {
          // Speak first, then go quiet — setQuiet clears the bubble.
          api.speak(QUIET_ON_LINE, { priority: Priority.User, holdMs: 2000 });
          timers.later(() => api.setQuiet(true), 2200);
          break;
        }

        default:
          break;
      }
    });

    return () => {
      off();
      timers.clearAll();
    };
  },
};
