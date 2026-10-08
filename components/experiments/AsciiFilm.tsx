import { Box, BoxProps } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { AsciiCanvas } from './AsciiCanvas';
import { sceneFor } from './scenes';

interface Film {
  cols: number;
  rows: number;
  fps: number;
  frames: string[];
  labels: string[];
}

interface AsciiFilmProps extends Omit<BoxProps, 'children'> {
  slug: string;
  label: string;
  maxFontSize?: number;
}

// Ten shade levels from scripts/ascii-renders/convert.py, darkest first. On
// paper the ink should pool in shadow like pencil; on a dark ground the
// highlights should glow, so the ramp flips with the ground.
const RAMP_ON_LIGHT = '#*+=-::.. ';
const RAMP_ON_DARK = ' ..::-=+*#';
const EDGES: Record<string, string> = { '-': '-', '\\': '\\', '|': '|', '/': '/', _: '-', K: '\\', I: '|', L: '/' };
const ACCENT_EDGES = new Set(['_', 'K', 'I', 'L']);

const darkGround = () => {
  const root = document.documentElement;
  return (
    root.getAttribute('data-mode') === 'night' ||
    root.getAttribute('data-theme') === 'dark' ||
    root.classList.contains('konami-mode')
  );
};

/**
 * Splits one encoded frame into three layers: shading fill (muted), edge
 * strokes (full ink, so the render reads like a line drawing) and accent.
 */
function decode(frame: string, ramp: string) {
  let fill = '';
  let edge = '';
  let accent = '';
  for (const ch of frame) {
    if (ch === '\n' || ch === ' ') {
      fill += ch;
      edge += ch;
      accent += ch;
    } else if (ch >= '0' && ch <= '9') {
      fill += ramp[ch.charCodeAt(0) - 48];
      edge += ' ';
      accent += ' ';
    } else if (ch >= 'a' && ch <= 'j') {
      fill += ' ';
      edge += ' ';
      accent += ramp[ch.charCodeAt(0) - 97];
    } else if (ACCENT_EDGES.has(ch)) {
      fill += ' ';
      edge += ' ';
      accent += EDGES[ch];
    } else {
      fill += ' ';
      edge += EDGES[ch] ?? ch;
      accent += ' ';
    }
  }
  return [fill, edge, accent] as const;
}

/**
 * Plays a Blender render converted to ASCII. Fetched only as it nears the
 * viewport — each film is ~100 KB of frames.
 */
export function AsciiFilm({ slug, label, maxFontSize = 13, ...rest }: AsciiFilmProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (missing) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let film: Film | null = null;
    let decoded: (readonly [string, string, string])[] = [];
    let dark = darkGround();
    let raf = 0;
    let frame = 0;
    let last = 0;
    let visible = false;
    let cancelled = false;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fit = () => {
      if (!film || !probeRef.current) return;
      const ratio = probeRef.current.getBoundingClientRect().width / 200;
      if (ratio <= 0) return;
      const size = Math.min(maxFontSize, wrap.clientWidth / (film.cols * ratio));
      wrap.style.fontSize = `${size}px`;
      wrap.style.height = `${film.rows * size}px`;
    };
    const decodeAll = () => {
      if (!film) return;
      const ramp = dark ? RAMP_ON_DARK : RAMP_ON_LIGHT;
      decoded = film.frames.map((f) => decode(f, ramp));
    };
    const paint = () => {
      const layers = decoded[frame];
      if (!layers || !baseRef.current || !edgeRef.current || !accentRef.current) return;
      baseRef.current.textContent = layers[0];
      edgeRef.current.textContent = layers[1];
      accentRef.current.textContent = layers[2];
      if (captionRef.current) captionRef.current.textContent = film?.labels[frame] ?? '';
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!film || !visible || document.hidden) return;
      if (now - last < 1000 / film.fps) return;
      last = now;
      frame = (frame + 1) % film.frames.length;
      paint();
    };

    const load = () => {
      fetch(`/ascii/${slug}.json`)
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((data: Film) => {
          if (cancelled) return;
          film = data;
          decodeAll();
          fit();
          frame = still ? Math.floor(data.frames.length / 2) : 0;
          paint();
          if (!still) raf = requestAnimationFrame(tick);
        })
        .catch(() => {
          if (!cancelled) setMissing(true);
        });
    };

    let requested = false;
    const intersect = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !requested) {
          requested = true;
          load();
        }
      },
      { rootMargin: '300px' }
    );
    intersect.observe(wrap);

    const resize = new ResizeObserver(() => requestAnimationFrame(fit));
    resize.observe(wrap);
    document.fonts
      ?.load('10px "JetBrains Mono Full"')
      .then(fit)
      .catch(() => {});

    const modeWatch = new MutationObserver(() => {
      const next = darkGround();
      if (next === dark) return;
      dark = next;
      decodeAll();
      paint();
    });
    modeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode', 'data-theme', 'class'] });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      intersect.disconnect();
      resize.disconnect();
      modeWatch.disconnect();
    };
  }, [slug, maxFontSize, missing]);

  // Until a render exists for this slug, show its procedural sketch instead.
  if (missing) {
    return <AsciiCanvas scene={sceneFor(slug)} rows={22} fontSize={11} label={label} color="subtle" />;
  }

  return (
    <Box
      ref={wrapRef}
      className="ascii"
      role="img"
      aria-label={label}
      position="relative"
      overflow="hidden"
      fontFamily="var(--font-ascii)"
      lineHeight="1"
      height="240px"
      userSelect="none"
      {...rest}
    >
      <Box ref={probeRef} aria-hidden position="absolute" visibility="hidden" whiteSpace="pre" fontSize="10px">
        {'M'.repeat(20)}
      </Box>
      <Box ref={baseRef} aria-hidden position="absolute" top={0} left={0} whiteSpace="pre" color="subtle" />
      <Box ref={edgeRef} aria-hidden position="absolute" top={0} left={0} whiteSpace="pre" color="text" />
      <Box ref={accentRef} aria-hidden position="absolute" top={0} left={0} whiteSpace="pre" color="var(--live)" />
      <Box
        ref={captionRef}
        aria-hidden
        position="absolute"
        bottom={0}
        right={0}
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="0.071em"
        color="text"
      />
    </Box>
  );
}
