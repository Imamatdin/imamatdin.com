import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HallProps {
  /** 0 at the entrance, 1 at the far end; written by the page on scroll. */
  progress: React.MutableRefObject<number>;
  bays: number;
}

type Mode = 'noon' | 'candle' | 'night';

const FONT_PX = 11;
const CELL_W = 7;
const CELL_H = 13;
// Fill ramp, sparse to dense, then the four edge strokes.
const GLYPHS = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@', '-', '/', '|', '\\'];

const NAVE_W = 12;
const BAY_LEN = 9;

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** CSS colour to raw sRGB floats: the shader writes them straight out. */
function srgb(value: string): [number, number, number] {
  const hex = value.replace('#', '');
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
  }
  const m = value.match(/[\d.]+/g);
  return m ? [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255] : [0.5, 0.5, 0.5];
}

const currentMode = (): Mode => {
  const root = document.documentElement;
  const m = root.getAttribute('data-mode');
  if (m === 'candle' || m === 'night') return m;
  return root.getAttribute('data-theme') === 'dark' ? 'night' : 'noon';
};

const darkGround = () => currentMode() === 'night' || document.documentElement.classList.contains('konami-mode');

function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function canvasTexture(size: number, paint: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  paint(canvas.getContext('2d')!, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** The hall, built in code: Admont's nave, two tiers of books, a gilt vault. */
function buildHall(bays: number) {
  const scene = new THREE.Scene();
  const length = (bays + 1) * BAY_LEN;
  const half = NAVE_W / 2;

  const white = new THREE.MeshStandardMaterial({ color: 0xf0eee8, roughness: 0.85 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x8a8378, roughness: 0.9 });
  const gilt = new THREE.MeshStandardMaterial({ color: 0xd9a21a, roughness: 0.4, metalness: 0.3 });

  // Admont's floor is rhombus marble; a diamond texture gives the cells rhythm.
  const floorTex = canvasTexture(128, (ctx, s) => {
    ctx.fillStyle = '#d8d6cf';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#8f8c84';
    ctx.beginPath();
    ctx.moveTo(s / 2, 0);
    ctx.lineTo(s, s / 2);
    ctx.lineTo(s / 2, s);
    ctx.lineTo(0, s / 2);
    ctx.closePath();
    ctx.fill();
  });
  floorTex.repeat.set(NAVE_W / 2, length / 2);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(NAVE_W, length), new THREE.MeshStandardMaterial({ map: floorTex }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -length / 2 + BAY_LEN / 2;
  scene.add(floor);

  // Books: one instanced mesh for every volume on both walls and both tiers.
  const bookGeo = new THREE.BoxGeometry(1, 1, 1);
  const bookMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });
  const perRow = 26;
  const rowsPerTier = 5;
  const total = bays * 2 * 2 * rowsPerTier * perRow;
  const books = new THREE.InstancedMesh(bookGeo, bookMat, total);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const col = new THREE.Color();
  let n = 0;

  const windows: THREE.MeshBasicMaterial[] = [];
  const candles: THREE.PointLight[] = [];

  for (let b = 0; b < bays; b++) {
    const zc = -b * BAY_LEN - BAY_LEN;
    for (const side of [-1, 1]) {
      const wallX = side * half;
      // Pilaster on the near edge of each bay, white with a gilt capital.
      const pil = new THREE.Mesh(new THREE.BoxGeometry(0.9, 9.2, 0.9), white);
      pil.position.set(wallX - side * 0.25, 4.6, zc + BAY_LEN / 2);
      scene.add(pil);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), gilt);
      cap.position.set(wallX - side * 0.25, 9.3, zc + BAY_LEN / 2);
      scene.add(cap);

      for (const [y0, y1] of [
        [0, 4.2],
        [4.8, 8.8],
      ]) {
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.2, y1 - y0, BAY_LEN - 0.9), wood);
        back.position.set(wallX, (y0 + y1) / 2, zc);
        scene.add(back);
        const spacing = (y1 - y0) / rowsPerTier;
        for (let r = 0; r < rowsPerTier; r++) {
          const shelfY = y0 + r * spacing;
          const board = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, BAY_LEN - 0.9), wood);
          board.position.set(wallX - side * 0.25, shelfY + 0.04, zc);
          scene.add(board);
          let z = zc - (BAY_LEN - 1.2) / 2;
          for (let k = 0; k < perRow && n < total; k++) {
            const seed = n * 1.37 + b * 7.1;
            const w = 0.18 + rand(seed) * 0.16;
            const h = spacing * (0.62 + rand(seed + 1) * 0.3);
            m.compose(
              new THREE.Vector3(wallX - side * 0.3, shelfY + 0.08 + h / 2, z + w / 2),
              q,
              new THREE.Vector3(0.42, h, w)
            );
            books.setMatrixAt(n, m);
            // Spines in muted, varied tones so the shelves read as texture.
            col.setHSL(0.08 + rand(seed + 2) * 0.05, 0.25, 0.22 + rand(seed + 3) * 0.35);
            books.setColorAt(n, col);
            z += w + 0.015;
            n++;
          }
        }
      }

      // The gallery between the tiers, with a gilt handrail.
      const walk = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.25, BAY_LEN), white);
      walk.position.set(wallX - side * 0.75, 4.5, zc);
      scene.add(walk);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, BAY_LEN), gilt);
      rail.position.set(wallX - side * 1.35, 5.45, zc);
      scene.add(rail);
      for (let k = 0; k < 12; k++) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.85, 0.06), white);
        post.position.set(wallX - side * 1.35, 5.0, zc - BAY_LEN / 2 + 0.4 + k * 0.72);
        scene.add(post);
      }

      // Clerestory window above each bay.
      const glass = new THREE.MeshBasicMaterial({ color: 0xffffff });
      windows.push(glass);
      const win = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 3.4), glass);
      win.position.set(wallX - side * 0.05, 11.1, zc);
      win.rotation.y = -side * Math.PI / 2;
      scene.add(win);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 4.2, BAY_LEN), white);
      wall.position.set(wallX + side * 0.05, 11.1, zc);
      scene.add(wall);
    }

    const candle = new THREE.PointLight(0xffa04a, 0, 16, 1.6);
    candle.position.set(0, 3.2, zc);
    scene.add(candle);
    candles.push(candle);
  }

  // Barrel vault with a soft fresco and gilt ribs at every pilaster.
  const fresco = canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = '#efece4';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 40; i++) {
      const g = ctx.createRadialGradient(rand(i) * s, rand(i + 9) * s, 0, rand(i) * s, rand(i + 9) * s, 20 + rand(i + 4) * 50);
      g.addColorStop(0, `rgba(120,110,95,${0.12 + rand(i + 2) * 0.18})`);
      g.addColorStop(1, 'rgba(120,110,95,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    }
  });
  fresco.repeat.set(1, bays);
  const vaultGeo = new THREE.CylinderGeometry(half, half, length, 40, 1, true, -Math.PI / 2, Math.PI);
  vaultGeo.rotateX(Math.PI / 2);
  const vault = new THREE.Mesh(vaultGeo, new THREE.MeshStandardMaterial({ map: fresco, side: THREE.BackSide }));
  vault.position.set(0, 13.2, -length / 2 + BAY_LEN / 2);
  scene.add(vault);
  for (let b = 0; b <= bays; b++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(half - 0.05, 0.12, 6, 32, Math.PI), gilt);
    rib.position.set(0, 13.2, -b * BAY_LEN - BAY_LEN / 2);
    scene.add(rib);
  }

  // The far wall: one tall window the walk ends at.
  const endGlass = new THREE.MeshBasicMaterial({ color: 0xffffff });
  windows.push(endGlass);
  const endWall = new THREE.Mesh(new THREE.PlaneGeometry(NAVE_W, 20), white);
  endWall.position.set(0, 10, -length + BAY_LEN / 2);
  scene.add(endWall);
  const endWin = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 9), endGlass);
  endWin.position.set(0, 9, -length + BAY_LEN / 2 + 0.05);
  scene.add(endWin);

  books.instanceMatrix.needsUpdate = true;
  if (books.instanceColor) books.instanceColor.needsUpdate = true;
  scene.add(books);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x777777, 1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(5, 14, 2);
  scene.add(sun);

  return { scene, length, hemi, sun, windows, candles };
}

