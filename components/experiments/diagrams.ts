import { Grid, hash, Scene } from './scenes';

/**
 * Architecture diagrams drawn in characters. Three layers, painted by the
 * canvas in increasing emphasis:
 *   0  the whole system, dim
 *   1  what is live this step: the active components and the trail behind
 *      the signal
 *   2  the signal itself
 * Writing to a layer clears that cell in the others, so glyphs never stack.
 */
class Layers {
  readonly grids: Grid[];

  constructor(readonly cols: number, readonly rows: number, count = 3) {
    this.grids = Array.from({ length: count }, () => new Grid(cols, rows));
  }

  set(layer: number, x: number, y: number, ch: string) {
    this.grids.forEach((g, i) => g.set(x, y, i === layer ? ch : ' '));
  }

  text(layer: number, x: number, y: number, s: string) {
    Array.from(s).forEach((ch, i) => this.set(layer, x + i, y, ch));
  }

  /** Draw a line glyph, joining it with any line already there into a tee. */
  line(layer: number, x: number, y: number, ch: string) {
    const prev = LINKS[this.grids[layer].get(x, y)];
    const next = LINKS[ch];
    if (prev && next) {
      const merged = GLYPH[[...new Set((prev + next).split(''))].sort().join('')];
      if (merged) ch = merged;
    }
    this.set(layer, x, y, ch);
  }

  toStrings() {
    return this.grids.map((g) => g.toString());
  }
}

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  /** A titled list box instead of a label box; one item lights at a time. */
  items?: string[];
  x: number;
  y: number;
}

export interface DiagramSpec {
  cols: number;
  rows: number;
  nodes: DiagramNode[];
  edges: [string, string][];
  /** Node ids lit together; the signal runs every edge from one step to the next. */
  steps: string[][];
  /** Seconds to dwell on a step, per node id (e.g. a human review gate). */
  holds?: Record<string, number>;
  notes?: { x: number; y: number; text: string }[];
}

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const len = (s: string) => Array.from(s).length;

function measure(n: DiagramNode): Box {
  if (n.items) {
    const w = Math.max(len(n.label) + 6, ...n.items.map((i) => len(i) + 6));
    return { x0: n.x, y0: n.y, x1: n.x + w - 1, y1: n.y + n.items.length + 1 };
  }
  const w = Math.max(len(n.label), len(n.sub ?? '')) + 4;
  return { x0: n.x, y0: n.y, x1: n.x + w - 1, y1: n.y + (n.sub ? 3 : 2) };
}

function drawBox(L: Layers, layer: number, b: Box, n: DiagramNode, heavy: boolean, t: number) {
  const [h, v, tl, tr, bl, br] = heavy ? ['━', '┃', '┏', '┓', '┗', '┛'] : ['─', '│', '┌', '┐', '└', '┘'];
  for (let x = b.x0 + 1; x < b.x1; x++) {
    L.set(layer, x, b.y0, h);
    L.set(layer, x, b.y1, h);
  }
  for (let y = b.y0 + 1; y < b.y1; y++) {
    L.set(layer, b.x0, y, v);
    L.set(layer, b.x1, y, v);
  }
  L.set(layer, b.x0, b.y0, tl);
  L.set(layer, b.x1, b.y0, tr);
  L.set(layer, b.x0, b.y1, bl);
  L.set(layer, b.x1, b.y1, br);

  if (n.items) {
    L.text(layer, b.x0 + 2, b.y0, ` ${n.label} `);
    const lit = heavy ? Math.floor(t * 1.6) % n.items.length : -1;
    n.items.forEach((item, i) => {
      L.text(i === lit ? 2 : layer, b.x0 + 2, b.y0 + 1 + i, (i === lit ? '▸ ' : '  ') + item);
    });
    return;
  }
  L.text(layer, b.x0 + 2, b.y0 + 1, n.label);
  if (n.sub) L.text(0, b.x0 + 2, b.y0 + 2, n.sub);
}

type Pt = [number, number];

