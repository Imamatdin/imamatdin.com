import { Priority } from '../types';
import type { Behavior } from '../types';
import { DJ_END_LINES, DJ_LINES, KONAMI_LINES } from '../lines';
import { storage } from '../storage';
import { createTimers, pick } from './util';

const SET_LENGTH_MS = 20000;

/**
 * Konami mode turns the whole site green, so the robot puts on headphones,
 * pulls out a deck and plays a short set. Once per session automatically, and
 * on demand from the tray or the command palette after that.
 */
export const konamiDj: Behavior = {
  id: 'konami-dj',
  setup({ api, on, reducedMotion }) {
    const timers = createTimers();
    let playing = false;

    const startSet = async (withIntro: boolean) => {
      if (playing) return;
      playing = true;

      if (withIntro) {
        api.speak(pick(KONAMI_LINES), { priority: Priority.User, holdMs: 3200 });
        await api.emote([
          { mood: 'surprised', ms: 900 },
          { mood: 'happy', ms: 900 },
        ]);
      }

      api.setProp('headphones');
      api.setMood('dj');
      api.speak(pick(DJ_LINES), { priority: Priority.User, holdMs: 5000 });

      timers.later(() => {
        api.setProp('none');
        api.setMood('happy', 2500);
        api.speak(pick(DJ_END_LINES), { priority: Priority.Reaction, holdMs: 3500 });
        playing = false;
        // Reduced motion still gets the bit, just without the bobbing.
      }, reducedMotion() ? SET_LENGTH_MS / 2 : SET_LENGTH_MS);
    };

    const offKonami = on('konami', ({ on: enabled }) => {
      if (!enabled) {
        if (playing) {
          api.setProp('none');
          playing = false;
        }
        return;
      }
      if (storage.hasSeenDj()) return;
      storage.markDjSeen();
      timers.later(() => startSet(true), 600);
    });

    const offTray = on('tray', ({ id }) => {
      if (id === 'dance') startSet(false);
    });

    return () => {
      offKonami();
      offTray();
      timers.clearAll();
    };
  },
};
