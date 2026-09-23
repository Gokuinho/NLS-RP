#!/usr/bin/env node
// Vérifie le GitBook (dossier gitbook/) avant publication. Aucune dépendance :
// `node scripts/check-gitbook.mjs`. Sort avec le code 1 s'il trouve une erreur.
//
// Contrôles :
//  - chaque page .md est dans SUMMARY.md, et chaque entrée de SUMMARY.md existe ;
//  - chaque lien relatif pointe vers un fichier existant ;
//  - chaque {% hint %} est fermé et utilise un style reconnu par GitBook ;
//  - le GitBook est au vouvoiement (décision de la Direction du 10/09/2026) :
//    aucun « tu / ton / ta / tes / toi » hors citation « … ».
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT = join(REPO, 'gitbook');
export const HINT_STYLES = new Set(['info', 'success', 'warning', 'danger']);

export function mdFiles(dir = ROOT) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...mdFiles(p));
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

const rel = (root, p) => relative(root, p).split(sep).join('/');

/** Liens markdown [texte](cible) hors blocs de code. */
export function links(md) {
  const clean = md.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '');
  return [...clean.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
}

export function checkLinks(file, root = ROOT) {
  const errors = [];
  for (const url of links(readFileSync(file, 'utf8'))) {
    if (/^(https?:|mailto:)/.test(url)) continue;
    const [path, anchor] = url.split('#');
    if (anchor !== undefined) errors.push(`${rel(root, file)} : ancre fragile ${url} (GitBook génère ses propres ancres)`);
    if (!path) continue;
    const target = resolve(dirname(file), decodeURI(path));
    if (!target.startsWith(root)) errors.push(`${rel(root, file)} : lien hors du GitBook ${url}`);
    else if (!existsSync(target)) errors.push(`${rel(root, file)} : lien cassé ${url}`);
  }
  return errors;
}

export function checkHints(file, root = ROOT) {
  const errors = [];
  const md = readFileSync(file, 'utf8');
  let open = 0;
  for (const m of md.matchAll(/{%\s*(hint|endhint)\b([^%]*)%}/g)) {
    if (m[1] === 'hint') {
      open += 1;
      const style = m[2].match(/style="([^"]+)"/)?.[1];
      if (!HINT_STYLES.has(style)) errors.push(`${rel(root, file)} : style de hint inconnu « ${style} »`);
    } else open -= 1;
    if (open < 0 || open > 1) errors.push(`${rel(root, file)} : hints mal imbriqués`);
  }
  if (open !== 0) errors.push(`${rel(root, file)} : hint non fermé`);
  return errors;
}

const TUTOIEMENT = /(?<![\p{L}’'-])(tu|ton|ta|tes|toi|t’)(?![\p{L}’'-])/giu;

export function checkVouvoiement(file, root = ROOT) {
  const md = readFileSync(file, 'utf8')
    .replace(/«[^»]*»/g, '') // citations de personnages
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\]\([^)]*\)/g, ']'); // chemins de liens
  return [...md.matchAll(TUTOIEMENT)].map((m) => `${rel(root, file)} : tutoiement « ${m[0]} »`);
}

export function summaryEntries(root = ROOT) {
  const md = readFileSync(join(root, 'SUMMARY.md'), 'utf8');
  return links(md).filter((u) => !/^https?:/.test(u));
}

export function checkSummary(root = ROOT) {
  const errors = [];
  const entries = summaryEntries(root);
  const seen = new Set();
  for (const e of entries) {
    if (seen.has(e)) errors.push(`SUMMARY.md : entrée en double ${e}`);
    seen.add(e);
    if (!existsSync(join(root, e))) errors.push(`SUMMARY.md : page introuvable ${e}`);
  }
  for (const f of mdFiles(root)) {
    const r = rel(root, f);
    if (r !== 'SUMMARY.md' && !seen.has(r)) errors.push(`${r} : page absente de SUMMARY.md`);
  }
  return errors;
}

export function run(root = ROOT) {
  const files = mdFiles(root);
  const errors = [
    ...checkSummary(root),
    ...files.flatMap((f) => [...checkLinks(f, root), ...checkHints(f, root), ...checkVouvoiement(f, root)]),
  ];
  return { files, errors };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { files, errors } = run();
  if (errors.length) {
    console.error(errors.map((e) => `✗ ${e}`).join('\n'));
    process.exit(1);
  }
  console.log(`✓ GitBook : ${files.length} pages vérifiées (sommaire, liens, hints, vouvoiement).`);
}
