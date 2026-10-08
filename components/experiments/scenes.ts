export interface SceneInput {
  t: number;
  cols: number;
  rows: number;
  // Pointer position normalised to 0..1 over the canvas, or -1 when outside.
  mx: number;
  my: number;
}

export type Scene = (input: SceneInput) => string | string[];

// JetBrains Mono advance width relative to a line-height of 1. Multiplying
// horizontal cell distances by this keeps circles round.
export const ASPECT = 0.6;

export class Grid {
  private cells: string[];

  constructor(readonly cols: number, readonly rows: number) {
    this.cells = new Array(cols * rows).fill(' ');
  }

  set(x: number, y: number, ch: string) {
    const cx = Math.round(x);
    const cy = Math.round(y);
    if (cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows) return;
    this.cells[cy * this.cols + cx] = ch;
  }

  get(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) return ' ';
    return this.cells[y * this.cols + x];
  }

  text(x: number, y: number, s: string) {
    Array.from(s).forEach((ch, i) => this.set(x + i, y, ch));
  }

  box(x0: number, y0: number, x1: number, y1: number, heavy = false) {
    const [h, v, tl, tr, bl, br] = heavy
      ? ['═', '║', '╔', '╗', '╚', '╝']
      : ['─', '│', '┌', '┐', '└', '┘'];
    for (let x = x0 + 1; x < x1; x++) {
      this.set(x, y0, h);
      this.set(x, y1, h);
    }
    for (let y = y0 + 1; y < y1; y++) {
      this.set(x0, y, v);
      this.set(x1, y, v);
    }
    this.set(x0, y0, tl);
    this.set(x1, y0, tr);
    this.set(x0, y1, bl);
    this.set(x1, y1, br);
  }

  toString() {
    const lines: string[] = [];
    for (let y = 0; y < this.rows; y++) {
      lines.push(this.cells.slice(y * this.cols, (y + 1) * this.cols).join(''));
    }
    return lines.join('\n');
  }
}

export function hash(x: number, y: number) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number) {
  return (noise(x, y) * 4 + noise(x * 2, y * 2) * 2 + noise(x * 4, y * 4)) / 7;
}

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.5);
const FIELD_RAMP = ' .:-=+*#%@';

// Domain-warped noise pushed through a 4x4 ordered dither — the ASCII take on
// Paper Shaders' Dithering + Warp. The pointer drops a ripple into the field.
export const field: Scene = ({ t, cols, rows, mx, my }) => {
  const g = new Grid(cols, rows);
  const px = mx * cols;
  const py = my * rows;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const u = x * ASPECT * 0.12;
      const v = y * 0.12;
      const q = fbm(u + t * 0.04, v - t * 0.02);
      let n = fbm(u + 1.8 * q + t * 0.07, v + 1.4 * q - t * 0.03);
      if (mx >= 0) {
        const d = Math.hypot((x - px) * ASPECT, y - py);
        n += 0.45 * Math.exp(-(d * d) / 18) * (0.6 + 0.4 * Math.sin(d * 1.3 - t * 5));
      }
      const val = (n - 0.28) * 2.1 + BAYER4[(y % 4) * 4 + (x % 4)] * 0.3;
      const idx = Math.max(0, Math.min(FIELD_RAMP.length - 1, Math.floor(val * FIELD_RAMP.length)));
      g.set(x, y, FIELD_RAMP[idx]);
    }
  }
  return g.toString();
};

// Heat leaving a sky-facing panel through the atmospheric window.
const cooling: Scene = ({ t, cols, rows }) => {
  const g = new Grid(cols, rows);
  const panelY = rows - 2;
  const x0 = Math.floor(cols * 0.12);
  const x1 = Math.ceil(cols * 0.88);

  for (let x = 0; x < cols; x++) {
    if (hash(x, 7) < 0.1) g.set(x, 0, Math.sin(t * 2 + x) > 0.7 ? '+' : '·');
  }
  g.text(cols - 8, 1, '8–13µm');

  for (let x = x0; x <= x1; x++) g.set(x, panelY, '▀');
  g.set(x0 + 2, rows - 1, '│');
  g.set(x1 - 2, rows - 1, '│');

  const life = panelY - 1;
  const count = Math.floor((x1 - x0) * 0.6);
  for (let i = 0; i < count; i++) {
    const speed = 1.5 + hash(i, 2) * 2;
    const p = (t * speed + hash(i, 3) * life) % life;
    const x = x0 + hash(i, 1) * (x1 - x0) + Math.sin(p * 0.9 + i) * 1.2;
    const ch = p < life * 0.3 ? '~' : p < life * 0.7 ? '^' : "'";
    g.set(x, panelY - 1 - p, ch);
  }
  return g.toString();
};