// Which sides each line glyph connects to, and back again.
const LINKS: Record<string, string> = {
  '─': 'LR', '│': 'DU', '┌': 'DR', '┐': 'DL', '└': 'RU', '┘': 'LU',
  '├': 'DRU', '┤': 'DLU', '┬': 'DLR', '┴': 'LRU', '┼': 'DLRU',
};
const GLYPH: Record<string, string> = Object.fromEntries(
  Object.entries(LINKS).map(([g, d]) => [d.split('').sort().join(''), g])
);

const inside = ([x, y]: Pt, b: Box) => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1;

/**
 * Orthogonal route between two boxes. The elbow slides along the gap until
 * the path clears every other box; the midpoint wins when nothing is in the way.
 */
function route(a: Box, b: Box, others: Box[]): Pt[] {
  const horizontal = b.x0 > a.x1 + 1 || b.x1 < a.x0 - 1;
  const [lo, hi] = horizontal
    ? [Math.min(a.x1, b.x1) + 1, Math.max(a.x0, b.x0) - 1]
    : [Math.min(a.y1, b.y1) + 1, Math.max(a.y0, b.y0) - 1];
  const mid = (lo + hi) >> 1;
  const candidates = Array.from({ length: Math.max(1, hi - lo + 1) }, (_, i) => lo + i).sort(
    (p, q) => Math.abs(p - mid) - Math.abs(q - mid)
  );
  let best: Pt[] = [];
  for (const elbow of candidates) {
    const pts = routeVia(a, b, horizontal, elbow);
    if (!best.length) best = pts;
    if (!pts.some((pt) => others.some((o) => inside(pt, o)))) return pts;
  }
  return best;
}

function routeVia(a: Box, b: Box, horizontal: boolean, elbow: number): Pt[] {
  const pts: Pt[] = [];
  const push = (x: number, y: number) => {
    const last = pts[pts.length - 1];
    if (!last || last[0] !== x || last[1] !== y) pts.push([x, y]);
  };
  const line = (x0: number, y0: number, x1: number, y1: number) => {
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    let x = x0;
    let y = y0;
    push(x, y);
    while (x !== x1 || y !== y1) {
      if (x !== x1) x += dx;
      else y += dy;
      push(x, y);
    }
  };
  const amid = [(a.x0 + a.x1) >> 1, (a.y0 + a.y1) >> 1];
  const bmid = [(b.x0 + b.x1) >> 1, (b.y0 + b.y1) >> 1];

  if (horizontal) {
    const right = b.x0 > a.x1;
    const sx = right ? a.x1 + 1 : a.x0 - 1;
    const ex = right ? b.x0 - 1 : b.x1 + 1;
    const mx = elbow;
    line(sx, amid[1], mx, amid[1]);
    line(mx, amid[1], mx, bmid[1]);
    line(mx, bmid[1], ex, bmid[1]);
  } else {
    const down = b.y0 > a.y1;
    const sy = down ? a.y1 + 1 : a.y0 - 1;
    const ey = down ? b.y0 - 1 : b.y1 + 1;
    const x = Math.max(Math.max(a.x0, b.x0) + 1, Math.min(amid[0], Math.min(a.x1, b.x1) - 1));
    line(x, sy, x, elbow);
    line(x, elbow, x, ey);
  }
  return pts;
}

const ARROW: Record<string, string> = { '1,0': '▸', '-1,0': '◂', '0,1': '▾', '0,-1': '^' };
const CORNER: Record<string, string> = {
  'L,D': '┐', 'D,L': '┐', 'L,U': '┘', 'U,L': '┘',
  'R,D': '┌', 'D,R': '┌', 'R,U': '└', 'U,R': '└',
};

function dirName(dx: number, dy: number) {
  return dx > 0 ? 'R' : dx < 0 ? 'L' : dy > 0 ? 'D' : 'U';
}

function pathGlyph(pts: Pt[], i: number) {
  const [x, y] = pts[i];
  if (i === pts.length - 1) {
    const [px, py] = pts[i - 1] ?? [x - 1, y];
    return ARROW[`${Math.sign(x - px)},${Math.sign(y - py)}`] ?? '▸';
  }
  const [nx, ny] = pts[i + 1];
  if (i === 0) return ny === y ? '─' : '│';
  const [px, py] = pts[i - 1];
  if (px === nx) return '│';
  if (py === ny) return '─';
  return CORNER[`${dirName(px - x, py - y)},${dirName(nx - x, ny - y)}`] ?? '┼';
}

