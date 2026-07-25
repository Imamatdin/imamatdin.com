/**
 * SSR-safe persistence. Every access is guarded twice: once for the server
 * (no window) and once with try/catch, because Safari in private mode throws
 * on getItem rather than returning null.
 */

type Store = 'localStorage' | 'sessionStorage';

const read = (key: string, store: Store): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window[store].getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string, store: Store): void => {
  if (typeof window === 'undefined') return;
  try {
    window[store].setItem(key, value);
  } catch {
    /* quota exceeded or storage disabled — the robot degrades, nothing breaks */
  }
};

const KEYS = {
  visited: 'robot:visited',
  quiet: 'robot:quiet',
  dnd: 'robot:dnd',
  routes: 'robot:routes',
  spoken: 'robot:spoken',
  dj: 'robot:dj-seen',
} as const;

/** A set persisted as a JSON array, tolerant of anything else being in there. */
function readSet(key: string, store: Store): string[] {
  const raw = read(key, store);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function addToSet(key: string, value: string, store: Store, cap = 200): void {
  const set = readSet(key, store);
  if (set.includes(value)) return;
  set.push(value);
  // Bounded so a long session can't grow storage without limit.
  write(key, JSON.stringify(set.slice(-cap)), store);
}

export const storage = {
  hasVisited: () => read(KEYS.visited, 'localStorage') === '1',
  markVisited: () => write(KEYS.visited, '1', 'localStorage'),

  isQuiet: () => read(KEYS.quiet, 'localStorage') === '1',
  setQuiet: (on: boolean) => write(KEYS.quiet, on ? '1' : '0', 'localStorage'),

  isDnd: () => read(KEYS.dnd, 'localStorage') === '1',
  setDnd: (on: boolean) => write(KEYS.dnd, on ? '1' : '0', 'localStorage'),

  hasSeenDj: () => read(KEYS.dj, 'sessionStorage') === '1',
  markDjSeen: () => write(KEYS.dj, '1', 'sessionStorage'),

  /** Once-per-route-per-session bookkeeping for route comments. */
  hasSeenRoute: (path: string) => readSet(KEYS.routes, 'sessionStorage').includes(path),
  markRouteSeen: (path: string) => addToSet(KEYS.routes, path, 'sessionStorage'),

  /** Stops the robot repeating itself within a session. */
  hasSaid: (text: string) => readSet(KEYS.spoken, 'sessionStorage').includes(text),
  markSaid: (text: string) => addToSet(KEYS.spoken, text, 'sessionStorage'),
  forgetSaid: () => write(KEYS.spoken, '[]', 'sessionStorage'),
};
