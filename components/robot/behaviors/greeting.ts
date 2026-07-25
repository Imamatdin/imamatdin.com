import { Priority } from '../types';
import type { Behavior } from '../types';
import { GREETINGS, RETURN_GREETINGS, timeBucket } from '../lines';
import { storage } from '../storage';
import { createTimers, pick } from './util';

/** Says hello once per mount, with a different line for returning visitors. */
export const greeting: Behavior = {
  id: 'greeting',
  setup({ api }) {
    const timers = createTimers();
    const returning = storage.hasVisited();
    storage.markVisited();

    const line = returning ? pick(RETURN_GREETINGS) : GREETINGS[timeBucket()];

    // A beat of delay so it reads as the robot noticing you, not as a popup.
    timers.later(() => api.speak(line, { priority: Priority.Route, holdMs: 7000 }), 900);

    return () => timers.clearAll();
  },
};
