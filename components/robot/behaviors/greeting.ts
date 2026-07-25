import { Priority } from '../types';
import type { Behavior } from '../types';
import { GREETINGS, RETURN_GREETINGS, timeBucket } from '../lines';
import { resolveRoute } from '../routes';
import { storage } from '../storage';
import { createTimers, pick } from './util';

/** Says hello once per mount, with a different line for returning visitors. */
export const greeting: Behavior = {
  id: 'greeting',
  setup({ api, path }) {
    const timers = createTimers();
    const returning = storage.hasVisited();
    storage.markVisited();

    // Landing straight into an article or an unfinished page: stay out of the
    // way. The same rule every other talking behavior follows.
    const route = resolveRoute(path());
    if (route.quiet || route.thin) return () => timers.clearAll();

    const line = returning ? pick(RETURN_GREETINGS) : GREETINGS[timeBucket()];

    // A beat of delay so it reads as the robot noticing you, not as a popup.
    timers.later(() => api.speak(line, { priority: Priority.Route, holdMs: 7000 }), 900);

    return () => timers.clearAll();
  },
};
