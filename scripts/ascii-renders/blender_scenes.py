"""
Procedural Blender scenes for the ASCII project renders.

Run headless (build.py does this for every scene):
  blender -b --factory-startup -P blender_scenes.py -- --scene thermotouch --out DIR

Each frame is posed directly from Python and rendered with Workbench, rather
than keyframed, so the per-frame logic (exploding layers, a falling water
line, bars growing day by day) stays plain code and survives Blender's
animation API churn.

Accent geometry is coloured red (1, .12, .12); convert.py reads that back as
the accent layer the site paints in --accent.
"""

import argparse
import math
import os
import sys

import bmesh
import bpy
from mathutils import Vector

WHITE = (1.0, 1.0, 1.0, 1.0)
ACCENT = (1.0, 0.12, 0.12, 1.0)


def hash01(*xs):
    h = 2166136261
    for x in xs:
        h = ((h ^ (int(x) & 0xFFFFFFFF)) * 16777619) & 0xFFFFFFFF
    h ^= h >> 13
    h = (h * 1274126177) & 0xFFFFFFFF
    return (h ^ (h >> 16)) / 4294967296.0


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_WORKBENCH'
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.view_settings.view_transform = 'Standard'
    shading = scene.display.shading
    shading.light = 'STUDIO'
    shading.color_type = 'OBJECT'
    shading.show_cavity = True
    shading.cavity_type = 'BOTH'
    shading.show_shadows = True
    shading.shadow_intensity = 0.6
    scene.display.light_direction = (0.45, -0.35, 0.82)
    scene.display.render_aa = '8'
    return scene


