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
}

export interface Bubble {
  text: string;
  visible: boolean;
  priority: Priority;
}

export interface RobotState {
  mood: Mood;
  prop: Prop;
  asleep: boolean;
  quiet: boolean;
  hop: boolean;
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
  hop(): void;
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
