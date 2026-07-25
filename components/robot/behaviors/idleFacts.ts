import { Priority } from '../types';
import type { Behavior } from '../types';
import { FALLBACK_LINES, linesForPath, resolveRoute } from '../routes';
import { createTimers, pickFresh } from './util';

const FIRST_MS = 9000;
const EVERY_MS = 11000;
const THINK_MS = 900;

/**
 * Rotates lines that are true of the page you are currently on. Silent on
 * long-form reading routes and on pages that aren't finished yet.
 */
export const idleFacts: Behavior = {
  id: 'idle-facts',
  setup({ api, path }) {
    const timers = createTimers();
    let alive = true;

    const next = () => {
      if (!alive) return;
      const state = api.getState();
      const route = resolveRoute(path());

      const canChatter =
        !state.asleep &&
        !state.quiet &&
        !state.dnd &&
        state.game.status === 'off' &&
        !route.quiet &&
        !route.thin;
      if (canChatter) {
        // Route lines first; the fallback pool is only for pages with none.
        const line = pickFresh(linesForPath(path())) ?? pickFresh(FALLBACK_LINES);
        if (line) {
          api.setMood('thinking');
          timers.later(
            () => api.speak(line, { priority: Priority.Idle, holdMs: 7000 }),
            THINK_MS
          );
        }
      }

      timers.later(next, EVERY_MS);
    };

    timers.later(next, FIRST_MS);

    return () => {
      alive = false;
      timers.clearAll();
    };
  },
};