export function diagram(spec: DiagramSpec, stepSeconds = 1.1): Scene {
  const boxes = new Map(spec.nodes.map((n) => [n.id, measure(n)]));
  const paths = new Map(
    spec.edges.map(([from, to]) => [
      `${from}>${to}`,
      route(
        boxes.get(from)!,
        boxes.get(to)!,
        spec.nodes.filter((n) => n.id !== from && n.id !== to).map((n) => boxes.get(n.id)!)
      ),
    ])
  );
  const durations = spec.steps.map((ids) =>
    Math.max(stepSeconds, ...ids.map((id) => spec.holds?.[id] ?? 0))
  );
  const cycle = durations.reduce((a, b) => a + b, 0);

  return ({ t }) => {
    const L = new Layers(spec.cols, spec.rows);
    let local = t % cycle;
    let step = 0;
    while (local > durations[step]) {
      local -= durations[step];
      step = (step + 1) % durations.length;
    }
    const p = local / durations[step];
    const lit = new Set(spec.steps[step]);
    const next = spec.steps[(step + 1) % spec.steps.length];

    paths.forEach((pts) => pts.forEach(([x, y], i) => L.line(0, x, y, pathGlyph(pts, i))));
    spec.notes?.forEach((n) => L.text(0, n.x, n.y, n.text));
    spec.nodes.forEach((n) => drawBox(L, lit.has(n.id) ? 1 : 0, boxes.get(n.id)!, n, lit.has(n.id), t));

    // The signal leaves once the step has had a beat to register.
    const travel = Math.max(0, (p - 0.35) / 0.65);
    if (travel > 0) {
      spec.steps[step].forEach((from) =>
        next.forEach((to) => {
          const pts = paths.get(`${from}>${to}`);
          if (!pts) return;
          const head = Math.min(pts.length - 1, Math.floor(travel * pts.length));
          for (let i = 0; i < head; i++) L.line(1, pts[i][0], pts[i][1], pathGlyph(pts, i));
          L.set(2, pts[head][0], pts[head][1], '●');
        })
      );
    }
    return L.toStrings();
  };
}

// ---------------------------------------------------------------------------
// Readouts: the measured results, drawn as instruments rather than prose.
// ---------------------------------------------------------------------------

const bar = (frac: number, width: number) => {
  const cells = Math.max(0, frac) * width;
  const full = Math.floor(cells);
  const part = ' ▏▎▍▌▋▊▉'[Math.floor((cells - full) * 8)];
  return '█'.repeat(full) + (full < width ? part : '');
};

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

// Results from the paper: best water savings per zone, and what forecasts add.
export const coolingReadout: Scene = ({ t, cols }) => {
  const L = new Layers(cols, 11);
  const grow = ease(t / 2.2);
  const W = 34;
  L.text(0, 0, 0, 'water saved vs evaporative baseline');
  const rows: [string, number, string][] = [
    ['seattle  SAC ', 94.4, '94.4 ±0.5%'],
    ['houston  TD3 ', 70.8, '70.8 ±4.3%'],
  ];
  rows.forEach(([name, v, label], i) => {
    L.text(0, 0, 2 + i, name);
    L.text(2, 13, 2 + i, bar((v / 100) * grow, W));
    L.text(1, 14 + W, 2 + i, label);
  });
  L.text(0, 0, 5, 'electricity, houston  DDPG');
  L.text(2, 27, 5, bar(0.108 * grow * 2, 10));
  L.text(1, 38, 5, '10.8%');

  L.text(0, 0, 7, 'forecast ablation (pp)      −        0        +');
  const zones: [string, number][] = [['seattle', 10.2], ['phoenix', 2.7], ['houston', -1.1]];
  zones.forEach(([name, v], i) => {
    const y = 8 + i;
    const axis = 37;
    L.text(0, 0, y, name);
    L.set(0, axis, y, '│');
    const n = Math.round(Math.abs(v) * 0.9 * grow);
    for (let k = 1; k <= n; k++) L.set(2, axis + (v > 0 ? k : -k), y, v > 0 ? '▶' : '◀');
    L.text(1, v > 0 ? axis + n + 2 : axis + 2, y, `${v > 0 ? '+' : '−'}${Math.abs(v)}`);
  });
  return L.toStrings();
};

