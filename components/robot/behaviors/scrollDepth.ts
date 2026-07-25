import { Priority } from '../types';
import type { Behavior } from '../types';
import { SCROLL_END_LINES } from '../lines';
import { resolveRoute } from '../routes';
import { pick } from './util';

/**
 * Acknowledges someone reaching the bottom of a long page. Fires once per
 * route and only where there was actually something to read, so it reads as
 * noticing rather than as a scroll-triggered popup.
 */
export const scrollDepth: Behavior = {
  id: 'scroll-depth',
  setup({ api, on, path }) {
    let rewarded = '';

    const offRoute = on('route', () => {
      rewarded = '';
    });

    const offScroll = on('scroll', ({ depth }) => {
      if (depth < 0.98) return;

      const here = path();
      if (rewarded === here) return;

      const route = resolveRoute(here);
      // Only long-form pages earn this. Reaching the bottom of the home page
      // is not an achievement.
      if (route.kind !== 'article') return;

      rewarded = here;
      api.speak(pick(SCROLL_END_LINES), { priority: Priority.Reaction, holdMs: 4500 });
    });

    return () => {
      offRoute();
      offScroll();
    };
  },
};
