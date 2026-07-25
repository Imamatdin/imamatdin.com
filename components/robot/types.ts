export type Mood =
  | 'neutral'
  | 'happy'
  | 'surprised'
  | 'thinking'
  | 'sleepy'
  | 'wink'
  | 'sad'
  | 'dj';

export type Prop = 'none' | 'laptop' | 'headphones';

/** Higher wins. A line never interrupts one of equal or greater priority. */
export const Priority = {
  Idle: 0,
  Route: 1,
  Reaction: 2,
  User: 3,
} as const;
export type Priority = (typeof Priority)[keyof typeof Priority];

export interface Line {
  text: string;
  mood: Mood;
  /**
   * ISO date after which the line stops being used. For anything that makes a
   * time-bound claim ("shipping this month", "targeting X by mid-2026") so it
   * retires itself instead of quietly going stale.
   */
  until?: string;
  /** ISO date before which the line is not used. For seasonal lines. */
  from?: string;
}

export interface Bubble {
  text: string;
  visible: boolean;
  priority: Priority;
}

/**
 * Where the robot is standing. Phase 2 moves between these with a CSS
 * transition; the movement engine replaces that with an actual walk without
 * behaviors having to change.
 */
export type Pose = 'dock' | 'corner';

export type GameStatus = 'off' | 'playing' | 'won' | 'lost';

export interface GameState {
  status: GameStatus;
  collected: number;
  total: number;
  /** The robot's reaction to winning or falling, shown in the end panel. */
  message?: string;
}

export interface RobotState {
  mood: Mood;
  prop: Prop;
  pose: Pose;
  asleep: boolean;
  quiet: boolean;
  /** Sent to the corner by the visitor. Sulks, says nothing, stays put. */
  dnd: boolean;
  hop: boolean;
  /** Sideways shove, used by the tickle reaction. */
  nudge: number;
  trayOpen: boolean;
  game: GameState;
  bubble: Bubble;
  pupil: { x: number; y: number };
}

export interface SpeakOptions {
  priority?: Priority;
  holdMs?: number;
}

export interface EmoteStep {
  mood: Mood;
  ms: number;
}

/** The whole surface a behavior is allowed to touch. */
export interface RobotApi {
  speak(line: Line, opts?: SpeakOptions): void;
  setMood(mood: Mood, ms?: number): void;
  emote(sequence: EmoteStep[]): Promise<void>;
  sleep(): void;
  wake(): void;
  setProp(prop: Prop): void;
  setQuiet(on: boolean): void;
  setPose(pose: Pose): void;
  setDnd(on: boolean): void;
  setTray(open: boolean): void;
  setGame(patch: Partial<GameState>): void;
  hop(): void;
  /** Shove sideways by px, decays back to zero. */
  nudge(px: number): void;
  getState(): Readonly<RobotState>;
}

export interface RobotEvents {
  route: { path: string };
  tap: { pointerType: string };
  pointer: { x: number; y: number; overRobot: boolean };
  tick: { dt: number; now: number };
  konami: { on: boolean };
  quiet: { on: boolean };
  idle: { ms: number };
  wake: Record<string, never>;
  /** A tray entry was chosen. Payload is the entry id. */
  tray: { id: string };
  /** 0 at the top of the document, 1 when the bottom is on screen. */
  scroll: { depth: number };
}

export type Unsubscribe = () => void;

export interface BehaviorCtx {
  api: RobotApi;
  on<K extends keyof RobotEvents>(
    event: K,
    handler: (payload: RobotEvents[K]) => void
  ): Unsubscribe;
  emit<K extends keyof RobotEvents>(event: K, payload: RobotEvents[K]): void;
  /** True when the visitor asked for reduced motion. Behaviors must respect it. */
  reducedMotion(): boolean;
  /** True below the mobile breakpoint, where the bubble is suppressed. */
  compact(): boolean;
  path(): string;
}

export interface Behavior {
  id: string;
  setup(ctx: BehaviorCtx): void | Unsubscribe;
}
