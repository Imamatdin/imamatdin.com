/**
 * Physics and world-building for the platformer.
 *
 * Pure functions and plain data — no React, no DOM writes. The behavior that
 * drives this owns the loop; everything here is testable in isolation.
 *
 * The approach is adapted from gazijarin/Gazi-V2's RobotGame, which had the
 * good idea of using the page's own text as level geometry. Two things are
 * done differently:
 *
 *  - Platform queries are cached and refreshed on scroll/resize rather than
 *    re-running querySelectorAll for nine selectors on every frame.
 *  - Collectibles are laid out from the real document height instead of a
 *    hardcoded list of coordinates, so the level fits whatever page it is on.
 */

export interface Body {
  /** Viewport pixels. Horizontal never scrolls, so this needs no conversion. */
  x: number;
  /** Document pixels. Converted with scrollY at draw time so the level scrolls. */
  docY: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  grounded: boolean;
}

export interface Platform {
  x: number;
  /** Document space, matching Body.docY. */
  y: number;
  w: number;
}

export interface Collectible {
  x: number;
  docY: number;
  collected: boolean;
}

export interface Input {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export const ROBOT_W = 52;
export const ROBOT_H = 62;

/**
 * Tuned up from Gazi's values (GRAVITY .22 / JUMP -7 / MAX_SPEED 1.8), which
 * were set for a 32px sprite. Ours is roughly twice that, so the same numbers
 * felt like walking through treacle.
 */
export const PHYSICS = {
  GRAVITY: 0.34,
  JUMP_FORCE: -9.2,
  MAX_SPEED: 3.4,
  ACCEL: 0.55,
  FRICTION: 0.82,
  /** Terminal velocity. Also what stops fast falls tunnelling through thin platforms. */
  TERMINAL: 11,
} as const;

const PLATFORM_SELECTORS = [
  'h1', 'h2', 'h3', 'p', 'li', 'a[href]', 'button', 'hr',
];

/** Ignore anything too narrow to stand on or too tall to be a ledge. */
const MIN_PLATFORM_W = 48;
const MAX_PLATFORM_H = 120;

/**
 * The page's own text, as level geometry. Culled generously around the
 * viewport so off-screen content costs nothing.
 */
export function collectPlatforms(doc: Document = document): Platform[] {
  const scrollY = window.scrollY;
  const top = scrollY - 400;
  const bottom = scrollY + window.innerHeight + 400;
  const platforms: Platform[] = [];

  for (const selector of PLATFORM_SELECTORS) {
    doc.querySelectorAll(selector).forEach((el) => {
      // The robot's own chrome is not scenery.
      if (el.closest('[data-robot-dock], [data-robot-hud]')) return;

      const rect = el.getBoundingClientRect();
      if (rect.width < MIN_PLATFORM_W || rect.height > MAX_PLATFORM_H) return;
      if (rect.height < 2) return;

      const docTop = rect.top + scrollY;
      if (docTop > bottom || docTop + rect.height < top) return;

      platforms.push({ x: rect.left, y: docTop, w: rect.width });
    });
  }

  // The floor of the document, so there is always somewhere to land.
  const floor = Math.max(
    doc.documentElement.scrollHeight,
    doc.body.scrollHeight
  );
  platforms.push({ x: 0, y: floor - 8, w: window.innerWidth });

  return platforms;
}

/** Spreads collectibles down the page, keeping clear of the platforms. */
export function layoutCollectibles(count: number, platforms: Platform[]): Collectible[] {
  const height = Math.max(
    document.documentElement.scrollHeight,
    window.innerHeight * 2
  );
  const usable = height - window.innerHeight * 0.6;
  const step = usable / (count + 1);
  const items: Collectible[] = [];

  for (let i = 0; i < count; i += 1) {
    const docY = window.innerHeight * 0.4 + step * (i + 1);
    // Alternate sides so the level reads as a route rather than a column.
    const lane = i % 2 === 0 ? 0.25 : 0.7;
    let x = window.innerWidth * lane;

    // Nudge off anything it would be buried inside.
    const clash = platforms.find(
      (p) => Math.abs(p.y - docY) < 24 && x > p.x - 20 && x < p.x + p.w + 20
    );
    if (clash) x = Math.min(window.innerWidth - 40, clash.x + clash.w + 32);

    items.push({ x, docY, collected: false });
  }

  return items;
}

/**
 * One simulation step. Mutates `body` — it is a ref-held object updated 60
 * times a second, and allocating a new one each frame is pure waste.
 */
export function step(body: Body, input: Input, platforms: Platform[]): void {
  const { GRAVITY, JUMP_FORCE, MAX_SPEED, ACCEL, FRICTION, TERMINAL } = PHYSICS;

  if (input.left) {
    body.vx = Math.max(body.vx - ACCEL, -MAX_SPEED);
    body.facing = -1;
  } else if (input.right) {
    body.vx = Math.min(body.vx + ACCEL, MAX_SPEED);
    body.facing = 1;
  } else {
    body.vx *= FRICTION;
    if (Math.abs(body.vx) < 0.05) body.vx = 0;
  }

  if (input.jump && body.grounded) {
    body.vy = JUMP_FORCE;
    body.grounded = false;
  }

  body.vy = Math.min(body.vy + GRAVITY, TERMINAL);
  body.x += body.vx;
  body.docY += body.vy;

  // Walls
  if (body.x < 0) {
    body.x = 0;
    body.vx = 0;
  }
  const maxX = window.innerWidth - ROBOT_W;
  if (body.x > maxX) {
    body.x = maxX;
    body.vx = 0;
  }

  // Landing. Swept against the previous position so a fast fall cannot pass
  // straight through a one-pixel-thick paragraph edge.
  body.grounded = false;
  if (body.vy >= 0) {
    const feet = body.docY + ROBOT_H;
    const prevFeet = feet - body.vy;

    for (const platform of platforms) {
      const overlapsX = body.x + ROBOT_W > platform.x + 2 && body.x < platform.x + platform.w - 2;
      if (!overlapsX) continue;
      if (prevFeet <= platform.y + 6 && feet >= platform.y - 1) {
        body.docY = platform.y - ROBOT_H;
        body.vy = 0;
        body.grounded = true;
        break;
      }
    }
  }
}

/** True once the robot has fallen well past the bottom of the viewport. */
export function hasFallenOut(body: Body): boolean {
  return body.docY - window.scrollY > window.innerHeight + 160;
}

const REACH_X = 30;
const REACH_Y = 32;

/** Marks anything within reach as collected, returning how many were taken. */
export function gather(body: Body, items: Collectible[]): number {
  const cx = body.x + ROBOT_W / 2;
  const cy = body.docY + ROBOT_H / 2;
  let taken = 0;

  for (const item of items) {
    if (item.collected) continue;
    if (Math.abs(cx - item.x) < REACH_X && Math.abs(cy - item.docY) < REACH_Y) {
      item.collected = true;
      taken += 1;
    }
  }

  return taken;
}
