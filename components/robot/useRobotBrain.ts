import { useEffect, useMemo, useReducer, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { Priority } from './types';
import type { EmoteStep, Line, Mood, Pose, Prop, RobotApi, RobotState, SpeakOptions } from './types';
import { storage } from './storage';
import { announceQuiet } from './bus';

const FADE_MS = 300;
const DEFAULT_HOLD_MS = 6000;
const HOP_MS = 700;

const NUDGE_MS = 900;

const initialState = (): RobotState => ({
  mood: 'neutral',
  prop: 'none',
  pose: 'dock',
  asleep: false,
  quiet: false,
  dnd: false,
  hop: false,
  nudge: 0,
  trayOpen: false,
  game: { status: 'off', collected: 0, total: 0 },
  bubble: { text: '', visible: false, priority: Priority.Idle },
  pupil: { x: 0, y: 0 },
});

export interface Brain {
  state: RobotState;
  api: RobotApi;
  /** Provider-only. Not part of the behavior-facing surface. */
  internal: {
    setPupil(x: number, y: number): void;
    /** Restore persisted state on mount without firing side effects. */
    hydrate(patch: Partial<RobotState>): void;
  };
}

export function useRobotBrain(): Brain {
  const stateRef = useRef<RobotState>(initialState());
  const [, render] = useReducer((n: number) => n + 1, 0);

  const mounted = useRef(true);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emoteGen = useRef(0);

  // What is currently holding the bubble, and until when. Tracked separately
  // from bubble.visible because during the 300ms fade the bubble is invisible
  // but still "owned" — without this a low-priority idle fact could slip into
  // the gap and clobber a line the visitor just triggered.
  const active = useRef<{ priority: Priority; until: number }>({
    priority: Priority.Idle,
    until: 0,
  });

  useEffect(() => {
    mounted.current = true;
    const pending = timers.current;
    return () => {
      mounted.current = false;
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  // Built once. Behaviors capture these at setup and must be able to rely on
  // the identity never changing.
  const { api, internal } = useMemo<Pick<Brain, 'api' | 'internal'>>(() => {
    const commit = (patch: Partial<RobotState>) => {
      if (!mounted.current) return;
      stateRef.current = { ...stateRef.current, ...patch };
      render();
    };

    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timers.current.delete(id);
        if (mounted.current) fn();
      }, ms);
      timers.current.add(id);
      return id;
    };

    const clear = (ref: MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
      if (ref.current !== null) {
        clearTimeout(ref.current);
        timers.current.delete(ref.current);
        ref.current = null;
      }
    };

    const setMood = (mood: Mood, ms?: number) => {
      emoteGen.current += 1; // a direct mood set cancels any running sequence
      clear(moodTimer);
      commit({ mood });
      if (ms) moodTimer.current = later(() => commit({ mood: 'neutral' }), ms);
    };

    const wake = () => {
      if (!stateRef.current.asleep) return;
      commit({ asleep: false, mood: 'neutral' });
    };

    const speak = (line: Line, opts: SpeakOptions = {}) => {
      const priority = opts.priority ?? Priority.Idle;
      const holdMs = opts.holdMs ?? DEFAULT_HOLD_MS;
      const state = stateRef.current;

      // Quiet mode silences the bubble entirely; the robot stays present.
      // Do-not-disturb is stronger: only the visitor bringing it back speaks.
      if (state.quiet) return;
      if (state.dnd && priority < Priority.User) return;

      // A sleeping robot doesn't recite facts. Anything more deliberate than
      // idle chatter wakes it first.
      if (state.asleep) {
        if (priority <= Priority.Idle) return;
        wake();
      }

      // Background chatter never interrupts a line already showing. A direct
      // interaction always does, though — otherwise tapping twice in a row
      // reads as the robot ignoring you.
      const now = Date.now();
      if (
        priority < Priority.User &&
        active.current.until > now &&
        priority <= active.current.priority
      ) {
        return;
      }

      emoteGen.current += 1;
      clear(moodTimer);
      clear(swapTimer);

      active.current = { priority, until: now + FADE_MS + holdMs };

      commit({ bubble: { ...state.bubble, visible: false } });
      swapTimer.current = later(() => {
        commit({
          bubble: { text: line.text, visible: true, priority },
          mood: line.mood,
        });
        // The bubble retires with the mood. Without this the last thing said
        // stays on screen forever on any page where the robot then goes quiet.
        moodTimer.current = later(
          () =>
            commit({
              mood: 'neutral',
              bubble: { ...stateRef.current.bubble, visible: false },
            }),
          holdMs
        );
      }, FADE_MS);
    };

    const emote = async (sequence: EmoteStep[]): Promise<void> => {
      const gen = ++emoteGen.current;
      clear(moodTimer);
      for (const step of sequence) {
        if (gen !== emoteGen.current || !mounted.current) return;
        commit({ mood: step.mood });
        await new Promise<void>((resolve) => later(resolve, step.ms));
      }
    };

    const setQuiet = (on: boolean) => {
      if (on) {
        clear(swapTimer);
        clear(moodTimer);
        active.current = { priority: Priority.Idle, until: 0 };
        commit({ quiet: true, bubble: { text: '', visible: false, priority: Priority.Idle } });
      } else {
        commit({ quiet: false });
      }
      storage.setQuiet(on);
      announceQuiet(on);
    };

    return {
      api: {
        speak,
        setMood,
        emote,
        wake,
        sleep: () => commit({ asleep: true, mood: 'sleepy' }),
        setProp: (prop: Prop) => commit({ prop }),
        setQuiet,
        setPose: (pose: Pose) => commit({ pose }),
        setDnd: (on: boolean) => {
          commit({
            dnd: on,
            pose: on ? 'corner' : 'dock',
            mood: on ? 'sad' : 'happy',
            trayOpen: false,
          });
          storage.setDnd(on);
        },
        setTray: (open: boolean) => commit({ trayOpen: open }),
        setGame: (patch: Partial<RobotState['game']>) =>
          commit({ game: { ...stateRef.current.game, ...patch } }),
        hop: () => {
          commit({ hop: true });
          later(() => commit({ hop: false }), HOP_MS);
        },
        nudge: (px: number) => {
          commit({ nudge: px });
          later(() => commit({ nudge: 0 }), NUDGE_MS);
        },
        getState: () => stateRef.current,
      },
      internal: {
        setPupil: (x: number, y: number) => commit({ pupil: { x, y } }),
        hydrate: (patch: Partial<RobotState>) => commit(patch),
      },
    };
  }, []);

  return { state: stateRef.current, api, internal };
}
