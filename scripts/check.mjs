#!/usr/bin/env node
// Vérifie le site avant publication. Aucune dépendance : `node scripts/check.mjs`.
// Sort avec le code 1 à la première série d'erreurs.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_PATH = '/nls-rp-legal/'; // chemin du site GitHub Pages
export const CLIENT_ID = '1545186081228726292';

// Permissions attendues sur le lien d'installation (voir README).
export const PERMISSIONS = {
  CreateInstantInvite: 1n << 0n,
  Administrator: 1n << 3n,
  ManageGuild: 1n << 5n,
  ViewAuditLog: 1n << 7n,
  MentionEveryone: 1n << 17n,
};
export const EXPECTED_PERMISSIONS = Object.values(PERMISSIONS).reduce((a, b) => a | b, 0n);

export function htmlFiles(dir = ROOT) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const decode = (s) => s.replace(/&amp;/g, '&');

export function checkFile(file) {
  const errors = [];
  const html = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);
  const need = [
    [/<html lang="fr">/, 'attribut lang="fr"'],
    [/<meta charset="utf-8">/, 'meta charset'],
    [/<meta name="viewport"/, 'meta viewport'],
    [/<title>[^<]{3,}<\/title>/, 'titre'],
  ];
  for (const [re, what] of need) if (!re.test(html)) errors.push(`${rel} : ${what} manquant`);

  if (/<script\b/i.test(html)) errors.push(`${rel} : aucun script attendu`);
  for (const m of html.matchAll(/<link[^>]+href="(https?:[^"]+)"/g)) errors.push(`${rel} : ressource externe ${m[1]}`);

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = decode(m[1]);
    if (/^(https?:|mailto:)/.test(url)) continue;
    if (url.startsWith('#')) {
      if (!ids.has(url.slice(1))) errors.push(`${rel} : ancre introuvable ${url}`);
      continue;
    }
    let path = url.split('#')[0];
    let target;
    if (path.startsWith(BASE_PATH)) target = join(ROOT, path.slice(BASE_PATH.length));
    else if (path.startsWith('/')) { errors.push(`${rel} : chemin absolu hors site ${url}`); continue; }
    else target = resolve(dirname(file), path);
    if (!target.startsWith(ROOT)) { errors.push(`${rel} : lien hors site ${url}`); continue; }
    if (url.endsWith('/') || (existsSync(target) && statSync(target).isDirectory())) target = join(target, 'index.html');
    if (!existsSync(target)) errors.push(`${rel} : lien cassé ${url}`);
  }
  return errors;
}

export function checkInstallLink(file = join(ROOT, 'installer', 'index.html')) {
  const errors = [];
  const html = readFileSync(file, 'utf8');
  const m = html.match(/id="install" href="([^"]+)"/);
  if (!m) return ['installer : bouton d’installation introuvable'];
  const url = new URL(decode(m[1]));
  if (url.origin !== 'https://discord.com' || url.pathname !== '/oauth2/authorize') errors.push('installer : URL OAuth2 inattendue');
  if (url.searchParams.get('client_id') !== CLIENT_ID) errors.push('installer : client_id incorrect');
  if (BigInt(url.searchParams.get('permissions') ?? '-1') !== EXPECTED_PERMISSIONS) errors.push(`installer : permissions ≠ ${EXPECTED_PERMISSIONS}`);
  const scopes = new Set((url.searchParams.get('scope') ?? '').split(/[ +]/));
  for (const s of ['bot', 'applications.commands']) if (!scopes.has(s)) errors.push(`installer : scope ${s} manquant`);
  if (url.searchParams.get('integration_type') !== '0') errors.push('installer : integration_type doit être 0 (serveur)');
  return errors;
}

export function run() {
  const files = htmlFiles();
  const errors = [...files.flatMap(checkFile), ...checkInstallLink()];
  for (const page of ['conditions', 'confidentialite', 'installer']) {
    if (!existsSync(join(ROOT, page, 'index.html'))) errors.push(`page manquante : ${page}/`);
  }
  return { files, errors };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { files, errors } = run();
  if (errors.length) {
    console.error(errors.map((e) => `✗ ${e}`).join('\n'));
    process.exit(1);
  }
  console.log(`✓ ${files.length} pages vérifiées, lien d’installation conforme (permissions ${EXPECTED_PERMISSIONS}).`);
}