// Attacks arrive in two lanes; the fast-inference blue team catches most of
// them. Block odds come from the demo's measured ranges (70–80%, 10–20%).
export const sentinelReadout: Scene = ({ t, cols }) => {
  const L = new Layers(cols, 12);
  const wall = cols - 13;
  const speed = 16;
  const lanes = [
    { y: 0, name: 'cerebras  1000–1700 tok/s', odds: 0.75 },
    { y: 6, name: 'slow      3–5 s inference', odds: 0.15 },
  ];
  lanes.forEach(({ y, name, odds }, li) => {
    const row = y + 2;
    L.text(0, 0, y, name);
    for (let x = 0; x < wall; x++) L.set(0, x, row, '·');
    for (let k = -1; k <= 1; k++) L.set(0, wall, row + k, '┃');
    L.text(0, wall + 3, row - 1, 'target');

    let total = 0;
    let blocked = 0;
    const launched = Math.floor(t / 0.5);
    for (let i = 0; i <= launched; i++) {
      // Jittered launches so the lane reads as traffic, not a metronome.
      const age = t - (i * 0.5 + hash(i, li + 50) * 0.45);
      if (age < 0) continue;
      const x = Math.floor(age * speed);
      const stopped = hash(i, li * 31 + 7) < odds;
      // A blocked attack dies short of the wall: the defence lands first.
      const stopAt = wall - 2 - Math.floor(hash(i, li + 90) * 10);
      const end = stopped ? stopAt : wall + 10;
      if (x >= end) {
        total++;
        if (stopped) blocked++;
        if (stopped && x < stopAt + 5) L.set(2, stopAt, row, '×');
        continue;
      }
      L.set(stopped || x < wall ? 1 : 2, x === wall ? wall + 1 : x, row, '▸');
    }
    const pct = total ? Math.round((blocked / total) * 100) : 0;
    L.text(0, 0, row + 2, 'blocked');
    L.text(1, 8, row + 2, `${String(blocked).padStart(3)} / ${String(total).padStart(3)}`);
    L.text(2, 19, row + 2, `${pct}%`);
  });
  return L.toStrings();
};

// Cooling step response: PCM hits 95% in ~7.5 ms, Peltier in ~70 ms.
export const thermoReadout: Scene = ({ t, cols }) => {
  const L = new Layers(cols, 18);
  const plotW = Math.min(52, cols - 10);
  const plotH = 8;
  const ox = 6;
  const span = 100;
  const sweep = Math.min(1, (t % 6) / 4);

  L.text(0, 0, 0, 'cooling step response');
  for (let y = 0; y < plotH; y++) L.set(0, ox - 1, 1 + y, '│');
  for (let x = 0; x < plotW; x++) L.set(0, ox + x, plotH + 1, '─');
  L.set(0, ox - 1, plotH + 1, '└');
  L.text(0, ox, plotH + 2, '0');
  L.text(0, ox + Math.round(plotW * 0.7) - 2, plotH + 2, '70ms');
  L.text(0, ox + plotW - 5, plotH + 2, '100ms');
  L.text(0, 0, 1, '100%');
  L.text(0, 2, plotH, '0');

  const curves = [
    { tau: 2.5, layer: 2, ch: '█', name: 'pcm      5–10 ms' },
    { tau: 23.3, layer: 1, ch: '▪', name: 'peltier  70 ms' },
  ];
  curves.forEach(({ tau, layer, ch }) => {
    for (let x = 0; x <= Math.floor(plotW * sweep); x++) {
      const ms = (x / plotW) * span;
      const v = 1 - Math.exp(-ms / tau);
      L.set(layer, ox + x, 1 + Math.round((1 - v) * (plotH - 1)), ch);
    }
  });
  L.text(2, ox + plotW - 18, 0, '█ pcm');
  L.text(1, ox + plotW - 10, 0, '▪ peltier');

  const table: [string, string, string][] = [
    ['', 'pcm', 'peltier'],
    ['weight', '<5 g', '50 g'],
    ['power', '2 W', '125 W'],
    ['battery', '7.5 h', '18 min'],
  ];
  table.forEach(([a, b, c], i) => {
    const y = plotH + 4 + i;
    L.text(0, 0, y, a);
    L.text(i === 0 ? 0 : 2, 10, y, b);
    L.text(i === 0 ? 0 : 1, 20, y, c);
  });
  L.text(0, 0, plotH + 9 > 17 ? 17 : plotH + 9, 'same 15 Wh pack · 10-module glove');
  return L.toStrings();
};

