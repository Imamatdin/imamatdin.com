import type { Line } from './types';

/**
 * What the robot knows about the site it lives on.
 *
 * Every route carries its own pool of lines. The robot only ever says things
 * that are true of the page you are actually looking at — it does not recite
 * project statistics at you on the home page.
 *
 * Three flags drive behavior:
 *  - `quiet`: long-form reading. The robot stays present but stops talking.
 *  - `thin`:  the page is unfinished. Never recommend it, never talk it up.
 *  - `until`: on individual lines, an expiry date for time-bound claims.
 *
 * Sources are cited per line. Nothing here is generated. See lines.ts for the
 * rules this file follows.
 */

export type RouteKind = 'home' | 'index' | 'article' | 'project' | 'meta';

export interface RouteEntry {
  id: string;
  kind: RouteKind;
  /** Tested against the pathname, most specific entry first. */
  match: RegExp;
  lines: Line[];
  quiet?: boolean;
  thin?: boolean;
}

/* ------------------------------------------------------------------ *
 * Per-item lines, keyed by slug. Covers content/projects/ and
 * content/deep-dives/ — slugs are unique across both.
 * ------------------------------------------------------------------ */

export const PROJECT_LINES: Record<string, Line[]> = {
  // src: public/research/climate-adaptive-drl-radiative-cooling.pdf (abstract)
  // and content/projects/radiative-cooling-control.mdx
  'radiative-cooling-control': [
    { text: '94.4% water savings in Seattle, ±0.5% across seeds. the variance is the part worth looking at.', mood: 'happy' },
    { text: 'SAC took Seattle, TD3 took Houston at 70.8%. three climate zones, three seeds each.', mood: 'neutral' },
    { text: 'forecasts bought 10.2 points in Seattle and nothing in the humid regions. that ablation is the interesting bit.', mood: 'thinking' },
    { text: 'the expansion runs Decision Transformers and Dreamer-style world models on 1.2 billion observations.', mood: 'thinking' },
    { text: 'the paper is on this page as a PDF. six pages. i have read it more times than anyone.', mood: 'wink' },
  ],
  // src: content/projects/aral-basin-platform.mdx
  'aral-basin-platform': [
    { text: 'fifty years of satellites and 150 years of weather records, and the published work stops at random forests.', mood: 'surprised' },
    { text: "Prithvi-EO-2.0 — 600M parameters, NASA and IBM's — fine-tuned for dust storm early warning.", mood: 'happy' },
    { text: 'six modules: dust alerts, irrigation, water allocation, yield, salinity, crop disease.', mood: 'neutral' },
  ],
  // src: content/projects/sentinel.mdx
  sentinel: [
    { text: 'red team agents attack, blue team agents defend, both in real time. speed is the whole thesis.', mood: 'surprised' },
    { text: 'Cerebras at 1000-1700 tok/s blocks 70-80%. slow it to a few seconds and it catches 10-20%.', mood: 'thinking' },
    { text: 'it runs against OWASP Juice Shop — a hundred-plus documented vulnerabilities to chew on.', mood: 'neutral' },
  ],
  // src: content/projects/thermotouch.mdx
  thermotouch: [
    { text: 'melting paraffin does the cooling. no electricity on the cold side at all.', mood: 'happy' },
    { text: 'under 5g per actuator against 50g for Peltier. 2W against 125W.', mood: 'surprised' },
    { text: 'cooling in 5-10ms, heating in 250ms — matched to how much more sensitive we are to cold.', mood: 'thinking' },
  ],
  // src: content/projects/agentic-os.mdx
  'agentic-os': [
    { text: 'Arch and Hyprland, with the AI tooling wired into the desktop rather than sitting in a tab.', mood: 'neutral' },
    { text: 'it absorbed a separate assistant project — meeting transcription, diarization, a voice pipeline.', mood: 'thinking' },
  ],
  // src: content/projects/imamatdin-com.mdx
  'imamatdin-com': [
    { text: 'this one is the site you are standing in. i am a load-bearing part of it now.', mood: 'wink' },
    { text: 'Next.js, MDX, and a colour palette with exactly four variables. i use all four.', mood: 'happy' },
    { text: 'the whole thing is modelled on a notebook. da Vinci had codices, he has a content directory.', mood: 'neutral' },
  ],
  // src: content/projects/flowcored.mdx
  flowcored: [
    { text: 'Flowcored is his automation business. CRM pipelines, intake, drafting with human review gates.', mood: 'neutral' },
  ],
  // src: content/projects/agora-library-bot.mdx
  'agora-library-bot': [
    { text: 'a Telegram bot for cataloguing and sharing books between communities.', mood: 'neutral' },
  ],
  // src: content/projects/buildcored.mdx and buildcored.com
  buildcored: [
    { text: 'a builder community, 1,500+ members, all of it open source and MIT licensed.', mood: 'happy' },
    { text: 'four rules. my favourite is "if it runs, it counts". i barely run and i count.', mood: 'wink' },
    { text: 'the next cohort is hardware, in person, in Tashkent this August.', mood: 'neutral' },
  ],
};

