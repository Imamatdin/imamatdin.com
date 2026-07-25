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
 *
 * Four lines from the original prototype were cut for failing rule 2:
 * "40+ taekwondo medals" (the site says he teaches taekwondo, and about/facts
 * lists basketball, not medals), "first laptop at 17", the nickname "iko", and
 * "the world's 4th-largest lake" (the site never ranks it).
 */

export type TimeBucket = 'morning' | 'afternoon' | 'evening' | 'night';

export const timeBucket = (): TimeBucket => {
  const h = new Date().getHours();
  if (h < 5) return 'night';
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
};

// src: pages/about/facts.tsx (Sleep), pages/index.tsx (Karakalpakstan)
export const GREETINGS: Record<TimeBucket, Line> = {
  morning: {
    text: "morning. he's a night owl forcing himself into mornings. i just run on requestAnimationFrame.",
    mood: 'happy',
  },
  afternoon: {
    text: 'afternoon. he builds, i mind the front desk. look around.',
    mood: 'happy',
  },
  evening: {
    text: 'evening. good hours for this kind of thing.',
    mood: 'neutral',
  },
  night: {
    text: "it's late. he works these hours too — night owl, on the record.",
    mood: 'sleepy',
  },
};

// Robot talking about itself — no factual claims, no source needed.
export const RETURN_GREETINGS: Line[] = [
  { text: 'you came back. i kept the lights on.', mood: 'happy' },
  { text: 'welcome back. nothing moved while you were gone.', mood: 'happy' },
  { text: "oh good, it's you again.", mood: 'wink' },
];

export const FACTS: Line[] = [
  // src: content/projects/radiative-cooling-control.mdx
  {
    text: 'his cooling agents hit 94.4% water savings in Seattle. ±0.5% across seeds — the boring kind of number you can trust.',
    mood: 'happy',
  },
  // src: content/projects/radiative-cooling-control.mdx
  {
    text: 'the next phase trains world models on 1.2 billion observations. i am roughly forty rectangles.',
    mood: 'thinking',
  },
  // src: content/projects/aral-basin-platform.mdx
  {
    text: 'the Aral Basin pipeline reads satellites back to Landsat, 1972. older than most languages you used today.',
    mood: 'neutral',
  },
  // src: content/projects/aral-basin-platform.mdx
  {
    text: '150+ years of records from 87 synoptic stations, and nobody had pointed deep learning at them.',
    mood: 'surprised',
  },
  // src: content/projects/aral-basin-platform.mdx
  {
    text: "he's fine-tuning a 600M-parameter geospatial model so farmers get dust-storm warnings early.",
    mood: 'happy',
  },
  // src: content/projects/sentinel.mdx
  {
    text: 'SENTINEL runs red agents attacking and blue agents defending. the whole thesis is that speed decides it.',
    mood: 'neutral',
  },
  // src: content/projects/thermotouch.mdx
  {
    text: 'ThermoTouch cools in 5-10ms with melting paraffin. no electricity at all on the cold side.',
    mood: 'thinking',
  },
  // src: content/projects/syn-cad.mdx
  {
    text: 'SynCAD turns plain English into STL files, compiles them, and feeds the errors back until they build.',
    mood: 'neutral',
  },
  // src: pages/about/facts.tsx (Languages)
  {
    text: 'Karakalpak, Russian, Uzbek, English, Turkish in progress. i speak one language and it has semicolons.',
    mood: 'wink',
  },
  // src: pages/about/facts.tsx (Origin)
  {
    text: "Nukus holds the world's second-largest collection of Russian avant-garde art. in the middle of a desert.",
    mood: 'surprised',
  },
  // src: pages/about/facts.tsx (Name)
  {
    text: "Imamatdin means 'pillar of faith'. mine is more of a load-bearing div.",
    mood: 'wink',
  },
  // src: pages/index.tsx
  {
    text: "he grew up where the dried lakebed makes the dust storms. that's why the environmental work exists.",
    mood: 'neutral',
  },
];

export const CLICK_LINES: Line[] = [
  { text: 'boop acknowledged.', mood: 'surprised' },
  { text: 'careful, the chassis is load-bearing.', mood: 'surprised' },
  { text: 'that tickled the cold plate.', mood: 'happy' },
  { text: 'you could click the projects instead. just saying.', mood: 'wink' },
];

export const WAKE_LINE: Line = { text: "oh! you're back. i was defragging.", mood: 'surprised' };
export const SLEEP_LINE: Line = { text: 'z z z …', mood: 'sleepy' };