const RULES = ['build every day', 'start with what you own', 'if it runs it counts', "read other people's code"];

export const buildcoredReadout: Scene = ({ t, cols }) => {
  const L = new Layers(cols, 16);
  L.text(0, 0, 0, 'four rules');
  const typed = t * 14;
  let used = 0;
  RULES.forEach((rule, i) => {
    const shown = Math.max(0, Math.min(rule.length, Math.floor(typed - used)));
    used += rule.length + 6;
    L.text(0, 0, 2 + i, String(i + 1).padStart(2, '0'));
    L.text(shown === rule.length ? 1 : 2, 4, 2 + i, rule.slice(0, shown));
    if (shown > 0 && shown < rule.length && Math.floor(t * 3) % 2 === 0) L.set(2, 4 + shown, 2 + i, '▌');
  });

  const stats: [string, string][] = [
    ['members', '1,500+'],
    ['license', 'MIT, free'],
    ['orcas v1.5', '10 builders × 30 days'],
    ['orcas v2.0', 'hardware · Tashkent'],
    ['', '15–24 Aug 2026'],
  ];
  stats.forEach(([k, v], i) => {
    L.text(0, 0, 8 + i, k);
    L.text(1, 13, 8 + i, v);
  });
  return L.toStrings();
};

// One budget for both parts: A + B must finish within 3x the video's length on
// a T4. The CPU runs are the measured history; the T4 run is still owed.
export const zerothReadout: Scene = ({ t, cols }) => {
  const L = new Layers(cols, 13);
  const grow = ease(t / 2.4);
  const scale = 4.2; // cells per 1x
  const axis = 18;
  L.text(0, 0, 0, 'budget per video: A + B ≤ 3× duration, one T4');
  const parts: [string, number, number][] = [['A', 1.25, 1], ['B', 1.55, 2], ['margin', 0.2, 0]];
  let x = axis;
  parts.forEach(([name, v, layer]) => {
    const n = Math.round(v * scale * grow);
    for (let k = 0; k < n; k++) L.set(layer, x + k, 2, ['░', '█', '▓'][layer]);
    L.text(0, x, 3, name);
    x += Math.round(v * scale);
  });
  L.text(0, 0, 2, 'allocation');
  const limit = axis + Math.round(3 * scale);
  for (let y = 1; y <= 10; y++) if (y !== 3) L.set(0, limit, y, '┊');
  L.text(1, limit + 2, 1, '3×');

  L.text(0, 0, 5, 'measured, CPU laptop (historical)');
  const runs: [string, number][] = [['127.6 s clip', 6.02], ['127.6 s clip', 6.48], ['20.05 s clip', 9.33]];
  runs.forEach(([name, v], i) => {
    const y = 6 + i;
    L.text(0, 0, y, name);
    const n = Math.round(Math.min(v * scale * grow, cols - axis - 7));
    for (let k = 0; k < n; k++) L.set(k + axis < limit ? 1 : 2, axis + k, y, '█');
    L.text(1, axis + n + 1, y, `${v.toFixed(2)}×`);
  });
  L.text(0, 0, 10, 'T4, full pipeline');
  L.text(2, axis, 10, 'unmeasured');
  L.text(0, 0, 12, '14 event classes · engines off until validated');
  return L.toStrings();
};

