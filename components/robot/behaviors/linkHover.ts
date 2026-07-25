import { Priority } from '../types';
import type { Behavior } from '../types';
import { PROJECT_LINES, resolveRoute } from '../routes';
import { createTimers, pickFresh } from './util';

const DWELL_MS = 350;
const COOLDOWN_MS = 4000;

/**
 * Comments on a project when you hover or focus its link.
 *
 * Detection is delegated from the document rather than wired into
 * pages/projects/index.tsx, so the page files stay clean and any new link to a
 * project anywhere on the site picks this up for free.
 */
export const linkHover: Behavior = {
  id: 'link-hover',
  setup({ api, path }) {
    const timers = createTimers();
    let lastSlug = '';
    let lastAt = 0;
    let dwell: ReturnType<typeof setTimeout> | null = null;

    const slugFrom = (target: EventTarget | null): string | null => {
      if (!(target instanceof Element)) return null;
      const anchor = target.closest('a[href^="/projects/"]');
      const href = anchor?.getAttribute('href');
      if (!href) return null;
      const slug = href.split('/')[2]?.split(/[?#]/)[0];
      return slug || null;
    };

    const consider = (event: Event) => {
      const slug = slugFrom(event.target);
      if (!slug) return;

      // Don't narrate the page you're already on.
      if (resolveRoute(path()).kind === 'project') return;

      const now = Date.now();
      if (slug === lastSlug && now - lastAt < COOLDOWN_MS) return;

      if (dwell) clearTimeout(dwell);
      // A deliberate hover, not a cursor passing over on its way elsewhere.
      dwell = timers.later(() => {
        const pool = PROJECT_LINES[slug];
        if (!pool) return;
        const line = pickFresh(pool);
        if (!line) return;
        lastSlug = slug;
        lastAt = Date.now();
        api.speak(line, { priority: Priority.Reaction, holdMs: 5500 });
      }, DWELL_MS);
    };

    const cancel = () => {
      if (dwell) {
        clearTimeout(dwell);
        dwell = null;
      }
    };

    document.addEventListener('pointerover', consider, { passive: true });
    document.addEventListener('focusin', consider);
    document.addEventListener('pointerout', cancel, { passive: true });

    return () => {
      document.removeEventListener('pointerover', consider);
      document.removeEventListener('focusin', consider);
      document.removeEventListener('pointerout', cancel);
      timers.clearAll();
    };
  },
};
