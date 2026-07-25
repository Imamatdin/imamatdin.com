import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import {
  collectPlatforms,
  gather,
  hasFallenOut,
  layoutCollectibles,
  ROBOT_H,
  ROBOT_W,
  step,
} from './motion';
import type { Body, Collectible, Platform } from './motion';
import type { RobotApi } from './types';

const CELL_COUNT = 5;
/** Platform geometry is re-read on this cadence rather than every frame. */
const RESCAN_MS = 220;

export interface Game {
  start: () => void;
  stop: () => void;
  restart: () => void;
  /** Registers the DOM node for collectible `index`. */
  registerCell: (index: number, node: HTMLElement | null) => void;
  cellCount: number;
}

/**
 * The platformer.
 *
 * Deliberately not a behavior: behaviors describe what the robot does while it
 * lives in its dock, and this takes the robot out of the dock entirely. It is
 * a mode, and it owns its own loop.
 *
 * Following Gazi's structure, simulation state lives in refs and positions are
 * written straight to the DOM. React state carries only what the HUD shows, so
 * a 60fps game costs zero re-renders of the robot's SVG.
 */
export function useGame(api: RobotApi, dockRef: RefObject<HTMLElement>): Game {
  const bodyRef = useRef<Body | null>(null);
  const cellsRef = useRef<Collectible[]>([]);
  const cellNodes = useRef<(HTMLElement | null)[]>([]);
  const platformsRef = useRef<Platform[]>([]);
  const keysRef = useRef(new Set<string>());
  const jumpLatch = useRef(false);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const lastScanRef = useRef(0);

  const registerCell = useCallback((index: number, node: HTMLElement | null) => {
    cellNodes.current[index] = node;
  }, []);

  const paint = useCallback(() => {
    const dock = dockRef.current;
    const body = bodyRef.current;
    if (!dock || !body) return;

    const y = body.docY - window.scrollY;
    dock.style.transform = `translate3d(${body.x}px, ${y}px, 0) scaleX(${body.facing})`;

    cellsRef.current.forEach((cell, i) => {
      const node = cellNodes.current[i];
      if (!node) return;
      if (cell.collected) {
        node.style.display = 'none';
        return;
      }
      node.style.display = 'block';
      node.style.transform = `translate3d(${cell.x}px, ${cell.docY - window.scrollY}px, 0)`;
    });
  }, [dockRef]);

  const stop = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    keysRef.current.clear();
    jumpLatch.current = false;

    const dock = dockRef.current;
    if (dock) {
      dock.style.transform = '';
      dock.style.left = '';
      dock.style.top = '';
      dock.style.right = '';
      dock.style.bottom = '';
    }

    api.setGame({ status: 'off', collected: 0, total: CELL_COUNT });
    api.setMood('neutral');
  }, [api, dockRef]);

  const begin = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;

    // Take the robot out of its dock anchoring; the loop owns position now.
    dock.style.left = '0px';
    dock.style.top = '0px';
    dock.style.right = 'auto';
    dock.style.bottom = 'auto';

    platformsRef.current = collectPlatforms();
    cellsRef.current = layoutCollectibles(CELL_COUNT, platformsRef.current);

    bodyRef.current = {
      x: Math.max(24, window.innerWidth / 2 - ROBOT_W / 2),
      docY: window.scrollY + 40,
      vx: 0,
      vy: 0,
      facing: 1,
      grounded: false,
    };

    api.setGame({ status: 'playing', collected: 0, total: CELL_COUNT });
    api.setMood('surprised', 900);
    runningRef.current = true;
    lastScanRef.current = 0;

    const frame = (now: number) => {
      if (!runningRef.current) return;
      const body = bodyRef.current;
      if (!body) return;

      if (now - lastScanRef.current > RESCAN_MS) {
        platformsRef.current = collectPlatforms();
        lastScanRef.current = now;
      }

      const keys = keysRef.current;
      const jump =
        keys.has('Space') || keys.has('ArrowUp') || keys.has('KeyW');

      // Latched so holding the key doesn't pogo the moment it lands.
      const jumpEdge = jump && !jumpLatch.current;
      jumpLatch.current = jump;

      step(
        body,
        {
          left: keys.has('ArrowLeft') || keys.has('KeyA'),
          right: keys.has('ArrowRight') || keys.has('KeyD'),
          jump: jumpEdge,
        },
        platformsRef.current
      );

      const taken = gather(body, cellsRef.current);
      if (taken > 0) {
        const collected = cellsRef.current.filter((c) => c.collected).length;
        api.setGame({ collected });
        api.setMood('happy', 700);
      }

      // Camera: keep the robot on screen as it climbs or falls. The classic
      // two-argument form is always instant, which is what a game camera wants.
      const screenY = body.docY - window.scrollY;
      if (screenY < 80) window.scrollBy(0, screenY - 80);
      else if (screenY > window.innerHeight - 140) {
        window.scrollBy(0, screenY - (window.innerHeight - 140));
      }

      paint();

      if (cellsRef.current.every((c) => c.collected)) {
        runningRef.current = false;
        api.setGame({ status: 'won' });
        api.setMood('happy');
        return;
      }

      if (hasFallenOut(body)) {
        runningRef.current = false;
        api.setGame({ status: 'lost' });
        api.setMood('surprised');
        return;
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
  }, [api, dockRef, paint]);

  const start = useCallback(() => {
    if (api.getState().game.status === 'playing') return;
    api.setTray(false);
    begin();
  }, [api, begin]);

  const restart = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    runningRef.current = false;
    begin();
  }, [begin]);

  // Keyboard. Only bound while a game is actually running, so the site's own
  // shortcuts are untouched the rest of the time.
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (api.getState().game.status === 'off') return;
      if (e.key === 'Escape') {
        stop();
        return;
      }
      if (e.code === 'Space' && api.getState().game.status !== 'playing') {
        restart();
        return;
      }
      keysRef.current.add(e.code);
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [api, restart, stop]);

  // Scrolling moves the world under the robot, so repaint on scroll too.
  useEffect(() => {
    const onScrollOrResize = () => {
      if (api.getState().game.status === 'off') return;
      platformsRef.current = collectPlatforms();
      paint();
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [api, paint]);

  useEffect(
    () => () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    },
    []
  );

  return useMemo(
    () => ({ start, stop, restart, registerCell, cellCount: CELL_COUNT }),
    [start, stop, restart, registerCell]
  );
}

export { ROBOT_W, ROBOT_H };
