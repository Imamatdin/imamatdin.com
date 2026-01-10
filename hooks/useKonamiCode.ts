import { useEffect, useState, useCallback } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export function useKonamiCode() {
  const [isActivated, setIsActivated] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  const checkSequence = useCallback((sequence: string[]) => {
    const sequenceString = sequence.join(',');
    const konamiString = KONAMI_CODE.join(',');

    if (sequenceString === konamiString) {
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    // Check localStorage for persisted konami mode
    const konamiMode = localStorage.getItem('konami-mode');
    if (konamiMode === 'true') {
      setIsActivated(true);
      document.documentElement.classList.add('konami-mode');
    }
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

      const key = e.key;

      setKeySequence(prev => {
        const newSequence = [...prev, key].slice(-KONAMI_CODE.length);

        if (checkSequence(newSequence)) {
          // Toggle hacker mode
          const newState = !isActivated;
          setIsActivated(newState);

          if (newState) {
            document.documentElement.classList.add('konami-mode');
            localStorage.setItem('konami-mode', 'true');
            console.log('%cWelcome, friend.', 'color: #0f0; font-size: 20px; font-family: monospace;');
          } else {
            document.documentElement.classList.remove('konami-mode');
            localStorage.removeItem('konami-mode');
          }

          return [];
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActivated, checkSequence]);

  return isActivated;
}
