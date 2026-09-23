#!/usr/bin/env python3
"""Construit un aperçu HTML autonome du GitBook (gitbook/) pour relecture.

Usage : python3 scripts/build-preview.py <sortie.html>
Reprend SUMMARY.md pour la navigation, rend les {% hint %} comme GitBook,
et transforme les liens entre pages en ancres internes.
"""
import html
import os
import re
import sys

import markdown

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'gitbook')


def page_id(path):
    return re.sub(r'[^a-z0-9]+', '-', path.lower().removesuffix('.md')).strip('-')


def side_of(path):
    return 'legal' if path.startswith('legal/') else 'illegal' if path.startswith('illegal/') else 'nls'


def parse_summary():
    groups, current = [], {'title': None, 'items': []}
    for line in open(os.path.join(ROOT, 'SUMMARY.md'), encoding='utf-8'):
        if line.startswith('## '):
            groups.append(current)
            current = {'title': line[3:].strip(), 'items': []}
            continue
        m = re.match(r'(\s*)\* \[(.+?)\]\((.+?)\)', line)
        if m:
            current['items'].append({'depth': len(m.group(1)) // 2, 'title': m.group(2), 'path': m.group(3)})
    groups.append(current)
    return [g for g in groups if g['items']]


HINT_LABEL = {'info': 'À savoir', 'warning': 'Attention', 'danger': 'Important', 'success': 'Bon à savoir'}


def render(path):
    text = open(os.path.join(ROOT, path), encoding='utf-8').read()
    desc = None
    fm = re.match(r'---\n(.*?)\n---\n', text, re.S)
    if fm:
        d = re.search(r'description:\s*(.+)', fm.group(1))
        desc = d.group(1).strip() if d else None
        text = text[fm.end():]

    def hint(m):
        style = m.group(1)
        inner = markdown.markdown(m.group(2).strip(), extensions=['tables'])
        return (f'\n<aside class="hint hint-{style}"><span class="hint-label">{HINT_LABEL.get(style, "Note")}</span>'
                f'{inner}</aside>\n')

    text = re.sub(r'{%\s*hint style="(\w+)"\s*%}(.*?){%\s*endhint\s*%}', hint, text, flags=re.S)
    body = markdown.markdown(text, extensions=['tables', 'sane_lists'])

    base = os.path.dirname(path)

    def link(m):
        href = m.group(1)
        if href.startswith(('http://', 'https://', 'mailto:', '#')):
            return f'href="{href}" target="_blank" rel="noopener"' if href.startswith('http') else m.group(0)
        target = os.path.normpath(os.path.join(base, href.split('#')[0])).replace('\\', '/')
        return f'href="#{page_id(target)}" data-page="{page_id(target)}"'

    body = re.sub(r'href="([^"]+)"', link, body)
    body = re.sub(r'<table>', '<div class="table-wrap"><table>', body).replace('</table>', '</table></div>')
    if desc:
        body = body.replace('</h1>', f'</h1><p class="lede">{html.escape(desc)}</p>', 1)
    return body


def main(out):
    groups = parse_summary()
    pages, nav = [], []
    for g in groups:
        nav.append('<div class="nav-group">')
        if g['title']:
            tcls = {'Légal': ' t-legal', 'Illégal': ' t-illegal'}.get(g['title'], '')
            nav.append(f'<p class="nav-title{tcls}">{html.escape(g["title"])}</p>')
        nav.append('<ul>')
        for it in g['items']:
            pid = page_id(it['path'])
            pages.append((pid, it['title'], g['title'] or 'Accueil', it['path']))
            cls = ' class="sub"' if it['depth'] else ''
            nav.append(f'<li{cls}><a href="#{pid}" data-page="{pid}" data-side="{side_of(it["path"])}">{html.escape(it["title"])}</a></li>')
        nav.append('</ul></div>')

    sections = []
    for i, (pid, title, group, path) in enumerate(pages):
        prev_ = pages[i - 1] if i else None
        next_ = pages[i + 1] if i + 1 < len(pages) else None
        pager = '<nav class="pager">'
        pager += (f'<a class="prev" href="#{prev_[0]}" data-page="{prev_[0]}"><small>Précédent</small>{html.escape(prev_[1])}</a>'
                  if prev_ else '<span></span>')
        pager += (f'<a class="next" href="#{next_[0]}" data-page="{next_[0]}"><small>Suivant</small>{html.escape(next_[1])}</a>'
                  if next_ else '<span></span>')
        pager += '</nav>'
        sections.append(
            f'<article class="page side-{side_of(path)}" id="p-{pid}" data-id="{pid}" hidden>'
            f'<p class="crumb">{html.escape(group)} <span class="file">{html.escape(path)}</span></p>'
            f'{render(path)}{pager}</article>')

    tpl = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'preview-template.tpl'), encoding='utf-8').read()
    result = tpl.replace('<!--NAV-->', '\n'.join(nav)).replace('<!--PAGES-->', '\n'.join(sections)) \
                .replace('<!--COUNT-->', str(len(pages))) \
                .replace('<!--LOGO-->', open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logo.b64')).read().strip()).replace('<!--FIRST-->', pages[0][0])
    open(out, 'w', encoding='utf-8').write(result)
    print(f'{len(pages)} pages → {out}')


if __name__ == '__main__':
    main(sys.argv[1])
