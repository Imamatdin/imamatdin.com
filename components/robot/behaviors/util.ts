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
