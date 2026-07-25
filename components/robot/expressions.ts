import type { Mood } from './types';

/**
 * Every surface derives from the four theme variables in styles/terminal.css.
 * No hex values live here — that is what lets the robot follow light, dark and
 * konami mode through the cascade alone, with no JS theme branch.
 */
export const C = {
  bg: 'var(--bg)',
  text: 'var(--text)',
  accent: 'var(--accent)',
  subtle: 'var(--subtle)',
  shell: 'color-mix(in srgb, var(--text) 7%, var(--bg))',
  screen: 'color-mix(in srgb, var(--text) 3%, var(--bg))',
  outline: 'color-mix(in srgb, var(--text) 22%, var(--bg))',
  dim: 'color-mix(in srgb, var(--subtle) 45%, var(--bg))',
} as const;

export type EyeShape = 'round' | 'arc' | 'up' | 'half' | 'wink' | 'droop';
export type MouthShape = 'bar' | 'frown';

export interface Expression {
  eye: EyeShape;
  eyeR: number;
  mouth: { w: number; h: number; y: number; shape?: MouthShape };
  /** Which theme variable the face lights up with — this is how mood reads as color. */
  led: string;
  armL: number;
  armR: number;
}

export const EXPRESSIONS: Record<Mood, Expression> = {
  neutral:   { eye: 'round', eyeR: 4,   mouth: { w: 8,  h: 2.5, y: 38 },                    led: C.accent, armL: 0,   armR: 0 },
  happy:     { eye: 'arc',   eyeR: 4,   mouth: { w: 12, h: 5,   y: 36 },                    led: C.accent, armL: -20, armR: 20 },
  surprised: { eye: 'round', eyeR: 5.5, mouth: { w: 6,  h: 6,   y: 36 },                    led: C.text,   armL: -40, armR: 40 },
  thinking:  { eye: 'up',    eyeR: 3.5, mouth: { w: 5,  h: 2.5, y: 39 },                    led: C.subtle, armL: 0,   armR: 55 },
  sleepy:    { eye: 'half',  eyeR: 4,   mouth: { w: 7,  h: 2,   y: 39 },                    led: C.dim,    armL: 8,   armR: -8 },
  wink:      { eye: 'wink',  eyeR: 4,   mouth: { w: 10, h: 4,   y: 37 },                    led: C.accent, armL: 0,   armR: -35 },
  sad:       { eye: 'droop', eyeR: 3.5, mouth: { w: 9,  h: 3,   y: 40, shape: 'frown' },    led: C.subtle, armL: 14,  armR: -14 },
  dj:        { eye: 'arc',   eyeR: 4,   mouth: { w: 11, h: 5,   y: 36 },                    led: C.accent, armL: -55, armR: 45 },
};

export const expressionFor = (mood: Mood): Expression =>
  EXPRESSIONS[mood] ?? EXPRESSIONS.neutral;
