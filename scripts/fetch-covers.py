"""
Fetch a cover for every book in content/books, store it locally, and colour
the spine from it.

usage: python scripts/fetch-covers.py [slug ...] [--force]

- Uses the book's existing http coverImage when it has one, otherwise the
  most widely held Open Library edition that has a cover.
- Saves public/library/covers/<slug>.jpg at 480px tall: self-hosted, so a
  dead hotlink can never blank the shelf.
- spineColor is the cover's dominant colour; textColor is paper or ink,
  whichever reads against it. Both are written back into the frontmatter.
"""

import argparse
import io
import json
import os
import re
import sys
import urllib.parse
import urllib.request

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BOOKS = os.path.join(ROOT, 'content', 'books')
OUT = os.path.join(ROOT, 'public', 'library', 'covers')
UA = {'User-Agent': 'imamatdin.com cover fetch (imamatdin.com)'}
PAPER, INK = '#FFFCF0', '#100F0F'
FONT = os.path.join(os.path.dirname(__file__), 'fonts', 'JetBrainsMono-Regular.ttf')

# Essays and talks have no cover, and neither do some books: these get a
# typeset one, so every spine on the shelf is real rather than a placeholder.
PLATES = {
    'essay': ('#FFFCF0', '#100F0F', '#AF3029', 'ESSAY'),
    'talk': ('#100F0F', '#FFFCF0', '#D0A215', 'TALK'),
    'book': ('#1F3A4D', '#FFFCF0', '#D0A215', ''),
}


def wrap(draw, text, font, width):
    lines, line = [], ''
    for word in text.split():
        trial = f'{line} {word}'.strip()
        if draw.textlength(trial, font=font) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    return lines + [line]


def typeset(title, author, kind):
    bg, fg, rule, label = PLATES.get(kind, PLATES['book'])
    W, H = 320, 480
    img = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(img)
    d.rectangle([16, 16, W - 17, H - 17], outline=rule, width=2)
    small = ImageFont.truetype(FONT, 15)
    if label:
        d.text((W / 2, 52), label, font=small, fill=rule, anchor='mm')
    size = 30 if len(title) < 28 else 24
    big = ImageFont.truetype(FONT, size)
    lines = wrap(d, title, big, W - 70)
    y = H * 0.42 - (len(lines) - 1) * size * 0.65
    for ln in lines:
        d.text((W / 2, y), ln, font=big, fill=fg, anchor='mm')
        y += size * 1.3
    d.line([(W / 2 - 36, y + 8), (W / 2 + 36, y + 8)], fill=rule, width=2)
    for i, ln in enumerate(wrap(d, author, small, W - 70)):
        d.text((W / 2, y + 40 + i * 22), ln, font=small, fill=fg, anchor='mm')
    return img


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return r.read()


def field(text, name):
    m = re.search(rf'^{name}:\s*"?(.*?)"?\s*$', text, re.M)
    return m.group(1) if m else ''


def set_field(text, name, value):
    line = f'{name}: "{value}"'
    if re.search(rf'^{name}:.*$', text, re.M):
        return re.sub(rf'^{name}:.*$', line, text, count=1, flags=re.M)
    return re.sub(r'^---\s*$', '---\n' + line, text, count=1, flags=re.M)


def open_library(title, author):
    # "Kleppner and Kolenkow", "Stewart, Clegg, Watson": search by the lead author.
    lead = re.split(r',| and ', author)[0].strip()
    q = urllib.parse.urlencode({'title': title.split(':')[0], 'author': lead, 'fields': 'cover_i,edition_count,title', 'limit': 10})
    docs = json.loads(get(f'https://openlibrary.org/search.json?{q}')).get('docs', [])
    docs = [d for d in docs if d.get('cover_i')]
    if not docs:
        return None
    best = max(docs, key=lambda d: d.get('edition_count', 0))
    return f"https://covers.openlibrary.org/b/id/{best['cover_i']}-L.jpg"


def dominant(img):
    """The colour a reader remembers the book by: the most saturated colour
    that still covers a real share of the cover, else the most common one."""
    small = img.convert('RGB').resize((64, 96))
    pal = small.quantize(colors=6, method=Image.Quantize.MEDIANCUT)
    palette = pal.getpalette()
    total = 64 * 96
    colours = []
    for count, idx in pal.getcolors():
        r, g, b = palette[idx * 3: idx * 3 + 3]
        hi, lo = max(r, g, b), min(r, g, b)
        sat = (hi - lo) / hi if hi else 0
        colours.append((count, sat, (r, g, b)))
    big = [c for c in colours if c[0] >= total * 0.15]
    vivid = [c for c in big if c[1] > 0.35]
    pick = max(vivid, key=lambda c: c[1] * c[0]) if vivid else max(colours, key=lambda c: c[0])
    return pick[2]


def lettering(rgb):
    r, g, b = (c / 255 for c in rgb)
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return INK if lum > 0.55 else PAPER


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('slugs', nargs='*')
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)

    for name in sorted(os.listdir(BOOKS)):
        if not name.endswith('.mdx'):
            continue
        slug = name[:-4]
        if args.slugs and slug not in args.slugs:
            continue
        path = os.path.join(BOOKS, name)
        text = open(path, encoding='utf-8').read()
        dest = os.path.join(OUT, f'{slug}.jpg')
        if os.path.exists(dest) and not args.force:
            img = Image.open(dest)
        else:
            kind = field(text, 'kind') or 'book'
            src = field(text, 'coverImage')
            url = None
            if kind == 'book':
                url = src if src.startswith('http') else open_library(field(text, 'title'), field(text, 'author'))
            if url:
                img = Image.open(io.BytesIO(get(url))).convert('RGB')
            else:
                img = typeset(field(text, 'title'), field(text, 'author'), kind)
                url = f'typeset ({kind})'
            if img.height > 480:
                img = img.resize((round(img.width * 480 / img.height), 480), Image.LANCZOS)
            img.save(dest, 'JPEG', quality=85, optimize=True)
            print(f'{slug}: {url}')
        rgb = dominant(img)
        text = set_field(text, 'coverImage', f'/library/covers/{slug}.jpg')
        text = set_field(text, 'spineColor', '#%02x%02x%02x' % rgb)
        text = set_field(text, 'textColor', lettering(rgb))
        open(path, 'w', encoding='utf-8', newline='').write(text)


if __name__ == '__main__':
    main()
