import { Box, BoxProps } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import type { Scene } from './scenes';

interface AsciiCanvasProps extends Omit<BoxProps, 'children'> {
  scene: Scene;
  rows: number;
  label: string;
  speed?: number;
  fps?: number;
  fontSize?: number;
  /** Fix the grid at this many columns and scale the font to the width. */
  fitCols?: number;
  maxFontSize?: number;
  /** One colour per layer when the scene returns several strings. */
  layerColors?: string[];
  /** Box-drawing joins need 1; text-heavy readouts breathe at ~1.25. */
  lineHeight?: number;
}

const PROBE = 'M'.repeat(20);
const PROBE_PX = 10;

/**
 * Writes frames straight into the DOM rather than through React state, so a
 * dozen of these animating at once never trigger a re-render.
 */
export function AsciiCanvas({
  scene,
  rows,
  label,
  speed = 1,
  fps = 20,
  fontSize = 10,
  fitCols,
  maxFontSize = 14,
  layerColors = ['inherit'],
  lineHeight = 1,
  ...rest
}: AsciiCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const probeRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(scene);
  const speedRef = useRef(speed);
  sceneRef.current = scene;
  speedRef.current = speed;
  const layerCount = layerColors.length;

  useEffect(() => {
    const wrap = wrapRef.current;
    const probe = probeRef.current;
    if (!wrap || !probe) return;

    let cols = 0;
    let t = 0;
    let raf = 0;
    let last = performance.now();
    let lastDraw = 0;
    let visible = true;
    const pointer = { x: -1, y: -1 };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      if (cols <= 0) return;
      const out = sceneRef.current({ t, cols, rows, mx: pointer.x, my: pointer.y });
      const layers = Array.isArray(out) ? out : [out];
      layerRefs.current.forEach((el, i) => {
        if (el) el.textContent = layers[i] ?? '';
      });
    };
    const measure = () => {
      const ratio = probe.getBoundingClientRect().width / PROBE.length / PROBE_PX;
      if (ratio <= 0) return;
      if (fitCols) {
        const size = Math.min(maxFontSize, wrap.clientWidth / (fitCols * ratio));
        wrap.style.fontSize = `${size}px`;
        wrap.style.height = `${rows * size * lineHeight}px`;
        cols = fitCols;
        draw();
        return;
      }
      const next = Math.max(1, Math.floor(wrap.clientWidth / (ratio * fontSize)));
      if (next === cols) return;
      cols = next;
      draw();
    };

    const resize = new ResizeObserver(() => requestAnimationFrame(measure));
    resize.observe(wrap);
    document.fonts
      ?.load(`${PROBE_PX}px "JetBrains Mono Full"`)
      .then(measure)
      .catch(() => {});
    const intersect = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersect.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = (e.clientY - r.top) / r.height;
    };
    const onLeave = () => {
      pointer.x = -1;
      pointer.y = -1;
    };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    if (reduceMotion) {
      // A representative still frame instead of t=0, where most scenes are empty.
      t = 4;
      measure();
    } else {
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
        last = now;
        if (!visible || document.hidden) return;
        t += dt * speedRef.current;
        if (now - lastDraw >= 1000 / fps) {
          lastDraw = now;
          draw();
        }
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      intersect.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [rows, fps, fontSize, fitCols, maxFontSize, lineHeight]);

  return (
    <Box
      ref={wrapRef}
      className="ascii"
      role="img"
      aria-label={label}
      position="relative"
      overflow="hidden"
      fontFamily="var(--font-ascii)"
      fontSize={`${fontSize}px`}
      lineHeight={lineHeight}
      height={`${rows * fontSize * lineHeight}px`}
      userSelect="none"
      {...rest}
    >
      <Box
        ref={probeRef}
        aria-hidden
        position="absolute"
        visibility="hidden"
        whiteSpace="pre"
        fontSize={`${PROBE_PX}px`}
      >
        {PROBE}
      </Box>
      {/* Absolutely positioned so the frame's text never feeds back into the
          width it was sized from — in a grid track that loops the observer. */}
      {Array.from({ length: layerCount }, (_, i) => (
        <Box
          key={i}
          ref={(el: HTMLDivElement | null) => {
            layerRefs.current[i] = el;
          }}
          aria-hidden
          position="absolute"
          top={0}
          left={0}
          whiteSpace="pre"
          color={layerColors[i]}
        />
      ))}
    </Box>
  );
}
