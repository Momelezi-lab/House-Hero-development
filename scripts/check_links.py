#!/usr/bin/env python3
import os, re

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_ROOT = os.path.join(REPO_ROOT, 'house-hero-app', 'public')

html_files = []
for root, dirs, files in os.walk(PUBLIC_ROOT):
    for f in files:
        if f.endswith('.html') or f.endswith('.js'):
            html_files.append(os.path.join(root, f))

link_pattern = re.compile(r'href\s*=\s*"([^"]+\.html)"')
link_pattern_single = re.compile(r"href\s*=\s*'([^']+\.html)'")
js_assign_pattern = re.compile(r'window\.location\.href\s*=\s*"([^"]+\.html)"')
js_assign_single = re.compile(r"window\.location\.href\s*=\s*'([^']+\.html)'")

missing = []
checked = 0
external = 0

for src in html_files:
    with open(src, 'r', encoding='utf-8') as fh:
        text = fh.read()
    # find matches
    matches = []
    for p in (link_pattern, link_pattern_single, js_assign_pattern, js_assign_single):
        matches += p.findall(text)
    for href in matches:
        checked += 1
        # ignore absolute/external
        if href.startswith('http://') or href.startswith('https://') or href.startswith('mailto:'):
            external += 1
            continue
        # Normalize path relative to source
        if href.startswith('/'):
            candidate = os.path.normpath(os.path.join(PUBLIC_ROOT, href.lstrip('/')))
        else:
            candidate = os.path.normpath(os.path.join(os.path.dirname(src), href))
        if not os.path.exists(candidate):
            missing.append((src, href, candidate))

print('Link check summary')
print('  Files scanned:', len(html_files))
print('  Links checked:', checked)
print('  External links skipped:', external)
print('  Missing targets:', len(missing))
if missing:
    print('\nMissing link details:')
    for src, href, candidate in missing:
        rel_src = os.path.relpath(src, REPO_ROOT)
        rel_cand = os.path.relpath(candidate, REPO_ROOT)
        print(f'- In {rel_src} -> "{href}" resolves to {rel_cand} (MISSING)')
else:
    print('No missing internal HTML targets found.')

# exit code
if missing:
    exit(2)
else:
    exit(0)
