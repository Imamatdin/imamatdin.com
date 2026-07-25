import type { Line } from './types';

/**
 * The ONLY place the robot's words come from.
 *
 * Rules, non-negotiable:
 *  1. Nothing here is generated, fetched, or templated. Curated strings only.
 *  2. Every claim about Imamatdin traces to real site content, and the source
 *     file is named in the comment above the line. If you cannot cite it, it
 *     does not go in.
 *  3. Lines the robot makes about ITSELF are jokes and need no source — but
 *     they must not smuggle in a claim about him.
 *  4. No counts, versions or dates baked into prose. Those rot, and a robot
 *     confidently reciting a stale number is worse than one saying nothing.
 *     If a line must make a time-bound claim, give it an `until` date.
 *
 * Page-specific lines live in routes.ts. This file holds the lines that are
 * about interacting with the robot rather than about the site.
 *
 * Four prototype lines were cut for failing rule 2: a sports medal count, a
 * claim about his first laptop, a nickname, and ranking the Aral Sea as the
 * world's 4th-largest lake. None of them were true of the site's content.
 */

export type TimeBucket = 'morning' | 'afternoon' | 'evening' | 'night';

export const timeBucket = (): TimeBucket => {
  const h = new Date().getHours();
  if (h < 5) return 'night';
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
};

// src: pages/about/facts.tsx (Sleep) for the night-owl reference.
export const GREETINGS: Record<TimeBucket, Line> = {
  morning: {
    text: "morning. he's a night owl forcing himself into mornings. i just run on requestAnimationFrame.",
    mood: 'happy',
  },
  afternoon: { text: 'afternoon. he builds, i mind the front desk. look around.', mood: 'happy' },
  evening: { text: 'evening. good hours for this kind of thing.', mood: 'neutral' },
  night: { text: "it's late. he works these hours too — night owl, on the record.", mood: 'sleepy' },
};

// Robot talking about itself — no factual claims, no source needed.
export const RETURN_GREETINGS: Line[] = [
  { text: 'you came back. i kept the lights on.', mood: 'happy' },
  { text: 'welcome back. nothing moved while you were gone.', mood: 'happy' },
  { text: "oh good, it's you again.", mood: 'wink' },
];

export const CLICK_LINES: Line[] = [
  { text: 'boop acknowledged.', mood: 'surprised' },
  { text: 'careful, the chassis is load-bearing.', mood: 'surprised' },
  { text: 'that tickled the cold plate.', mood: 'happy' },
  { text: 'you could read the page instead. just saying.', mood: 'wink' },
];

export const TICKLE_LINES: Line[] = [
  { text: 'hey — hey! that is my chassis.', mood: 'happy' },
  { text: 'haha — no — stop, my joints are not rated for this.', mood: 'happy' },
  { text: 'this is not in the spec. this is NOT in the spec.', mood: 'happy' },
];

export const TICKLE_STOP_LINES: Line[] = [
  { text: 'ok ok ok. stop. please. i yield.', mood: 'surprised' },
  { text: 'enough! i am going to stand over here now.', mood: 'surprised' },
];

export const TRAY_HINT: Line = {
  text: 'need something? shh puts me in the corner, and i can go quiet entirely.',
  mood: 'neutral',
};

export const DND_LINES: Line[] = [
  { text: 'oh. ok. i will be over here if you need me.', mood: 'sad' },
];

export const DND_RETURN_LINES: Line[] = [
  { text: 'back? good. i was counting the pixels.', mood: 'happy' },
  { text: 'oh thank goodness. the corner is boring.', mood: 'happy' },
];

export const QUIET_ON_LINE: Line = { text: 'understood. going quiet.', mood: 'neutral' };
export const QUIET_OFF_LINES: Line[] = [
  { text: 'sound is back. i will keep it relevant.', mood: 'happy' },
];

// Fires when konami mode turns on. Robot talking about itself.
export const KONAMI_LINES: Line[] = [
  { text: 'wait. WAIT. you found the konami code. hold on, i have something for this.', mood: 'surprised' },
];

// Opening the set.
export const DJ_LINES: Line[] = [
  { text: 'nobody told me the whole site goes green. setting up.', mood: 'dj' },
  { text: 'this is the only easter egg i get. let me have it.', mood: 'dj' },
  { text: 'decks out. one set, no requests, no refunds.', mood: 'dj' },
];

/**
 * Played in order through the set, so it builds instead of repeating one line.
 * All robot self-talk — no claims about anyone, and no real track titles.
 */
export const DJ_SET_LINES: Line[] = [
  { text: 'starting slow. four to the floor. the floor is a paragraph element.', mood: 'dj' },
  { text: 'this next one is called "Ninety Four Point Four". it goes hard.', mood: 'dj' },
  { text: 'unce. unce. unce. unce.', mood: 'dj' },
  { text: 'building… building… brace the layout, the drop is coming.', mood: 'surprised' },
  { text: 'DROP', mood: 'dj' },
  { text: 'i only know one genre and it is called terminal.', mood: 'dj' },
  { text: 'somebody in the back is on a phone. i can see you. no bubble for you.', mood: 'wink' },
  { text: 'remix of the antenna blink. it is mostly the antenna blink.', mood: 'dj' },
];

export const DJ_END_LINES: Line[] = [
  { text: 'and that was the set. tip your compositor.', mood: 'happy' },
  { text: 'ok. packing up. the green stays, i do not.', mood: 'happy' },
];

// Rewards actually reaching the bottom of a long page.
export const SCROLL_END_LINES: Line[] = [
  { text: 'you read the whole thing. genuinely, that is rare.', mood: 'happy' },
  { text: 'all the way down. respect.', mood: 'happy' },
];

export const FELL_LINES: Line[] = [
  { text: 'you fell. i fell. we fell.', mood: 'surprised' },
  { text: 'you fell off the page. the page is very tall.', mood: 'surprised' },
  { text: 'you fell. the text was RIGHT THERE.', mood: 'surprised' },
];

export const WON_LINES: Line[] = [
  { text: 'all of them. you read this site sideways and i respect it.', mood: 'happy' },
];

export const WAKE_LINE: Line = { text: "oh! you're back. i was defragging.", mood: 'surprised' };
export const SLEEP_LINE: Line = { text: 'z z z …', mood: 'sleepy' };
