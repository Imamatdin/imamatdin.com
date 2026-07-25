import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Robot } from './Robot';
import { useRobotBrain } from './useRobotBrain';
import { BEHAVIORS } from './behaviors';
import { announceQuiet, onBotCommand, onBotQuietRequest, onBotSay } from './bus';
import { storage } from './storage';
import type { BehaviorCtx, RobotEvents, Unsubscribe } from './types';

/** How long after the last cursor movement the eyes go back to wandering. */
const POINTER_IDLE_MS = 3000;
const MAX_PUPIL = 3.2;
const BLINK_MIN_MS = 2400;
const BLINK_JITTER_MS = 3200;
const BLINK_MS = 140;

type Handler = (payload: never) => void;

interface EventBus {
  on<K extends keyof RobotEvents>(
    event: K,
    handler: (payload: RobotEvents[K]) => void
  ): Unsubscribe;
  emit<K extends keyof RobotEvents>(event: K, payload: RobotEvents[K]): void;
}

/**
 * Owns the brain, translates DOM reality into robot events, and runs the
 * behavior registry. Mounted once, client-side only — see components/Layout.tsx.
 */
export default function RobotCompanion() {
  const { state, api, internal } = useRobotBrain();
  const router = useRouter();
  const botRef = useRef<HTMLButtonElement>(null);

  const [blink, setBlink] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [compact, setCompact] = useState(false);
  const [konami, setKonami] = useState(false);

  // Ref mirrors so the animation loop and behavior context can read current
  // values without being torn down and rebuilt on every change.
  const animateRef = useRef(true);
  const compactRef = useRef(false);
  const pathRef = useRef('/');
  const pointerRef = useRef({ x: 0, y: 0, at: 0, seen: false });
  const pointerTypeRef = useRef('mouse');

  const bus = useMemo<EventBus>(() => {
    const listeners = new Map<string, Set<Handler>>();
    return {
      on(event, handler) {
        const set = listeners.get(event) ?? new Set<Handler>();
        listeners.set(event, set);
        set.add(handler as Handler);
        return () => {
          set.delete(handler as Handler);
        };
      },
      emit(event, payload) {
        listeners.get(event)?.forEach((handler) => {
          (handler as (p: RobotEvents[typeof event]) => void)(payload);
        });
      },
    };
  }, []);

  // Media queries
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const small = window.matchMedia('(max-width: 480px)');
    const sync = () => {
      animateRef.current = !motion.matches;
      compactRef.current = small.matches;
      setAnimate(!motion.matches);
      setCompact(small.matches);
    };
    sync();
    motion.addEventListener('change', sync);
    small.addEventListener('change', sync);
    return () => {
      motion.removeEventListener('change', sync);
      small.removeEventListener('change', sync);
    };
  }, []);

  // Restore persisted state, and tell the rest of the UI what it is.
  useEffect(() => {
    const quiet = storage.isQuiet();
    const dnd = storage.isDnd();
    if (quiet || dnd) {
      internal.hydrate({
        quiet,
        dnd,
        pose: dnd ? 'corner' : 'dock',
        mood: dnd ? 'sad' : 'neutral',
      });
    }
    announceQuiet(quiet);
  }, [internal]);

  // Konami mode is a class on <html>, toggled by useKonamiCode. Watching the
  // attribute keeps the robot decoupled from that hook entirely.
  useEffect(() => {
    const root = document.documentElement;
    const read = () => root.classList.contains('konami-mode');

    let last = read();
    setKonami(last);

    const observer = new MutationObserver(() => {
      const now = read();
      if (now === last) return;
      last = now;
      setKonami(now);
      bus.emit('konami', { on: now });
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [bus]);

  // Scroll depth, sampled on scroll rather than per frame.
  useEffect(() => {
    let queued = false;
    const measure = () => {
      queued = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const depth = scrollable <= 0 ? 1 : Math.min(1, window.scrollY / scrollable);
      bus.emit('scroll', { depth });
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [bus]);

  // Anything on the site can make the robot talk without importing the brain.
  useEffect(() => {
    const offSay = onBotSay(({ text, mood, priority }) =>
      api.speak({ text, mood }, { priority })
    );
    const offQuiet = onBotQuietRequest((on) =>
      api.setQuiet(on === null ? !api.getState().quiet : on)
    );
    const offCommand = onBotCommand((id) => bus.emit('tray', { id }));
    return () => {
      offSay();
      offQuiet();
      offCommand();
    };
  }, [api, bus]);

  // Blink loop
  useEffect(() => {
    let alive = true;
    let openTimer: ReturnType<typeof setTimeout>;
    let closeTimer: ReturnType<typeof setTimeout>;

    const loop = () => {
      if (!alive) return;
      openTimer = setTimeout(() => {
        if (api.getState().asleep) {
          loop(); // lids are already down
          return;
        }
        setBlink(true);
        closeTimer = setTimeout(() => {
          setBlink(false);
          loop();
        }, BLINK_MS);
      }, BLINK_MIN_MS + Math.random() * BLINK_JITTER_MS);
    };

    loop();
    return () => {
      alive = false;
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [api]);

  // Pointer tracking
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, at: performance.now(), seen: true };
      pointerTypeRef.current = e.pointerType || 'mouse';

      const el = botRef.current;
      let overRobot = false;
      if (el) {
        const r = el.getBoundingClientRect();
        overRobot =
          e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      }
      bus.emit('pointer', { x: e.clientX, y: e.clientY, overRobot });
    };

    const onDown = (e: PointerEvent) => {
      pointerTypeRef.current = e.pointerType || 'mouse';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [bus]);

  // Single animation frame loop: drives the eyes and ticks every behavior.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = now - last;
      last = now;

      const el = botRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.35;
        const p = pointerRef.current;

        let tx = 0;
        let ty = 0;
        if (p.seen && now - p.at < POINTER_IDLE_MS) {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const reach = Math.min(MAX_PUPIL, dist / 40);
          tx = (dx / dist) * reach;
          ty = (dy / dist) * reach;
        } else if (animateRef.current) {
          // No cursor — on touch devices this is the only path there ever is.
          const t = now / 1000;
          tx = Math.sin(t * 0.6) * 1.8;
          ty = Math.sin(t * 0.37) * 1.1;
        }

        const cur = api.getState().pupil;
        if (Math.abs(cur.x - tx) > 0.05 || Math.abs(cur.y - ty) > 0.05) {
          internal.setPupil(tx, ty);
        }
      }

      bus.emit('tick', { dt, now });
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [api, internal, bus]);

  // Clicking away, or pressing escape, closes the tray.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!api.getState().trayOpen) return;
      const target = e.target;
      if (target instanceof Element && target.closest('[data-robot-dock]')) return;
      api.setTray(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && api.getState().trayOpen) api.setTray(false);
    };
    document.addEventListener('pointerdown', onDown, true);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [api]);

  // Route changes
  useEffect(() => {
    pathRef.current = router.asPath;
    const onDone = (url: string) => {
      pathRef.current = url;
      bus.emit('route', { path: url });
    };
    router.events.on('routeChangeComplete', onDone);
    return () => router.events.off('routeChangeComplete', onDone);
  }, [router, bus]);

  // Behaviors. Runs once; adding one means editing behaviors/index.ts only.
  useEffect(() => {
    const ctx: BehaviorCtx = {
      api,
      on: bus.on,
      emit: bus.emit,
      reducedMotion: () => !animateRef.current,
      compact: () => compactRef.current,
      path: () => pathRef.current,
    };

    const cleanups = BEHAVIORS.map((behavior) => behavior.setup(ctx)).filter(
      (fn): fn is Unsubscribe => typeof fn === 'function'
    );
    return () => cleanups.forEach((fn) => fn());
  }, [api, bus]);

  return (
    <Robot
      ref={botRef}
      state={state}
      blink={blink}
      animate={animate}
      compact={compact}
      konami={konami}
      onTap={() => bus.emit('tap', { pointerType: pointerTypeRef.current })}
      onTraySelect={(id) => bus.emit('tray', { id })}
    />
  );
}
