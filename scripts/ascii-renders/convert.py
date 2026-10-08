"""
Rendered PNG frames -> compact ASCII frame data for components/experiments.

Each cell becomes one character of an intermediate alphabet, not final glyphs,
so the site can pick the shading ramp per colour mode (ink on paper wants
shadows dense; light-on-dark wants highlights dense):

  ' '        empty (transparent)
  '0'..'9'   shade level, 0 = darkest surface, 9 = brightest
  'a'..'j'   the same ten levels on accent geometry
  '|' '/' '-' '\\'   edge stroke, oriented along the edge
  'I' 'L' '_' 'K'    the same strokes on accent geometry

Edges come from geometry, not brightness: Sobel over a view-space normal pass,
a per-object colour pass and alpha, combined in a structure tensor. A cell takes
an edge glyph when enough of its pixels are edge, oriented along the tensor's
dominant direction. That is the difference between ASCII that reads as an
object and a blurry ramp.

usage: python convert.py FRAMES_DIR OUT.json --cols 80 --rows 30 --fps 12
"""

import argparse
import glob
import json
import os

import numpy as np
from PIL import Image

EDGE = ['-', '\\', '|', '/']
EDGE_ACCENT = ['_', 'K', 'I', 'L']


def sobel(a):
    p = np.pad(a, 1, mode='edge')
    gx = (p[:-2, 2:] + 2 * p[1:-1, 2:] + p[2:, 2:]) - (p[:-2, :-2] + 2 * p[1:-1, :-2] + p[2:, :-2])
    gy = (p[2:, :-2] + 2 * p[2:, 1:-1] + p[2:, 2:]) - (p[:-2, :-2] + 2 * p[:-2, 1:-1] + p[:-2, 2:])
    return gx, gy


def cells(a, rows, cols):
    h, w = a.shape[:2]
    ch, cw = h // rows, w // cols
    a = a[: ch * rows, : cw * cols]
    return a.reshape(rows, ch, cols, cw, *a.shape[2:]).swapaxes(1, 2).reshape(rows, cols, ch * cw, *a.shape[2:])


def load(path):
    return np.asarray(Image.open(path).convert('RGBA'), dtype=np.float32) / 255.0


def levels(images):
    """Shade range across the whole film, not per frame, so nothing flickers."""
    covered = np.concatenate([im[..., 0][im[..., 3] > 0.5] for im in images])
    lo, hi = np.percentile(covered, [3, 97]) if covered.size else (0.0, 1.0)
    return float(lo), float(max(hi, lo + 1e-3))


def edge_tensor(images):
    """Structure tensor summed over every channel of every geometry pass."""
    jxx = jyy = jxy = 0
    for im in images:
        for c in range(im.shape[-1]):
            gx, gy = sobel(im[..., c])
            jxx = jxx + gx * gx
            jyy = jyy + gy * gy
            jxy = jxy + gx * gy
    return jxx, jyy, jxy


def convert_frame(shade, normal, ident, rows, cols, edge_threshold, edge_share, lo, hi):
    r, g, alpha = shade[..., 0], shade[..., 1], shade[..., 3]
    # Accent geometry is (1, .12, .12): red stays bright, green drops. Shade
    # from red so white and accent surfaces share one lighting scale.
    # Gamma lift keeps broad faces in the sparse end of the ramp; ink pools in
    # shadow and on edges, like a drawing.
    lum = np.clip((r - lo) / (hi - lo), 0, 1) ** 0.7 * alpha
    accent_px = ((r - g) > 0.3) & (alpha > 0.5)

    # Edges from geometry, not brightness: normals catch creases, the per-object
    # pass catches part boundaries, alpha catches the silhouette.
    jxx, jyy, jxy = edge_tensor([normal[..., :3] * alpha[..., None], ident[..., :3] * alpha[..., None], alpha[..., None]])
    edge_px = np.sqrt(jxx + jyy) > edge_threshold

    c_alpha = cells(alpha, rows, cols).mean(axis=2)
    c_lum = cells(lum, rows, cols).sum(axis=2) / np.maximum(cells(alpha, rows, cols).sum(axis=2), 1e-6)
    c_acc = cells(accent_px, rows, cols).mean(axis=2) > 0.35
    c_share = cells(edge_px, rows, cols).mean(axis=2)
    masked = lambda j: cells(np.where(edge_px, j, 0), rows, cols).sum(axis=2)
    sxx, syy, sxy = masked(jxx), masked(jyy), masked(jxy)
    # Dominant gradient angle per cell; the edge runs perpendicular to it.
    theta = 0.5 * np.arctan2(2 * sxy, sxx - syy) + np.pi / 2
    orient = np.round((theta % np.pi) / (np.pi / 4)).astype(int) % 4

    out = []
    for y in range(rows):
        line = []
        for x in range(cols):
            if c_alpha[y, x] < 0.12:
                line.append(' ')
                continue
            acc = bool(c_acc[y, x])
            if c_share[y, x] > edge_share:
                line.append((EDGE_ACCENT if acc else EDGE)[orient[y, x]])
                continue
            level = int(np.clip(c_lum[y, x], 0, 0.999) * 10)
            line.append(chr((ord('a') if acc else ord('0')) + level))
        out.append(''.join(line).rstrip())
    return '\n'.join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('frames_dir')
    ap.add_argument('out')
    ap.add_argument('--cols', type=int, default=80)
    ap.add_argument('--rows', type=int, default=30)
    ap.add_argument('--fps', type=int, default=12)
    ap.add_argument('--edge-threshold', type=float, default=0.35)
    ap.add_argument('--edge-share', type=float, default=0.22)
    args = ap.parse_args()

    shades = sorted(glob.glob(os.path.join(args.frames_dir, '*_shade.png')))
    images = [load(p) for p in shades]
    lo, hi = levels(images)
    frames = []
    for path, shade in zip(shades, images):
        normal = load(path.replace('_shade', '_normal'))
        ident = load(path.replace('_shade', '_id'))
        frames.append(convert_frame(shade, normal, ident, args.rows, args.cols,
                                    args.edge_threshold, args.edge_share, lo, hi))

    labels_path = os.path.join(args.frames_dir, 'labels.txt')
    labels = []
    if os.path.exists(labels_path):
        with open(labels_path, encoding='utf-8') as fh:
            labels = fh.read().split('\n')
    if not any(labels):
        labels = []

    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, 'w', encoding='utf-8') as fh:
        json.dump({'cols': args.cols, 'rows': args.rows, 'fps': args.fps, 'frames': frames, 'labels': labels},
                  fh, separators=(',', ':'))
    print(f'{args.out}: {len(frames)} frames, {os.path.getsize(args.out) // 1024} KB')


if __name__ == '__main__':
    main()
