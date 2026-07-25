import type { Line } from '../types';
import { isCurrent } from '../routes';
import { storage } from '../storage';

/** Timer bookkeeping so a behavior's cleanup can be one call. */
export function createTimers() {
  const pending = new Set<ReturnType<typeof setTimeout>>();
  return {
    later(fn: () => void, ms: number) {
      const id = setTimeout(() => {
        pending.delete(id);
        fn();
      }, ms);
      pending.add(id);
      return id;
    },
    clearAll() {
      pending.forEach(clearTimeout);
      pending.clear();
    },
  };
}

export const pick = <T,>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

/**
 * Picks a line the robot hasn't already used this session, dropping any whose
 * validity window has passed. Recycles rather than going silent once a pool is
 * exhausted — a repeat is better than a robot that mysteriously stops.
 */
export function pickFresh(pool: readonly Line[]): Line | null {
  const current = pool.filter((line) => isCurrent(line));
  if (!current.length) return null;

  const unsaid = current.filter((line) => !storage.hasSaid(line.text));
  const choice = pick(unsaid.length ? unsaid : current);
  storage.markSaid(choice.text);
  return choice;
}