const VERT = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Each character cell samples the tiny render once: luminance picks a fill
// glyph, the normal pass picks an edge stroke, warm saturated colour is gilt.
const FRAG = `
uniform sampler2D tColor;
uniform sampler2D tNormal;
uniform sampler2D tAtlas;
uniform vec2 uGrid;
uniform vec2 uCell;
uniform float uGlyphs;
uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uFill;
uniform vec3 uGilt;
uniform float uDark;

void main() {
  vec2 cell = floor(gl_FragCoord.xy / uCell);
  vec2 local = fract(gl_FragCoord.xy / uCell);
  vec2 uv = (cell + 0.5) / uGrid;
  vec2 px = 1.0 / uGrid;

  vec3 c = texture2D(tColor, uv).rgb;
  float lum = pow(clamp(dot(c, vec3(0.299, 0.587, 0.114)), 0.0, 1.0), 1.0 / 2.2);
  float isGilt = step(0.18, c.r - c.b) * step(0.08, c.r);

  vec3 gx = texture2D(tNormal, uv + vec2(px.x, 0.0)).rgb - texture2D(tNormal, uv - vec2(px.x, 0.0)).rgb;
  vec3 gy = texture2D(tNormal, uv + vec2(0.0, px.y)).rgb - texture2D(tNormal, uv - vec2(0.0, px.y)).rgb;
  float edge = length(vec2(length(gx), length(gy)));

  float glyph;
  bool isEdge = edge > 0.5;
  if (isEdge) {
    float sx = dot(gx, vec3(1.0));
    float sy = dot(gy, vec3(1.0));
    float phi = mod(atan(sx, -sy) + 3.14159265, 3.14159265);
    glyph = 10.0 + mod(floor(phi / 0.78539816 + 0.5), 4.0);
  } else {
    float level = uDark > 0.5 ? lum : 1.0 - pow(lum, 0.8);
    glyph = floor(clamp(level, 0.0, 0.999) * 10.0);
  }

  float a = texture2D(tAtlas, vec2((glyph + local.x) / uGlyphs, local.y)).a;
  vec3 ink = isGilt > 0.5 ? uGilt : (isEdge ? uInk : uFill);
  gl_FragColor = vec4(mix(uBg, ink, a), 1.0);
}
`;

