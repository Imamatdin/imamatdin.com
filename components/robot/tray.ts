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
  when?: (state: RobotState, ctx: { konami: boolean }) => boolean;
}

export const TRAY_ITEMS: TrayItem[] = [
  { id: 'say', label: 'say something' },
  { id: 'shh', label: 'shh', when: (s) => !s.dnd },
  { id: 'come-back', label: 'come back', when: (s) => s.dnd },
  { id: 'dance', label: 'dance', when: (_s, ctx) => ctx.konami },
  { id: 'mute', label: 'go quiet', when: (s) => !s.quiet },
];

export const visibleTrayItems = (state: RobotState, konami: boolean): TrayItem[] =>
  TRAY_ITEMS.filter((item) => !item.when || item.when(state, { konami }));