def box(name, size, loc, color=WHITE, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = size
    ob.color = color
    if parent:
        ob.parent = parent
    return ob


def cylinder(name, radius, depth, loc, color=WHITE, parent=None, verts=32, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=radius, depth=depth, location=loc, rotation=rot)
    ob = bpy.context.active_object
    ob.name = name
    ob.color = color
    if parent:
        ob.parent = parent
    return ob


def lathe(name, profile, loc, color=WHITE, parent=None, segments=40):
    """Revolve (radius, z) pairs around Z — open-ended tube."""
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    rings = []
    for r, z in profile:
        ring = [bm.verts.new((r * math.cos(2 * math.pi * i / segments),
                              r * math.sin(2 * math.pi * i / segments), z)) for i in range(segments)]
        rings.append(ring)
    for a, b in zip(rings, rings[1:]):
        for i in range(segments):
            j = (i + 1) % segments
            bm.faces.new((a[i], a[j], b[j], b[i]))
    bm.to_mesh(mesh)
    bm.free()
    ob = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    ob.color = color
    if parent:
        ob.parent = parent
    return ob


def pivot(name='pivot'):
    ob = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(ob)
    return ob


def camera(loc, target, lens=50, ortho_scale=None):
    data = bpy.data.cameras.new('cam')
    if ortho_scale:
        data.type = 'ORTHO'
        data.ortho_scale = ortho_scale
    else:
        data.lens = lens
    ob = bpy.data.objects.new('cam', data)
    bpy.context.collection.objects.link(ob)
    ob.location = loc
    direction = Vector(target) - Vector(loc)
    ob.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = ob
    return ob


# --------------------------------------------------------------------------
# ThermoTouch — exploded actuator stack: silicone skin, 5x5 PCM cells with air
# gaps, serpentine heaters, flex PCB. Cells change phase in a travelling wave.
# --------------------------------------------------------------------------
def thermotouch(frames):
    root = pivot()
    cell, gap, n = 5.0, 1.6, 5
    span = n * cell + (n - 1) * gap
    off = (span - cell) / 2

    # Four real layers, kept chunky: fine detail turns to noise at ASCII scale.
    pcb = box('pcb', (span + 4, span + 4, 0.8), (0, 0, 0), parent=root)
    heater = box('heater', (span + 1, span + 1, 0.4), (0, 0, 0), parent=root)
    cells = []
    for j in range(n):
        for i in range(n):
            cells.append(box(f'pcm{i}{j}', (cell, cell, 3.0), (i * (cell + gap) - off, j * (cell + gap) - off, 0), parent=root))
    rim = span + 4
    skin = [
        box('skin_n', (rim, 1.6, 1.0), (0, rim / 2 - 0.8, 0), parent=root),
        box('skin_s', (rim, 1.6, 1.0), (0, -rim / 2 + 0.8, 0), parent=root),
        box('skin_e', (1.6, rim - 3.2, 1.0), (rim / 2 - 0.8, 0, 0), parent=root),
        box('skin_w', (1.6, rim - 3.2, 1.0), (-rim / 2 + 0.8, 0, 0), parent=root),
    ]
    camera((80, -80, 36), (0, 0, 15), ortho_scale=74)

    def pose(f):
        p = f / frames
        explode = 0.5 - 0.5 * math.cos(2 * math.pi * p)
        # Never fully collapsed: the separation between layers is the subject.
        sep = 4.0 + 6.0 * explode
        heater.location.z = sep
        for idx, ob in enumerate(cells):
            i, j = idx % n, idx // n
            # A cooling wave crosses the array: cells absorbing heat sink as
            # the paraffin melts.
            wave = math.sin(2 * math.pi * p * 2 - (i + j) * 0.7)
            melting = wave > 0.5
            ob.scale.z = 3.0 - (0.9 if melting else 0)
            ob.location.z = 2 * sep + ob.scale.z / 2
            ob.color = ACCENT if melting else WHITE
        for ob in skin:
            ob.location.z = 3 * sep + 3.5
        root.rotation_euler.z = math.radians(-20 + 40 * math.sin(2 * math.pi * p))

    return pose


# --------------------------------------------------------------------------
# Radiative cooling — 1 MW hall, sky-facing radiative panels on the roof,
# hyperboloid evaporative tower, thermal storage tank, the pipes between.
# --------------------------------------------------------------------------
def cooling(frames):
    root = pivot()
    hall = box('hall', (16, 10, 4), (0, 0, 2), parent=root)
    for k in range(6):
        box(f'vent{k}', (1.6, 0.15, 2.2), (-6.5 + k * 2.6, -5.05, 2), parent=root)

    panels = []
    for r in range(3):
        for c in range(6):
            ob = box(f'panel{r}{c}', (2.2, 2.4, 0.15), (-6.2 + c * 2.5, -3 + r * 3, 4.9), ACCENT, parent=root)
            ob.rotation_euler.x = math.radians(-12)
            panels.append(ob)
            box(f'leg{r}{c}', (0.15, 0.15, 0.7), (-6.2 + c * 2.5, -2 + r * 3, 4.35), parent=root)

    profile = []
    for k in range(13):
        z = k / 12 * 11
        zc = z - 7.5
        profile.append((2.2 * math.sqrt(1 + (zc / 3.6) ** 2), z))
    lathe('tower', profile, (13, 1, 0), parent=root)

    cylinder('tank', 2.0, 6, (11.5, -6.5, 3), parent=root, verts=40)
    cylinder('tankcap', 2.1, 0.3, (11.5, -6.5, 6.1), parent=root, verts=40)
    cylinder('pipe_a', 0.3, 4.2, (9.6, 1, 1.2), parent=root, rot=(0, math.pi / 2, 0))
    cylinder('pipe_b', 0.3, 3.6, (9.6, -4.6, 1.2), parent=root, rot=(0, math.pi / 2, 0))
    cylinder('pipe_c', 0.3, 5.5, (11.5, -2.2, 1.2), parent=root, rot=(math.pi / 2, 0, 0))
    camera((30, -36, 21), (4, -1, 4), lens=52)

    def pose(f):
        p = f / frames
        root.rotation_euler.z = 2 * math.pi * p
        lit = int(p * len(panels) * 2) % len(panels)
        for k, ob in enumerate(panels):
            ob.color = ACCENT if (k - lit) % len(panels) < 6 else WHITE

    return pose


# --------------------------------------------------------------------------
# Aral basin — displaced terrain and a water plane that drops 1972 -> 2026.
# --------------------------------------------------------------------------
def aral(frames):
    nx, ny = 96, 64
    sx, sy = 48.0, 32.0
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=nx, y_subdivisions=ny, size=1)
    terrain = bpy.context.active_object
    terrain.scale = (sx, sy, 1)
    lobes = [(-0.12, 0.5, 0.28, 3.0), (-0.25, -0.15, 0.36, 4.2), (0.25, -0.15, 0.42, 3.6)]
    for v in terrain.data.vertices:
        u, w = v.co.x, v.co.y
        z = 2.2
        for cx, cy, r, d in lobes:
            q = ((u - cx) / r) ** 2 + ((w - cy) / (r * 1.25)) ** 2
            z -= d * math.exp(-q * 1.6)
        z += 0.3 * math.sin(u * 9 + w * 4) * math.cos(w * 7 - u * 3)
        v.co.z = z
    terrain.color = WHITE

    bpy.ops.mesh.primitive_plane_add(size=1)
    water = bpy.context.active_object
    water.scale = (sx * 0.86, sy * 0.86, 1)
    water.color = ACCENT

    camera((0, -44, 34), (0, -2, -1), lens=40)
    hold = int(frames * 0.15)

    def pose(f):
        k = min(1.0, f / max(1, frames - hold))
        water.location.z = 0.4 - 2.9 * k
        return str(round(1972 + 54 * k))

    return pose


