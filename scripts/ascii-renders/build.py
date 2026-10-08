"""
Render every Blender scene and convert it to public/ascii/<slug>.json.

usage: python scripts/ascii-renders/build.py [slug ...] [--blender PATH]
Frames go to a temp dir; only the JSON is committed.
"""

import argparse
import glob
import os
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))

# cols x rows at a 0.6 glyph aspect. Rendering 12x20 px per cell keeps
# anti-aliased edges to a thin share of each cell, so strokes stay one glyph.
CELL_W, CELL_H = 12, 20
SCENES = {
    'thermotouch': dict(cols=88, rows=36, frames=72),
    'radiative-cooling-control': dict(cols=88, rows=36, frames=96),
    'aral-basin-platform': dict(cols=88, rows=36, frames=72),
    'buildcored': dict(cols=88, rows=36, frames=72),
    'zeroth-law-traffic': dict(cols=88, rows=36, frames=96),
}


def find_blender(explicit):
    if explicit:
        return explicit
    found = shutil.which('blender')
    if found:
        return found
    hits = sorted(glob.glob(r'C:\Program Files\Blender Foundation\Blender*\blender.exe'))
    if hits:
        return hits[-1]
    sys.exit('blender not found; pass --blender')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('slugs', nargs='*')
    ap.add_argument('--blender')
    args = ap.parse_args()
    blender = find_blender(args.blender)

    for slug in args.slugs or SCENES:
        cfg = SCENES[slug]
        with tempfile.TemporaryDirectory() as tmp:
            subprocess.run([
                blender, '-b', '--factory-startup', '-P', os.path.join(HERE, 'blender_scenes.py'), '--',
                '--scene', slug, '--out', tmp, '--frames', str(cfg['frames']),
                '--width', str(cfg['cols'] * CELL_W), '--height', str(cfg['rows'] * CELL_H),
            ], check=True, stdout=subprocess.DEVNULL)
            subprocess.run([
                sys.executable, os.path.join(HERE, 'convert.py'), tmp,
                os.path.join(ROOT, 'public', 'ascii', f'{slug}.json'),
                '--cols', str(cfg['cols']), '--rows', str(cfg['rows']), '--edge-share', '0.22',
            ], check=True)


if __name__ == '__main__':
    main()