// ---------------------------------------------------------------------------
// Diagrams, from each project's write-up.
// ---------------------------------------------------------------------------

export const DIAGRAMS: Record<string, DiagramSpec> = {
  'zeroth-law-traffic': {
    cols: 64,
    rows: 17,
    nodes: [
      { id: 'video', label: 'video .mp4', sub: 'every 3rd frame', x: 0, y: 0 },
      { id: 'yolo', label: 'YOLO11m', sub: 'COCO · 6 classes', x: 0, y: 6 },
      { id: 'track', label: 'ByteTrack', sub: 'Kalman · riders', x: 0, y: 12 },
      { id: 'world', label: 'world model', sub: 'geometry·atlas', x: 23, y: 6 },
      {
        id: 'engines',
        label: '14 engines',
        items: ['accident', 'near_miss', 'red_light', 'wrong_way', 'jaywalking', '+9 more'],
        x: 46,
        y: 0,
      },
      { id: 'segments', label: 'segments', sub: 'start·end·label', x: 45, y: 11 },
      { id: 'risk', label: 'risk(t)', sub: 'B · past only', x: 23, y: 12 },
    ],
    edges: [
      ['video', 'yolo'],
      ['yolo', 'track'],
      ['track', 'world'],
      ['world', 'engines'],
      ['world', 'risk'],
      ['engines', 'segments'],
    ],
    steps: [['video'], ['yolo'], ['track'], ['world'], ['engines', 'risk'], ['segments']],
    holds: { engines: 2.8 },
  },

  'radiative-cooling-control': {
    cols: 64,
    rows: 17,
    nodes: [
      { id: 'weather', label: 'TMY3 weather', sub: 'PHX HOU SEA', x: 0, y: 0 },
      { id: 'forecast', label: 'forecast', sub: 'perfect info', x: 0, y: 8 },
      { id: 'agent', label: 'SAC·TD3·DDPG', sub: 'SB3 · 3 seeds', x: 22, y: 4 },
      { id: 'radiative', label: 'radiative', sub: 'sky panels', x: 48, y: 0 },
      { id: 'evap', label: 'evaporative', sub: 'tower', x: 48, y: 5 },
      { id: 'storage', label: 'storage', sub: 'dispatch', x: 48, y: 10 },
      { id: 'hall', label: '1 MW hall', sub: 'Sinergym', x: 22, y: 13 },
    ],
    edges: [
      ['weather', 'agent'],
      ['forecast', 'agent'],
      ['agent', 'radiative'],
      ['agent', 'evap'],
      ['agent', 'storage'],
      ['storage', 'hall'],
      ['hall', 'agent'],
    ],
    steps: [['weather', 'forecast'], ['agent'], ['radiative', 'evap', 'storage'], ['hall'], ['agent']],
    notes: [{ x: 38, y: 16, text: 'reward: water + kWh' }],
  },

  sentinel: {
    cols: 64,
    rows: 16,
    nodes: [
      { id: 'recon', label: 'ReconAgent', x: 0, y: 0 },
      { id: 'exploit', label: 'ExploitAgent', x: 0, y: 6 },
      { id: 'report', label: 'ReportAgent', x: 0, y: 12 },
      { id: 'bus', label: 'event bus', sub: 'FastAPI · WS', x: 23, y: 0 },
      { id: 'target', label: 'Juice Shop', sub: '100+ vulns', x: 23, y: 6 },
      { id: 'genome', label: 'Security', sub: 'Genome', x: 23, y: 12 },
      { id: 'monitor', label: 'MonitorAgent', x: 46, y: 0 },
      { id: 'defender', label: 'DefenderAgent', x: 46, y: 6 },
      { id: 'forensics', label: 'ForensicsAgent', x: 46, y: 12 },
    ],
    edges: [
      ['recon', 'target'],
      ['exploit', 'target'],
      ['target', 'bus'],
      ['bus', 'monitor'],
      ['monitor', 'defender'],
      ['defender', 'target'],
      ['defender', 'forensics'],
      ['forensics', 'genome'],
      ['genome', 'report'],
    ],
    steps: [['recon', 'exploit'], ['target'], ['bus'], ['monitor'], ['defender'], ['target'], ['forensics'], ['genome'], ['report']],
    holds: { defender: 1.4 },
  },

  'aral-basin-platform': {
    cols: 64,
    rows: 16,
    nodes: [
      {
        id: 'sources',
        label: '50 yr stack',
        items: ['Landsat 1972–', 'Sentinel-1/2', 'MODIS · VIIRS', 'GRACE-FO', 'ERA5 · MERRA-2', 'Uzhydromet ×87'],
        x: 0,
        y: 0,
      },
      { id: 'prithvi', label: 'Prithvi-EO-2.0', sub: '600M · fine-tune', x: 22, y: 1 },
      { id: 'chronos', label: 'Chronos-2', sub: 'time series', x: 22, y: 9 },
      {
        id: 'modules',
        label: 'modules',
        items: ['dust warning', 'irrigation RL', 'water alloc', 'crop yield', 'salinity risk', 'crop disease'],
        x: 45,
        y: 0,
      },
    ],
    edges: [
      ['sources', 'prithvi'],
      ['sources', 'chronos'],
      ['prithvi', 'modules'],
      ['chronos', 'modules'],
    ],
    steps: [['sources'], ['prithvi', 'chronos'], ['modules']],
    holds: { modules: 3.8, sources: 3.8 },
    notes: [{ x: 0, y: 11, text: 'GEE · AquaCrop · SAC' }, { x: 0, y: 13, text: 'pilots: Karakalpakstan' }],
  },

  flowcored: {
    cols: 80,
    rows: 12,
    nodes: [
      { id: 'intake', label: 'intake form', sub: 'client', x: 0, y: 0 },
      { id: 'crm', label: 'Pipedrive', sub: 'stage', x: 21, y: 0 },
      { id: 'script', label: 'Apps Script', sub: 'Zapier/Make', x: 40, y: 0 },
      { id: 'draft', label: 'AI draft', sub: 'Workspace', x: 62, y: 0 },
      { id: 'review', label: 'human review', sub: 'gate', x: 62, y: 8 },
      { id: 'sign', label: 'DocuSign', sub: 'API', x: 40, y: 8 },
      { id: 'remind', label: 'reminders', sub: 'deadlines', x: 21, y: 8 },
      { id: 'done', label: 'tasks', sub: 'tracked', x: 0, y: 8 },
    ],
    edges: [
      ['intake', 'crm'],
      ['crm', 'script'],
      ['script', 'draft'],
      ['draft', 'review'],
      ['review', 'sign'],
      ['sign', 'remind'],
      ['remind', 'done'],
    ],
    steps: [['intake'], ['crm'], ['script'], ['draft'], ['review'], ['sign'], ['remind'], ['done']],
    holds: { review: 2.6 },
  },

  'agentic-os': {
    cols: 80,
    rows: 17,
    nodes: [
      {
        id: 'inputs',
        label: 'inputs',
        items: ['Silero VAD', 'Faster-Whisper', 'LiveKit meetings', 'Telegram·WhatsApp', 'Discord·email'],
        x: 0,
        y: 0,
      },
      { id: 'docs', label: 'NuMarkdown-8B', sub: 'doc OCR', x: 0, y: 9 },
      { id: 'core', label: 'LangGraph', sub: 'vLLM · Claude Code', x: 29, y: 1 },
      { id: 'memory', label: 'Qdrant+Graphiti', sub: 'facts expire', x: 29, y: 9 },
      {
        id: 'outputs',
        label: 'outputs',
        items: ['Kokoro TTS', 'microsandbox', 'Windmill flows', 'action items'],
        x: 58,
        y: 0,
      },
    ],
    edges: [
      ['inputs', 'core'],
      ['docs', 'core'],
      ['core', 'memory'],
      ['memory', 'outputs'],
    ],
    steps: [['inputs', 'docs'], ['core'], ['memory'], ['outputs']],
    holds: { inputs: 3.2, outputs: 2.6 },
    notes: [{ x: 0, y: 15, text: 'Arch · Hyprland · Cursor · Obsidian — ambient, not app-switched' }],
  },
};