# --------------------------------------------------------------------------
# BuildCored — Orcas v1.5: 10 builders x 30 days, one bar per shipped project.
# --------------------------------------------------------------------------
def buildcored(frames):
    root = pivot()
    builders, days = 10, 30
    bars = {}
    for b in range(builders):
        for d in range(days):
            bars[b, d] = box(f'b{b}_{d}', (0.8, 0.8, 1), (d - days / 2, b - builders / 2, 0), parent=root)
    box('base', (days + 2, builders + 2, 0.3), (-0.5, -0.5, -0.15), parent=root)
    camera((-30, -40, 30), (0, 0, 1), ortho_scale=38)
    hold = int(frames * 0.2)

    def pose(f):
        k = min(1.0, f / max(1, frames - hold))
        day = k * days
        for (b, d), ob in bars.items():
            grown = max(0.0, min(1.0, day - d))
            h = 0.15 + grown * (1.4 + 2.6 * hash01(b, d, 7))
            ob.scale.z = h
            ob.location.z = h / 2
            ob.color = ACCENT if 0 < day - d < 1 else WHITE
        root.rotation_euler.z = math.radians(-8 + 16 * f / frames)
        return f'day {min(days, int(day)):02d}/30'

    return pose


# --------------------------------------------------------------------------
# Zeroth Law — the fixed CCTV view the task is built around: cross traffic
# flowing, a queue held at red, one car running the light through a gap.
# --------------------------------------------------------------------------
def car(name, color=WHITE):
    body = box(f'{name}_body', (4.2, 2.0, 1.0), (0, 0, 0.7), color)
    cabin = box(f'{name}_cabin', (2.2, 1.8, 0.8), (0, 0, 1.6), color)
    return body, cabin


def place(parts, x, y, heading):
    body, cabin = parts
    for ob, z in ((body, 0.7), (cabin, 1.6)):
        ob.location = (x, y, z)
        ob.rotation_euler.z = heading