// Radar sweep with a red/blue event log beside it.
const SENTINEL_LOG = [
  'recon    ▸ scan :443',
  'exploit  ▸ sqli /login',
  'monitor  ◂ anomaly',
  'defend   ◂ block ip  ✓',
  'exploit  ▸ xss /search',
  'defend   ◂ patch     ✓',
  'forensic ◂ trace',
  'report   ▸ write-up',
];
const BLIPS = [
  [0.7, 0.5],
  [2.4, 0.8],
  [3.9, 0.35],
  [5.2, 0.65],
];

const sentinel: Scene = ({ t, cols, rows }) => {
  const g = new Grid(cols, rows);
  const radius = Math.min(rows / 2 - 0.5, (cols / 2) * ASPECT - 0.5);
  const cx = Math.ceil(radius / ASPECT) + 1;
  const cy = (rows - 1) / 2;
  const sweep = (t * 1.4) % (Math.PI * 2);
  const behind = (a: number) => (sweep - a + Math.PI * 4) % (Math.PI * 2);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cx * 2; x++) {
      const dx = (x - cx) * ASPECT;
      const dy = y - cy;
      const r = Math.hypot(dx, dy) / radius;
      if (r > 1.05) continue;
      const lag = behind(Math.atan2(dy, dx));
      if (lag < 0.25) g.set(x, y, '#');
      else if (lag < 0.6) g.set(x, y, '+');
      else if (lag < 1.0) g.set(x, y, ':');
      else if (Math.abs(r - 1) < 0.08 || Math.abs(r - 0.5) < 0.06) g.set(x, y, '·');
    }
  }
  g.set(cx, cy, '◆');

  BLIPS.forEach(([a, r]) => {
    const fresh = behind(a);
    if (fresh < 2.2) {
      g.set(cx + (Math.cos(a) * r * radius) / ASPECT, cy + Math.sin(a) * r * radius, fresh < 0.8 ? '×' : '·');
    }
  });

  const logX = cx * 2 + 2;
  const width = cols - logX;
  if (width > 8) {
    const head = Math.floor(t * 1.2);
    for (let i = 0; i < rows; i++) {
      const line = SENTINEL_LOG[(head + i) % SENTINEL_LOG.length];
      g.text(logX, i, line.slice(0, width));
    }
  }
  return g.toString();
};

// 5x5 phase-change actuator grid with air gaps; a warm touch point wanders.
const THERMO_RAMP = ['·', '-', '=', '▒', '▓', '█'];

const thermotouch: Scene = ({ t, cols, rows }) => {
  const g = new Grid(cols, rows);
  const cellW = 3;
  const gapX = 2;
  const n = 5;
  const gridW = n * cellW + (n - 1) * gapX;
  const gridH = n * 2 - 1;
  const ox = Math.max(0, Math.floor((cols - gridW) / 2) - 5);
  const oy = Math.max(0, Math.floor((rows - gridH) / 2));
  const tx = 2 + Math.sin(t * 0.7) * 1.8;
  const ty = 2 + Math.cos(t * 0.53) * 1.8;

  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const d = Math.hypot(i - tx, j - ty);
      const heat = Math.max(0, Math.min(0.999, 1 - d / 3.2 + Math.sin(t * 2 - d) * 0.08));
      const ch = THERMO_RAMP[Math.floor(heat * THERMO_RAMP.length)];
      for (let k = 0; k < cellW; k++) g.set(ox + i * (cellW + gapX) + k, oy + j * 2, ch);
    }
  }

  const lx = ox + gridW + 3;
  if (cols - lx >= 9) {
    g.text(lx, oy, 'pcm');
    g.text(lx, oy + 1, '32–34°C');
    g.text(lx, oy + 3, '5×5 mm');
    g.text(lx, oy + 5, 'air gap');
    g.text(lx, oy + 6, 'isolated');
  }
  return g.toString();
};

// Orcas v1.5: 10 builders × 30 days, one ship per cell.
const buildcored: Scene = ({ t, cols, rows }) => {
  const g = new Grid(cols, rows);
  const days = 30;
  const builders = Math.min(10, rows - 1);
  const ox = Math.max(0, Math.floor((cols - days) / 2));
  const day = Math.min(days, Math.floor(t * 4) % 40);

  g.text(ox, 0, `orcas v1.5  day ${String(day).padStart(2, '0')}/30`.slice(0, cols - ox));
  for (let b = 0; b < builders; b++) {
    for (let d = 0; d < days; d++) {
      let ch = '·';
      if (d < day) ch = hash(b, d) < 0.15 ? '▓' : '█';
      else if (d === day && Math.sin(t * 10 + b) > 0) ch = '▒';
      g.set(ox + d, b + 1, ch);
    }
  }
  return g.toString();
};

