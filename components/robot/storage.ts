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
  routes: 'robot:routes',
} as const;

export const storage = {
  hasVisited: () => read(KEYS.visited, 'localStorage') === '1',
  markVisited: () => write(KEYS.visited, '1', 'localStorage'),

  isQuiet: () => read(KEYS.quiet, 'localStorage') === '1',
  setQuiet: (on: boolean) => write(KEYS.quiet, on ? '1' : '0', 'localStorage'),

  /** Once-per-route-per-session bookkeeping for route comments. */
  hasSeenRoute: (path: string): boolean => {
    const raw = read(KEYS.routes, 'sessionStorage');
    if (!raw) return false;
    try {
      return (JSON.parse(raw) as string[]).includes(path);
    } catch {
      return false;
    }
  },
  markRouteSeen: (path: string): void => {
    const raw = read(KEYS.routes, 'sessionStorage');
    let seen: string[] = [];
    try {
      seen = raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      seen = [];
    }
    if (!seen.includes(path)) seen.push(path);
    write(KEYS.routes, JSON.stringify(seen), 'sessionStorage');
  },
};
