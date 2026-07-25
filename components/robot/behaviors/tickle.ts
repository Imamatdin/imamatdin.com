import { Priority } from '../types';
import type { Behavior } from '../types';
import { TICKLE_LINES, TICKLE_STOP_LINES } from '../lines';
import { createTimers, pick } from './util';

const WINDOW_MS = 1200;
const GIGGLE_AT = 5;
const HAD_ENOUGH_AT = 12;
const COOLDOWN_MS = 8000;
/**
 * A fast scrub crosses both thresholds in one burst. Without this the giggle
 * is replaced before anyone can read it and the robot looks like it only ever
 * complains.
 */
const MIN_GIGGLE_MS = 2600;

/**
 * Scrubbing the cursor back and forth over the robot tickles it. Detected as
 * horizontal direction reversals inside a sliding window, which is what
 * scrubbing actually is — a plain move-count would fire on any pass-through.
 */
export const tickle: Behavior = {
  id: 'tickle',
  setup({ api, on, reducedMotion }) {
    const timers = createTimers();
    let reversals: number[] = [];
    let lastX = 0;
    let direction = 0;
    let cooldownUntil = 0;
    let giggled = false;
    let giggledAt = 0;

    const off = on('pointer', ({ x, overRobot }) => {
      if (!overRobot) {
        reversals = [];
        giggled = false;
        return;
      }

      const now = Date.now();
      if (now < cooldownUntil) return;

      const delta = x - lastX;
      lastX = x;
      if (Math.abs(delta) < 2) return;

      const heading = Math.sign(delta);
      if (direction !== 0 && heading !== direction) reversals.push(now);
      direction = heading;

      reversals = reversals.filter((at) => now - at < WINDOW_MS);

      // Escalate only after the giggle has had time to be read.
      if (reversals.length >= HAD_ENOUGH_AT && giggled && now - giggledAt > MIN_GIGGLE_MS) {
        reversals = [];
        giggled = false;
        cooldownUntil = now + COOLDOWN_MS;
        api.speak(pick(TICKLE_STOP_LINES), { priority: Priority.User, holdMs: 4000 });
        // Physically retreats a little. Reduced motion gets the words only.
        if (!reducedMotion()) api.nudge(-46);
        return;
      }

      if (reversals.length >= GIGGLE_AT && !giggled) {
        giggled = true;
        giggledAt = now;
        api.speak(pick(TICKLE_LINES), { priority: Priority.User, holdMs: 3000 });
        if (!reducedMotion()) api.hop();
        timers.later(() => {
          giggled = false;
        }, MIN_GIGGLE_MS + 2000);
      }
    });

    return () => {
      off();
      timers.clearAll();
    };
  },
};