// Client work flowing through an automation pipeline with a review gate.
const FLOW_TICKER = ' pipedrive · google workspace · zapier · make · docusign · apps script ·';

const flowcored: Scene = ({ t, cols, rows }) => {
  const g = new Grid(cols, rows);
  let labels = ['intake', 'crm', 'draft', 'review', '✓'];
  const boxW = (ls: string[]) => ls.reduce((s, l) => s + Array.from(l).length + 2, 0);
  let gap = Math.floor((cols - boxW(labels)) / (labels.length - 1));
  if (gap < 3) {
    labels = ['in', 'crm', 'doc', 'rev', '✓'];
    gap = Math.max(2, Math.floor((cols - boxW(labels)) / (labels.length - 1)));
  }
  const cy = Math.floor(rows / 2);

  let x = 0;
  const segments: number[] = [];
  labels.forEach((label, i) => {
    const w = Array.from(label).length + 1;
    g.box(x, cy - 1, x + w, cy + 1, label === labels[3]);
    g.text(x + 1, cy, label);
    x += w + 1;
    if (i < labels.length - 1) {
      for (let k = 0; k < gap; k++) {
        segments.push(x + k);
        g.set(x + k, cy, k === gap - 1 ? '>' : '─');
      }
      x += gap;
    }
  });

  for (let i = 0; i < 4; i++) {
    const pos = Math.floor(t * 7 + i * (segments.length / 4)) % segments.length;
    g.set(segments[pos], cy, '•');
  }

  const reviewX = boxW(labels.slice(0, 3)) + gap * 3;
  if (cy - 3 >= 0) g.text(reviewX, cy - 3, 'human');
  if (cy - 2 >= 0) g.text(reviewX, cy - 2, 'gate ▾');

  const done = `${Math.floor((t * 7 * 4) / segments.length)} done`;
  g.text(cols - Array.from(done).length, cy + 3, done);

  const tickerY = rows - 1;
  const offset = Math.floor(t * 4);
  const ticker = Array.from(FLOW_TICKER);
  for (let i = 0; i < cols; i++) g.set(i, tickerY, ticker[(i + offset) % ticker.length]);
  return g.toString();
};

// Hyprland-style tiling layouts cycling, with focus moving between windows.
const LAYOUTS = [
  [[0, 0, 1, 1]],
  [[0, 0, 0.5, 1], [0.5, 0, 0.5, 1]],
  [[0, 0, 0.55, 1], [0.55, 0, 0.45, 0.5], [0.55, 0.5, 0.45, 0.5]],
  [[0, 0, 0.55, 1], [0.55, 0, 0.45, 0.34], [0.55, 0.34, 0.45, 0.33], [0.55, 0.67, 0.45, 0.33]],
];
const LAYOUT_SEQUENCE = [0, 1, 2, 3, 2, 1];
const WINDOWS = ['term', 'nvim', 'claude', 'notes'];
const PROMPTS = ['$ claude', ':w', '> ship it', '# today'];

const agenticOs: Scene = ({ t, cols, rows }) => {
  const g = new Grid(cols, rows);
  const period = 2.6;
  const step = Math.floor(t / period);
  const progress = (t % period) / period;
  const layout = LAYOUTS[LAYOUT_SEQUENCE[step % LAYOUT_SEQUENCE.length]];
  const active = step % layout.length;

  const rects = layout.map(([rx, ry, rw, rh]) => [
    Math.round(rx * (cols - 1)),
    Math.round(ry * (rows - 1)),
    Math.round((rx + rw) * (cols - 1)),
    Math.round((ry + rh) * (rows - 1)),
  ]);
  rects.forEach(([x0, y0, x1, y1], i) => {
    if (i === active) return;
    g.box(x0, y0, x1, y1);
    g.text(x0 + 2, y0, ` ${WINDOWS[i]} `);
  });

  const [x0, y0, x1, y1] = rects[active];
  g.box(x0, y0, x1, y1, true);
  g.text(x0 + 2, y0, ` ${WINDOWS[active]} `);
  const prompt = PROMPTS[active];
  const typed = prompt.slice(0, Math.ceil(Math.min(1, progress * 1.6) * prompt.length));
  g.text(x0 + 2, y0 + 1, typed);
  if (Math.floor(t * 3) % 2 === 0) g.set(x0 + 2 + typed.length, y0 + 1, '▌');
  return g.toString();
};

