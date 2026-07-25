import type { RobotState } from './types';

/**
 * The menu that opens when you tap the robot.
 *
 * Adding an entry means adding it here and handling its id in
 * behaviors/trayActions.ts. Robot.tsx just renders whatever this returns.
 */
export interface TrayItem {
  id: string;
  label: string;
  /** Entries hide themselves when they would not make sense. */
  when?: (state: RobotState, ctx: { konami: boolean; compact: boolean }) => boolean;
}

/**
 * Labels say what will happen, not how you'd shush a person. "shh" used to sit
 * next to "go quiet" meaning two different things — one sends it to the corner,
 * the other mutes it — which is exactly as confusing as it sounds.
 */
export const TRAY_ITEMS: TrayItem[] = [
  { id: 'say', label: 'say something' },
  // Needs a keyboard, so it is not offered where there isn't one.
  { id: 'play', label: 'play a game', when: (_s, ctx) => !ctx.compact },
  { id: 'dance', label: 'play a set', when: (_s, ctx) => ctx.konami },
  { id: 'corner', label: 'go sit in the corner', when: (s) => !s.dnd },
  { id: 'come-back', label: 'come back', when: (s) => s.dnd },
  { id: 'mute', label: 'stop talking', when: (s) => !s.quiet },
  // Without this there is no way back: muting hid the entry and left the robot
  // silent forever, with "say something" quietly doing nothing.
  { id: 'unmute', label: 'you can talk again', when: (s) => s.quiet },
];

export const visibleTrayItems = (
  state: RobotState,
  konami: boolean,
  compact: boolean
): TrayItem[] => TRAY_ITEMS.filter((item) => !item.when || item.when(state, { konami, compact }));