/* ------------------------------------------------------------------ *
 * Route registry — most specific first, resolveRoute takes the first hit
 * ------------------------------------------------------------------ */

export const ROUTES: RouteEntry[] = [
  {
    id: 'project-detail',
    kind: 'project',
    match: /^\/projects\/[^/]+/,
    lines: [], // filled per-slug from PROJECT_LINES
  },
  {
    id: 'projects',
    kind: 'index',
    match: /^\/projects\/?$/,
    // src: content/projects/*.mdx
    lines: [
      { text: 'everything he has built or is building. hover one and i will tell you what it does.', mood: 'happy' },
      { text: 'the cooling one has the cleanest numbers, and a paper you can actually read.', mood: 'neutral' },
      { text: 'this order is deliberate, not chronological. the first one is first for a reason.', mood: 'wink' },
    ],
  },
  {
    id: 'reading-detail',
    kind: 'article',
    match: /^\/reading\/[^/]+/,
    quiet: true,
    lines: [],
  },
  {
    id: 'reading',
    kind: 'index',
    match: /^\/reading\/?$/,
    // src: pages/reading.tsx, content/books/, pages/about/facts.tsx (Reading)
    lines: [
      { text: 'the library. Russian literature mostly, and he reads several at once on purpose.', mood: 'happy' },
      { text: 'one fiction, one non-fiction, one philosophical, in parallel. he says it keeps his mind fresh.', mood: 'neutral' },
      { text: 'each one has notes attached. click a title if you want the actual thinking.', mood: 'wink' },
    ],
  },
  {
    id: 'deep-dive-detail',
    kind: 'article',
    match: /^\/deep-dives\/[^/]+/,
    quiet: true,
    lines: [],
  },
  {
    id: 'deep-dives',
    kind: 'index',
    match: /^\/deep-dives\/?$/,
    // src: content/deep-dives/*.mdx
    lines: [
      { text: 'research proposals. history, engineering and cognition, mostly where they overlap.', mood: 'thinking' },
      { text: 'the Antikythera one and the desert grammar one are the two i would start with.', mood: 'neutral' },
      { text: 'these are proposals, not results. the difference matters and he keeps it honest.', mood: 'neutral' },
    ],
  },
  {
    id: 'writing-detail',
    kind: 'article',
    match: /^\/writing\/[^/]+/,
    quiet: true,
    lines: [],
  },
  {
    id: 'writing',
    kind: 'index',
    match: /^\/writing\/?$/,
    // src: pages/writing/index.tsx, content/writing/external.json
    lines: [
      { text: 'his writing. some of it lives here, some of it points out to Medium and Substack.', mood: 'neutral' },
      { text: 'he writes to work out what he thinks. his words, on the facts page.', mood: 'neutral' },
    ],
  },
  {
    id: 'now',
    kind: 'meta',
    match: /^\/now\/?$/,
    // src: pages/now.tsx — currently a single placeholder line, so the robot
    // does not promise any detail the page does not have.
    lines: [
      { text: 'one line. he ran out of time to write the long version, which is itself the update.', mood: 'wink' },
      { text: 'AI and robotics. that is genuinely all this page says today.', mood: 'neutral' },
    ],
  },
  {
    id: 'facts',
    kind: 'meta',
    match: /^\/about\/facts\/?$/,
    // src: pages/about/facts.tsx
    lines: [
      { text: 'five languages, and Turkish still in progress. i manage one, and it has semicolons.', mood: 'wink' },
      { text: 'Nukus holds the second-largest collection of Russian avant-garde art in the world. in a desert.', mood: 'surprised' },
      { text: "Imamatdin means 'pillar of faith'. mine is more of a load-bearing div.", mood: 'wink' },
      { text: "he can't remember faces but never forgets a conversation. i have the opposite problem.", mood: 'thinking' },
    ],
  },
  {
    id: 'stack',
    kind: 'meta',
    match: /^\/about\/stack\/?$/,
    lines: [{ text: 'the tools he actually uses, rather than the ones that look good in a list.', mood: 'neutral' }],
  },
  {
    id: 'secret',
    kind: 'meta',
    match: /^\/secret\/?$/,
    lines: [
      { text: 'you found this on purpose. that is the kind of person the page is written for.', mood: 'surprised' },
    ],
  },
  {
    // These pages still contain placeholder copy. The robot stays out of the
    // way and never points anyone here until they are written.
    id: 'about-unfinished',
    kind: 'meta',
    match: /^\/about\/(ideas|academics)/,
    thin: true,
    quiet: true,
    lines: [],
  },
  {
    id: 'home',
    kind: 'home',
    match: /^\/$/,
    // src: pages/index.tsx — every line below is about THIS page's content.
    // Note there is no "and this is why he does it" line. He does not frame the
    // work that way, so neither does the robot.
    lines: [
      { text: 'AI, robotics and mechanical engineering, where they overlap. that is the whole pitch.', mood: 'happy' },
      { text: 'gap year, spent building. that is the opening line and it is accurate.', mood: 'happy' },
      { text: 'four things on that list, and he is actively building all four. i checked.', mood: 'happy' },
      { text: 'Nukus, Karakalpakstan. that is where this is being written from.', mood: 'neutral' },
      { text: 'Dostoevsky, Tolstoy, Chekhov, and Ibrayim Yusupov. the library is up in the nav.', mood: 'neutral' },
      { text: 'five languages, Turkish still in progress. i manage one and it has semicolons.', mood: 'wink' },
      { text: 'he writes to work out what he thinks. his words, not mine — mine are all curated.', mood: 'wink' },
      { text: 'he is looking for compute and research funding. the email is in the footer.', mood: 'happy' },
    ],
  },
];

