import { Priority } from './types';
import type { Mood } from './types';

/**
 * The typed boundary between the rest of the site and the robot. Anything
 * outside components/robot/ talks to it through these helpers and never
 * imports the brain, so the robot stays removable in one line.
 */

const SAY = 'robot:say';
const QUIET = 'robot:quiet';
const QUIET_CHANGED = 'robot:quiet-changed';
const COMMAND = 'robot:command';

/** Bubbles are small. Anything longer is a bug in the caller, not a scroll. */
export const MAX_TEXT = 160;

export interface SayDetail {
  text: string;
  mood: Mood;
  priority: Priority;
}

export function botSay(
  text: string,
  mood: Mood = 'happy',
  priority: Priority = Priority.User
): void {
  if (typeof window === 'undefined') return;
  const clean = text.trim().slice(0, MAX_TEXT);
  if (!clean) return;
  window.dispatchEvent(
    new CustomEvent<SayDetail>(SAY, { detail: { text: clean, mood, priority } })
  );
}

export function onBotSay(handler: (detail: SayDetail) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<SayDetail>).detail;
    if (!detail || typeof detail.text !== 'string') return;
    // Clamped here as well as in botSay: the raw event is a public extension
    // point, and the bubble's layout depends on this holding however the
    // event was produced.
    const text = detail.text.trim().slice(0, MAX_TEXT);
    if (!text) return;
    handler({ ...detail, text });
  };
  window.addEventListener(SAY, listener);
  return () => window.removeEventListener(SAY, listener);
}

/** `on: null` toggles. */
export function botSetQuiet(on: boolean | null): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<{ on: boolean | null }>(QUIET, { detail: { on } }));
}

export function onBotQuietRequest(handler: (on: boolean | null) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const listener = (e: Event) => handler((e as CustomEvent<{ on: boolean | null }>).detail.on);
  window.addEventListener(QUIET, listener);
  return () => window.removeEventListener(QUIET, listener);
}

/**
 * Triggers a tray action from outside the robot — the command palette uses
 * this. Ids are the ones defined in tray.ts.
 */
export function botCommand(id: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<{ id: string }>(COMMAND, { detail: { id } }));
}

export function onBotCommand(handler: (id: string) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const listener = (e: Event) => handler((e as CustomEvent<{ id: string }>).detail.id);
  window.addEventListener(COMMAND, listener);
  return () => window.removeEventListener(COMMAND, listener);
}

/** Fired by the robot so UI elsewhere (the command palette) can label itself. */
export function announceQuiet(on: boolean): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<{ on: boolean }>(QUIET_CHANGED, { detail: { on } }));
}

export function onQuietChanged(handler: (on: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const listener = (e: Event) => handler((e as CustomEvent<{ on: boolean }>).detail.on);
  window.addEventListener(QUIET_CHANGED, listener);
  return () => window.removeEventListener(QUIET_CHANGED, listener);
}
