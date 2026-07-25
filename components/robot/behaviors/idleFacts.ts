import { Priority } from '../types';
import type { Behavior } from '../types';
import { FACTS } from '../lines';
import { createTimers } from './util';

const FIRST_MS = 8000;
const EVERY_MS = 9500;
const THINK_MS = 900;

/** Rotates curated facts at the lowest priority — anything else outranks it. */
export const idleFacts: Behavior = {
  id: 'idle-facts',
  setup({ api }) {
    const timers = createTimers();
    let alive = true;
    // Start somewhere random so a second visit doesn't replay the same order.
    let i = Math.floor(Math.random() * FACTS.length);

    const next = () => {
      if (!alive) return;
      const state = api.getState();

      if (!state.asleep && !state.quiet) {
        api.setMood('thinking');
        timers.later(() => {
          api.speak(FACTS[i % FACTS.length], { priority: Priority.Idle, holdMs: 7000 });
          i += 1;
        }, THINK_MS);
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