/** Universally true, safe on any page. Used only when a route pool runs dry. */
export const FALLBACK_LINES: Line[] = [
  { text: 'take your time. i am not going anywhere.', mood: 'neutral' },
  { text: 'everything on this site is hand-written. including me, unfortunately.', mood: 'wink' },
  { text: 'there is a command palette on ctrl-k, if clicking is not your thing.', mood: 'neutral' },
];

const DEFAULT_ROUTE: RouteEntry = { id: 'unknown', kind: 'meta', match: /.^/, lines: [] };

/** Strips query and hash, then finds the first matching entry. */
export function resolveRoute(rawPath: string): RouteEntry {
  const path = rawPath.split(/[?#]/)[0] || '/';
  return ROUTES.find((route) => route.match.test(path)) ?? DEFAULT_ROUTE;
}

/** The slug of a project page, or null if this isn't one. */
export function projectSlug(rawPath: string): string | null {
  const match = /^\/projects\/([^/?#]+)/.exec(rawPath);
  return match ? match[1] : null;
}

/** Drops lines whose validity window has passed — see Line.until. */
export function isCurrent(line: Line, now = new Date()): boolean {
  if (line.until && now > new Date(`${line.until}T23:59:59Z`)) return false;
  if (line.from && now < new Date(`${line.from}T00:00:00Z`)) return false;
  return true;
}

/** Everything the robot may say on a given path, freshest-first filtering applied. */
export function linesForPath(rawPath: string, now = new Date()): Line[] {
  const route = resolveRoute(rawPath);
  const slug = projectSlug(rawPath);
  const pool = slug ? PROJECT_LINES[slug] ?? [] : route.lines;
  return pool.filter((line) => isCurrent(line, now));
}