// The Aral Sea receding from 1972, the eastern basin vanishing first.
const ARAL_LOBES: [number, number, number, number][] = [
  // cx, cy, radius, how much it shrinks by 2026
  [-0.15, -0.55, 0.32, 0.3],
  [-0.3, 0.2, 0.42, 0.55],
  [0.3, 0.2, 0.5, 1.0],
];

const aral: Scene = ({ t, cols, rows }) => {
  const g = new Grid(cols, rows);
  const year = Math.round(1972 + Math.min(54, (t * 5) % 64));
  const k = (year - 1972) / 54;
  const halfW = (cols * ASPECT) / 2;
  const halfH = rows / 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const nx = ((x - cols / 2) * ASPECT) / halfW;
      const ny = (y - halfH + 0.5) / halfH;
      const wobble = (fbm(nx * 3 + 10, ny * 3) - 0.5) * 0.5;
      const inLobe = (shrink: number) =>
        ARAL_LOBES.some(([cx, cy, r, s]) => {
          const rr = r * Math.max(0, 1 - s * shrink);
          return rr > 0 && ((nx - cx) / rr) ** 2 + ((ny - cy) / (rr * 1.3)) ** 2 + wobble < 1;
        });
      if (inLobe(k)) {
        g.set(x, y, (x + y + Math.floor(t * 3)) % 5 === 0 ? '≈' : '~');
      } else if (inLobe(0)) {
        g.set(x, y, hash(x, y) < 0.35 ? ':' : '.');
      }
    }
  }
  g.text(1, 0, String(year));
  return g.toString();
};

// Shelves of spines; one book on each shelf being lent out and returned.
const agora: Scene = ({ t, cols, rows }) => {
  const g = new Grid(cols, rows);
  const shelves = [Math.floor(rows / 2) - 1, rows - 1];
  const spines = ['│', '║', '▌', '█', '▐'];

  shelves.forEach((sy, si) => {
    for (let x = 0; x < cols; x++) g.set(x, sy, '▔');
    const moving = Math.floor(hash(si, 99) * (cols - 4)) + 2;
    for (let x = 1; x < cols - 1; x++) {
      if (hash(x, si + 20) < 0.12) continue;
      const height = 2 + Math.floor(hash(x, si + 40) * 2);
      const lift = x === moving ? Math.round((Math.sin(t * 1.5 + si * 2) + 1) * 1.5) : 0;
      const ch = spines[Math.floor(hash(x, si + 60) * spines.length)];
      for (let h = 1; h <= height; h++) g.set(x, sy - h - lift, ch);
    }
  });
  return g.toString();
};

// A browser window drawing this site.
const website: Scene = ({ t, cols, rows }) => {
  const g = new Grid(cols, rows);
  const period = 5;
  const p = (t % period) / period;
  g.box(0, 0, cols - 1, rows - 1);
  g.text(2, 1, '● ● ●');
  const url = 'imamatdin.com';
  g.text(9, 1, url.slice(0, Math.ceil(Math.min(1, p * 3) * url.length)));
  for (let x = 1; x < cols - 1; x++) g.set(x, 2, '─');

  const lines = [0.5, 0.9, 0.7, 0.85, 0.4, 0.75];
  const shown = Math.floor(Math.max(0, p * 3 - 1) * lines.length);
  lines.slice(0, Math.min(shown, rows - 4)).forEach((w, i) => {
    const len = Math.floor((cols - 6) * w);
    for (let x = 0; x < len; x++) g.set(3 + x, 3 + i, i === 0 ? '█' : '░');
  });
  return g.toString();
};

// Paper Shaders' Dot Grid + Waves as a fallback.
const dotWaves: Scene = ({ t, cols, rows }) => {
  const g = new Grid(cols, rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x += 2) {
      const d = Math.hypot((x - cols / 2) * ASPECT, y - rows / 2);
      const s = Math.sin(d * 0.9 - t * 2.5);
      g.set(x, y, s > 0.6 ? '●' : s > 0 ? '•' : '·');
    }
  }
  return g.toString();
};

const SCENES: Record<string, Scene> = {
  'radiative-cooling-control': cooling,
  sentinel,
  thermotouch,
  buildcored,
  flowcored,
  'agentic-os': agenticOs,
  'aral-basin-platform': aral,
  'agora-library-bot': agora,
  'imamatdin-com': website,
};

export const sceneFor = (slug: string): Scene => SCENES[slug] ?? dotWaves;
