import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

interface ListItem {
  id: string;
  href: string;
}

export function useListKeyboardNav(items: ListItem[]) {
  const [focusedIndex, setFocusedIndex] = useState(-1); // -1 means nothing focused
  const router = useRouter();

  const focusNext = useCallback(() => {
    setFocusedIndex(i => Math.min(i + 1, items.length - 1));
  }, [items.length]);

  const focusPrev = useCallback(() => {
    setFocusedIndex(i => Math.max(i - 1, 0));
  }, []);

  const openFocused = useCallback(() => {
    if (focusedIndex >= 0 && items[focusedIndex]) {
      router.push(items[focusedIndex].href);
    }
  }, [focusedIndex, items, router]);

  const clearFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'j':
          e.preventDefault();
          focusNext();
          break;
        case 'k':
          e.preventDefault();
          focusPrev();
          break;
        case 'Enter':
          if (focusedIndex >= 0) {
            e.preventDefault();
            openFocused();
          }
          break;
        case 'Escape':
          clearFocus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusNext, focusPrev, openFocused, clearFocus, focusedIndex]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0) {
      const element = document.querySelector(`[data-list-index="${focusedIndex}"]`);
      if (element) {
        element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedIndex]);

  return { focusedIndex, clearFocus };
}
