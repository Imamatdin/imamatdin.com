import { Priority } from '../types';
import type { Behavior } from '../types';
import { linesForPath, resolveRoute } from '../routes';
import { storage } from '../storage';
import { createTimers, pickFresh } from './util';

/**
 * One comment per navigation, at most once per route per session, and only
 * where the page has something worth saying. Route priority, so it can never
 * step on something the visitor triggered themselves.
 */
export const routeComments: Behavior = {
  id: 'route-comments',
  setup({ api, on }) {
    const timers = createTimers();

    const off = on('route', ({ path }) => {
      const route = resolveRoute(path);
      if (route.quiet || route.thin) return;
      if (storage.hasSeenRoute(path)) return;

      const line = pickFresh(linesForPath(path));
      if (!line) return;

      storage.markRouteSeen(path);
      // Let the page settle before commenting on it.
      timers.later(() => api.speak(line, { priority: Priority.Route, holdMs: 6500 }), 1200);
    });

    return () => {
      off();
      timers.clearAll();
    };
  },
};
