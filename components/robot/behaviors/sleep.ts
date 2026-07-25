import { Priority } from '../types';
import type { Behavior } from '../types';
import { SLEEP_LINE, WAKE_LINE } from '../lines';
import { createTimers } from './util';

const IDLE_MS = 40000;

/** Dozes off after inactivity, wakes on the next sign of life. */
export const sleep: Behavior = {
  id: 'sleep',
  setup({ api, on }) {
    const timers = createTimers();
    let armed: ReturnType<typeof setTimeout> | null = null;

    const arm = () => {
      if (armed) clearTimeout(armed);
      armed = timers.later(() => {
        const state = api.getState();
        // Already asleep, sent away, or mid-game — either way, leave it be.
        if (state.asleep || state.dnd || state.game.status !== 'off') return;
        api.speak(SLEEP_LINE, { priority: Priority.Reaction, holdMs: 4000 });
        timers.later(() => api.sleep(), 400);
      }, IDLE_MS);
    };

    const stir = () => {
      const state = api.getState();
      if (state.asleep) {
        api.wake();
        if (!state.dnd) api.speak(WAKE_LINE, { priority: Priority.Reaction, holdMs: 3000 });
      }
      arm();
    };

    const offPointer = on('pointer', stir);
    const offTap = on('tap', stir);
    arm();

    return () => {
      offPointer();
      offTap();
      timers.clearAll();
    };
  },
};