def traffic(frames):
    L, half = 48.0, 24.0
    box('road_ew', (L, 9, 0.2), (0, 0, 0))
    box('road_ns', (9, L, 0.2), (0, 0, 0.01))
    for sx in (-1, 1):
        for sy in (-1, 1):
            box(f'kerb{sx}{sy}', (12, 12, 0.5), (sx * 11, sy * 11, 0.15))
            cylinder(f'pole{sx}{sy}', 0.2, 6, (sx * 5.5, sy * 5.5, 3), verts=12)
            box(f'lamp{sx}{sy}', (0.6, 0.6, 1.4), (sx * 5.5, sy * 5.5, 6.4))
    for k in range(-5, 6):
        if abs(k) > 1:
            box(f'dash_ew{k}', (2.2, 0.25, 0.05), (k * 4, 0, 0.13))
            box(f'dash_ns{k}', (0.25, 2.2, 0.05), (0, k * 4, 0.14))
    for k in range(5):
        box(f'zebra{k}', (1.0, 3.6, 0.05), (-3.6 + k * 1.8, -7.6, 0.14))
    box('stop_s', (4.2, 0.4, 0.05), (2.2, -9.8, 0.14))
    box('stop_n', (4.2, 0.4, 0.05), (-2.2, 9.8, 0.14))

    east = [car(f'e{i}') for i in range(3)]
    west = [car(f'w{i}') for i in range(3)]
    queue = [car(f'q{i}') for i in range(2)]
    runner = car('runner', ACCENT)
    for i, parts in enumerate(queue):
        place(parts, -2.2, 12.5 + i * 5.5, math.pi / 2)

    camera((19, -23, 17), (0, 1.5, 0), lens=30)

    def pose(f):
        p = f / frames
        for i, parts in enumerate(east):
            place(parts, -half + ((i / 3 + p) % 1) * L, -2.2, 0)
        for i, parts in enumerate(west):
            place(parts, half - ((i / 3 + 1 / 6 + p) % 1) * L, 2.2, math.pi)
        # Timed into the gap between cross-traffic platoons (p ~ 0.25).
        y = -40 + 160 * p if p < 0.5 else -999
        place(runner, 2.2, y, math.pi / 2)
        return f'cam 01  t={p * frames / 12:04.1f}s'

    return pose


SCENES = {
    'zeroth-law-traffic': traffic,
    'thermotouch': thermotouch,
    'radiative-cooling-control': cooling,
    'aral-basin-platform': aral,
    'buildcored': buildcored,
}


def shade_pass(sh):
    sh.light = 'STUDIO'
    sh.color_type = 'OBJECT'
    sh.show_cavity = True
    sh.show_shadows = True


def normal_pass(sh):
    # Blender's bundled normal matcap paints view-space normals as colour, so
    # creases and folds show up as colour steps even where shading is flat.
    sh.light = 'MATCAP'
    sh.studio_light = 'check_normal+y.exr'
    sh.show_cavity = False
    sh.show_shadows = False


def id_pass(sh):
    # One flat random colour per object: every part boundary becomes an edge.
    sh.light = 'FLAT'
    sh.color_type = 'RANDOM'
    sh.show_cavity = False
    sh.show_shadows = False


PASSES = [('shade', shade_pass), ('normal', normal_pass), ('id', id_pass)]


def main():
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    ap = argparse.ArgumentParser()
    ap.add_argument('--scene', required=True, choices=sorted(SCENES))
    ap.add_argument('--out', required=True)
    ap.add_argument('--frames', type=int, default=72)
    ap.add_argument('--width', type=int, default=480)
    ap.add_argument('--height', type=int, default=300)
    args = ap.parse_args(argv)

    scene = reset()
    scene.render.resolution_x = args.width
    scene.render.resolution_y = args.height
    scene.render.resolution_percentage = 100
    pose = SCENES[args.scene](args.frames)

    os.makedirs(args.out, exist_ok=True)
    shading = scene.display.shading
    labels = []
    for f in range(args.frames):
        labels.append(pose(f) or '')
        bpy.context.view_layer.update()
        for name, setup in PASSES:
            setup(shading)
            scene.render.filepath = os.path.join(args.out, f'{f:04d}_{name}.png')
            bpy.ops.render.render(write_still=True)

    with open(os.path.join(args.out, 'labels.txt'), 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(labels))


main()