export default function Hall({ progress, bays }: HallProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    } catch {
      return; // No WebGL: the shelves below carry the page on their own.
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = THREE.NoToneMapping;
    wrap.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const hall = buildHall(bays);
    const camera = new THREE.PerspectiveCamera(62, 2, 0.1, 200);
    const normalMat = new THREE.MeshNormalMaterial();
    let rtColor = new THREE.WebGLRenderTarget(2, 2);
    let rtNormal = new THREE.WebGLRenderTarget(2, 2);

    const atlasCanvas = document.createElement('canvas');
    const atlas = new THREE.CanvasTexture(atlasCanvas);
    atlas.minFilter = THREE.LinearFilter;
    atlas.generateMipmaps = false;
    const drawAtlas = () => {
      const w = Math.round(CELL_W * dpr);
      const h = Math.round(CELL_H * dpr);
      atlasCanvas.width = w * GLYPHS.length;
      atlasCanvas.height = h;
      const ctx = atlasCanvas.getContext('2d')!;
      ctx.clearRect(0, 0, atlasCanvas.width, h);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${FONT_PX * dpr}px "JetBrains Mono Full", "JetBrains Mono", monospace`;
      GLYPHS.forEach((g, i) => ctx.fillText(g, i * w + w / 2, h / 2 + dpr));
      atlas.needsUpdate = true;
    };
    drawAtlas();
    document.fonts
      ?.load(`${FONT_PX}px "JetBrains Mono Full"`)
      .then(drawAtlas)
      .catch(() => {});

    const uniforms = {
      tColor: { value: rtColor.texture },
      tNormal: { value: rtNormal.texture },
      tAtlas: { value: atlas },
      uGrid: { value: new THREE.Vector2(1, 1) },
      uCell: { value: new THREE.Vector2(CELL_W * dpr, CELL_H * dpr) },
      uGlyphs: { value: GLYPHS.length },
      uBg: { value: new THREE.Vector3() },
      uInk: { value: new THREE.Vector3() },
      uFill: { value: new THREE.Vector3() },
      uGilt: { value: new THREE.Vector3() },
      uDark: { value: 0 },
    };
    const quadScene = new THREE.Scene();
    quadScene.add(
      new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG }))
    );
    const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let mode: Mode = currentMode();
    const applyMode = () => {
      mode = currentMode();
      uniforms.uBg.value.set(...srgb(css('--bg')));
      uniforms.uInk.value.set(...srgb(css('--text')));
      uniforms.uFill.value.set(...srgb(css('--subtle')));
      uniforms.uGilt.value.set(...srgb(css('--gilt')));
      uniforms.uDark.value = darkGround() ? 1 : 0;
      // Noon: daylight through the windows. Candle: the hall lit by flame.
      // Night: moonlight, the windows the brightest thing in the room.
      const preset = {
        noon: { hemi: 1.6, sun: 1.6, glass: 1.0, candle: 0 },
        candle: { hemi: 0.12, sun: 0, glass: 0.18, candle: 60 },
        night: { hemi: 0.05, sun: 0.35, glass: 0.95, candle: 0 },
      }[mode];
      hall.hemi.intensity = preset.hemi;
      hall.hemi.color.set(mode === 'night' ? 0x8fa4c8 : mode === 'candle' ? 0xffc890 : 0xffffff);
      hall.sun.intensity = preset.sun;
      hall.sun.color.set(mode === 'night' ? 0xa8b8e0 : 0xffffff);
      hall.windows.forEach((w) => w.color.setScalar(preset.glass));
      hall.candles.forEach((c) => (c.userData.base = preset.candle));
    };
    applyMode();
    const modeWatch = new MutationObserver(applyMode);
    modeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode', 'data-theme', 'class'] });

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      const cols = Math.floor(w / CELL_W);
      const rows = Math.floor(h / CELL_H);
      uniforms.uGrid.value.set(cols, rows);
      camera.aspect = (cols * CELL_W) / (rows * CELL_H);
      camera.updateProjectionMatrix();
      rtColor.dispose();
      rtNormal.dispose();
      rtColor = new THREE.WebGLRenderTarget(cols, rows);
      rtNormal = new THREE.WebGLRenderTarget(cols, rows);
      uniforms.tColor.value = rtColor.texture;
      uniforms.tNormal.value = rtNormal.texture;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const pointer = { x: 0 };
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    };
    wrap.addEventListener('pointermove', onMove);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let z = 6;
    let yaw = 0;
    let raf = 0;
    let last = 0;
    const walk = hall.length - BAY_LEN * 1.6;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || now - last < 33) return;
      last = now;
      const t = now / 1000;
      const targetZ = 6 - progress.current * walk;
      z += (targetZ - z) * (still ? 1 : 0.08);
      yaw += ((still ? 0 : pointer.x * 0.35 + Math.sin(t * 0.25) * 0.08) - yaw) * 0.05;
      camera.position.set(Math.sin(t * 0.18) * (still ? 0 : 0.4), 2.4, z);
      camera.lookAt(Math.sin(yaw) * 10, 6.2, z - 14);
      hall.candles.forEach((c, i) => {
        const flicker = 0.82 + 0.18 * Math.sin(t * 7.3 + i * 1.7) * Math.sin(t * 3.1 + i);
        c.intensity = (c.userData.base ?? 0) * (still ? 1 : flicker);
      });

      renderer.setRenderTarget(rtColor);
      renderer.render(hall.scene, camera);
      hall.scene.overrideMaterial = normalMat;
      renderer.setRenderTarget(rtNormal);
      renderer.render(hall.scene, camera);
      hall.scene.overrideMaterial = null;
      renderer.setRenderTarget(null);
      renderer.render(quadScene, quadCam);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      modeWatch.disconnect();
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      rtColor.dispose();
      rtNormal.dispose();
      atlas.dispose();
      hall.scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [bays, progress]);

  return <div ref={wrapRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }} />;
}
