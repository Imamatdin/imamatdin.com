# Robot companion

A mascot that lives in the bottom-right corner of every page. It reacts to
where you are, what you hover, and what you do to it — and it can be told to go
away.

```
RobotCompanion.tsx   mount point. owns the brain, translates DOM events into
                     robot events, runs the behavior registry.
Robot.tsx            presentational. renders the dock, bubble, tray and SVG.
useRobotBrain.ts     all state, the action API, the speech queue.
routes.ts            what the robot knows about each page. line pools live here.
lines.ts             lines about interacting with the robot rather than the site.
tray.ts              the menu that opens when you tap it.
bus.ts               typed boundary for the rest of the site.
storage.ts           SSR-safe persistence.
motion.ts            physics and level geometry for the game.
useGame.ts           the platformer loop.
behaviors/           one module per ability. index.ts is the registry.
parts/               SVG pieces.
```

## Rules this code follows

1. **No generated text.** Everything the robot says is a curated string in
   `routes.ts` or `lines.ts`. Nothing is templated, fetched, or produced by a
   model. Every claim about Imamatdin cites its source file in a comment above
   the line. If you cannot cite it, it does not go in.
2. **No new colors.** Every fill derives from the four theme variables in
   `styles/terminal.css` (`--bg`, `--text`, `--accent`, `--subtle`), with
   `color-mix()` for surfaces. This is why the robot follows light, dark and
   konami mode with no theme branch in JS. Mood is expressed through *which*
   variable a part uses and through geometry — never a new hue.
3. **Client-side only.** Mounted with `dynamic(..., { ssr: false })`.
4. **Reduced motion is respected per behavior,** not with a blanket
   `animation: none`. Blinking, bubble fades and expression changes carry
   meaning and stay; floating, hopping and the equaliser go.
5. **No new dependencies.** React, CSS and SVG.
6. **No counts, versions or dates in prose.** They rot. If a line must make a
   time-bound claim, give it an `until` date and it retires itself.

## Adding a behavior

A behavior is an object with an `id` and a `setup` that receives a context and
optionally returns a cleanup function. Registering it means adding one line to
`behaviors/index.ts`. `Robot.tsx` and `useRobotBrain.ts` should not need to
change.

### Worked example: yawn at midnight

`behaviors/midnightYawn.ts`:

```ts
import { Priority } from '../types';
import type { Behavior } from '../types';
import { createTimers } from './util';

const YAWN = { text: 'it is midnight. even i have a duty cycle.', mood: 'sleepy' } as const;

export const midnightYawn: Behavior = {
  id: 'midnight-yawn',
  setup({ api, reducedMotion }) {
    const timers = createTimers();
    let yawnedOn = -1;

    const check = () => {
      const now = new Date();
      const isMidnightHour = now.getHours() === 0;

      // Once per calendar day, not once per minute of the midnight hour.
      if (isMidnightHour && yawnedOn !== now.getDate()) {
        yawnedOn = now.getDate();
        api.speak(YAWN, { priority: Priority.Idle, holdMs: 6000 });
        if (!reducedMotion()) {
          api.emote([
            { mood: 'sleepy', ms: 1400 },
            { mood: 'surprised', ms: 500 },
            { mood: 'sleepy', ms: 1200 },
          ]);
        }
      }

      timers.later(check, 60_000);
    };

    check();
    return () => timers.clearAll();
  },
};
```

Then in `behaviors/index.ts`:

```ts
import { midnightYawn } from './midnightYawn';

export const BEHAVIORS: Behavior[] = [
  // ...
  midnightYawn,
];
```

That is the whole change. Nothing else in the robot is touched.

## The action API

Everything a behavior may do to the robot:

| call | effect |
| --- | --- |
| `speak(line, { priority, holdMs })` | say something, subject to the queue below |
| `setMood(mood, ms?)` | change expression, optionally reverting after `ms` |
| `emote(steps)` | run a sequence of expressions; a later call cancels an earlier one |
| `sleep()` / `wake()` | doze off / come round |
| `setProp(prop)` | `none`, `laptop`, `headphones` |
| `setPose(pose)` | `dock` or `corner` |
| `setDnd(on)` | send it to the corner to sulk, persisted |
| `setQuiet(on)` | silence the bubble entirely, persisted |
| `setTray(open)` | open or close the menu |
| `setGame(patch)` | game status and score |
| `hop()` / `nudge(px)` | small physical reactions |
| `getState()` | current state, read synchronously |

`getState()` is a synchronous read of the authoritative object, not a React
snapshot — so a behavior reacting to an event always sees current values.

## Events

`ctx.on(event, handler)` returns an unsubscribe function.

| event | payload | fired when |
| --- | --- | --- |
| `route` | `{ path }` | navigation completes |
| `tap` | `{ pointerType }` | the robot is clicked |
| `pointer` | `{ x, y, overRobot }` | the cursor moves |
| `tick` | `{ dt, now }` | every animation frame |
| `scroll` | `{ depth }` | scrolling, `0`–`1` down the document |
| `konami` | `{ on }` | hacker mode toggles |
| `tray` | `{ id }` | a tray entry or palette command fires |

`ctx` also carries `path()`, `reducedMotion()` and `compact()` (below the mobile
breakpoint).

## The speech queue

Lines have a priority: `Idle < Route < Reaction < User`.

- Background chatter never interrupts a line already showing.
- A `User` line always gets through, because tapping twice and being ignored
  reads as broken.
- The bubble retires with its hold timer, so nothing lingers on screen once the
  robot goes quiet.
- On phones the bubble is suppressed entirely except for `User` lines, so idle
  chatter can never cover the content.

## Page awareness

`routes.ts` is the registry of what the robot knows about the site. Each route
carries its own pool of lines, and project pages have per-slug pools. Three
flags drive the rest:

- `quiet` — long-form reading. Present but silent.
- `thin` — the page still contains placeholder copy. Never commented on, never
  recommended. Pointing visitors at `[Replace this with your story]` is worse
  than saying nothing.
- `until` on a line — an expiry date for time-bound claims.

To teach it about a new page, add an entry to `ROUTES` with lines that are true
of *that* page. To add lines for a project, add to `PROJECT_LINES` under the
slug from `content/projects/`. Hover detection is delegated from the document,
so a new project link anywhere on the site is picked up with no page edits.

## The game

Tapping the robot and choosing *play* — or `Play with Robot` in the command
palette — turns it into a platformer where the page's own text is the floor.
Arrows or WASD, escape to stop.

The approach is adapted from [gazijarin/Gazi-V2]'s `RobotGame`, which had the
good idea of using DOM rects as level geometry. Two things are done
differently: platform queries are cached and refreshed on a cadence rather than
re-running `querySelectorAll` every frame, and collectibles are laid out from
the real document height instead of a hardcoded coordinate list, so the level
fits whatever page it is on.

The game is a *mode*, not a behavior — it takes the robot out of its dock — so
it lives in `useGame.ts` and is started from `RobotCompanion.tsx`. Simulation
state is held in refs and positions are written straight to the DOM; React
state carries only what the HUD shows, so a 60fps game costs zero re-renders of
the SVG.

[gazijarin/Gazi-V2]: https://github.com/gazijarin/Gazi-V2

## Talking to the robot from elsewhere

Import from `bus.ts`, never from the brain:

```ts
import { botSay, botCommand, botSetQuiet } from '../components/robot/bus';

botSay('this one saved 94.4% water', 'happy');
botCommand('play');
botSetQuiet(true);
```

Text is capped at 160 characters at both ends of the bus — the raw
`CustomEvent` is a public extension point, and the bubble's layout depends on
that holding however the event was produced.
