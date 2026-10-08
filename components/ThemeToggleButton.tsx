import { Box, useColorMode } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export type SiteMode = 'noon' | 'candle' | 'night';

// Tiles preview the mode they switch to, so they carry that mode's literal
// colours instead of the live CSS vars (which describe the current mode).
const MODES: { id: SiteMode; bg: string; fg: string; frames: string[][] }[] = [
  {
    id: 'noon',
    bg: '#FFFFFF',
    fg: '#100F0F',
    frames: [
      ['   |   ', '-- O --', '   |   '],
      [' \\   / ', '   O   ', ' /   \\ '],
    ],
  },
  {
    id: 'candle',
    bg: '#FFFCF0',
    fg: '#100F0F',
    frames: [
      ['   (   ', '   |   ', '  [_]  '],
      ['   )   ', '   |   ', '  [_]  '],
      ['   ^   ', '   |   ', '  [_]  '],
      ['   )   ', '   |   ', '  [_]  '],
    ],
  },
  {
    id: 'night',
    bg: '#100F0F',
    fg: '#CECDC3',
    frames: [
      [' *   . ', '   (   ', ' .   * '],
      [' .   * ', '   (   ', ' *   . '],
    ],
  },
];

const STORAGE_KEY = 'site-mode';

function Glyph({ mode }: { mode: SiteMode }) {
  const common = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.3 };
  if (mode === 'noon') {
    return (
      <svg {...common} aria-hidden>
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" />
      </svg>
    );
  }
  if (mode === 'candle') {
    return (
      <svg {...common} aria-hidden>
        <path d="M8 1.5c1.4 1.6 1.8 2.8 0 4.5-1.8-1.7-1.4-2.9 0-4.5z" />
        <path d="M8 6v1.5M5.5 7.5h5V15h-5z" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z" />
    </svg>
  );
}

function useSiteMode() {
  const { setColorMode } = useColorMode();
  const [mode, setModeState] = useState<SiteMode>('noon');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-mode') as SiteMode | null;
    if (current && MODES.some((m) => m.id === current)) setModeState(current);
  }, []);

  const apply = useCallback(
    (next: SiteMode) => {
      document.documentElement.setAttribute('data-mode', next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      setColorMode(next === 'night' ? 'dark' : 'light');
      setModeState(next);
    },
    [setColorMode]
  );

  // The new mode floods out from (x, y) as a growing circle, the way ink
  // spreads on paper. Falls back to an instant swap without View Transitions.
  const setMode = useCallback(
    (next: SiteMode, x: number, y: number) => {
      const root = document.documentElement;
      const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!doc.startViewTransition || still) {
        apply(next);
        return;
      }
      root.style.setProperty('--ink-x', `${x}px`);
      root.style.setProperty('--ink-y', `${y}px`);
      root.style.setProperty(
        '--ink-r',
        `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`
      );
      root.classList.add('ink-transition');
      const transition = doc.startViewTransition(() => flushSync(() => apply(next)));
      transition.finished.finally(() => root.classList.remove('ink-transition'));
    },
    [apply]
  );

  return [mode, setMode] as const;
}

const centre = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2] as const;
};

export const ThemeToggleButton = () => {
  const [mode, setMode] = useSiteMode();
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const closeTimer = useRef<number>();
  const lastPointer = useRef<string>('mouse');

  // The command palette asks for a cycle without knowing about the modes.
  useEffect(() => {
    const onCycle = () => {
      const i = MODES.findIndex((m) => m.id === mode);
      setMode(MODES[(i + 1) % MODES.length].id, window.innerWidth / 2, window.innerHeight / 2);
    };
    window.addEventListener('site-mode:cycle', onCycle);
    return () => window.removeEventListener('site-mode:cycle', onCycle);
  }, [mode, setMode]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 260);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  const cycle = (e: React.MouseEvent<HTMLElement>) => {
    if (lastPointer.current === 'touch') {
      setOpen((o) => !o);
      return;
    }
    const i = MODES.findIndex((m) => m.id === mode);
    setMode(MODES[(i + 1) % MODES.length].id, ...centre(e.currentTarget));
  };

  return (
    <Box
      position="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
      }}
    >
      <Box
        as="button"
        type="button"
        aria-label={`Colour mode: ${mode}. Click to cycle, hover to choose.`}
        aria-haspopup="true"
        aria-expanded={open}
        onPointerDown={(e: React.PointerEvent) => {
          lastPointer.current = e.pointerType;
        }}
        onClick={cycle}
        display="grid"
        placeItems="center"
        boxSize="32px"
        color="subtle"
        _hover={{ color: 'text' }}
        transition="color 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <Glyph mode={mode} />
      </Box>

      <Box
        position="absolute"
        right={0}
        top="100%"
        pt={2}
        zIndex={20}
        opacity={open ? 1 : 0}
        transform={open ? 'translateY(0)' : 'translateY(-4px)'}
        visibility={open ? 'visible' : 'hidden'}
        transition="opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.15s"
      >
        <Box role="radiogroup" aria-label="Colour mode" display="flex" gap="6px" p="6px" bg="background" border="1px solid" borderColor="border">
          {MODES.map((m) => {
            const active = m.id === mode;
            const frame = m.frames[tick % m.frames.length];
            return (
              <Box
                as="button"
                type="button"
                key={m.id}
                role="radio"
                aria-checked={active}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  setMode(m.id, ...centre(e.currentTarget));
                  if (lastPointer.current === 'touch') setOpen(false);
                }}
                width="78px"
                textAlign="left"
                sx={{ '&:hover .tile-name': { color: 'var(--text)' } }}
              >
                <Box
                  bg={m.bg}
                  color={m.fg}
                  height="58px"
                  display="grid"
                  placeItems="center"
                  border="1px solid"
                  borderColor={active ? 'text' : 'border'}
                  fontFamily="var(--font-ascii)"
                  fontSize="11px"
                  lineHeight="1.15"
                  whiteSpace="pre"
                  aria-hidden
                >
                  {frame.join('\n')}
                </Box>
                <Box
                  className="tile-name"
                  mt="5px"
                  fontFamily="mono"
                  fontSize="10px"
                  textTransform="uppercase"
                  letterSpacing="0.071em"
                  color={active ? 'text' : 'subtle'}
                  transition="color 0.15s"
                >
                  {active ? '● ' : ''}
                  {m.id}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
