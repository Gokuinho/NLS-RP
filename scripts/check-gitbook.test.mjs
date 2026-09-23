import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { run, checkLinks, checkHints, checkVouvoiement, checkSummary, checkDiscord } from './check-gitbook.mjs';

function book(files) {
  const root = mkdtempSync(join(tmpdir(), 'gb-'));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

test('le GitBook actuel passe toutes les vérifications', () => {
  const { files, errors } = run();
  assert.deepEqual(errors, []);
  assert.ok(files.length >= 30);
});

test('un lien cassé est détecté', () => {
  const root = book({ 'a.md': '[x](b.md)' });
  assert.ok(checkLinks(join(root, 'a.md'), root).some((e) => e.includes('lien cassé')));
});

test('une ancre est signalée comme fragile', () => {
  const root = book({ 'a.md': '[x](b.md#wipe)', 'b.md': '# B' });
  assert.ok(checkLinks(join(root, 'a.md'), root).some((e) => e.includes('ancre')));
});

test('un hint non fermé ou de style inconnu est détecté', () => {
  const root = book({ 'a.md': '{% hint style="warning" %}\nx', 'b.md': '{% hint style="rouge" %}x{% endhint %}' });
  assert.ok(checkHints(join(root, 'a.md'), root).some((e) => e.includes('non fermé')));
  assert.ok(checkHints(join(root, 'b.md'), root).some((e) => e.includes('inconnu')));
});

test('le tutoiement est détecté, pas dans une citation', () => {
  const root = book({ 'a.md': 'Ouvre ton ticket.', 'b.md': 'Un accord (« je te donne 100 $ ») ne compte pas. Tout va bien.' });
  assert.equal(checkVouvoiement(join(root, 'a.md'), root).length, 1);
  assert.deepEqual(checkVouvoiement(join(root, 'b.md'), root), []);
});

test('le sommaire détecte pages orphelines et entrées manquantes', () => {
  const root = book({ 'SUMMARY.md': '* [A](a.md)\n* [C](c.md)', 'a.md': '# A', 'b.md': '# B' });
  const errors = checkSummary(root);
  assert.ok(errors.some((e) => e.includes('b.md : page absente')));
  assert.ok(errors.some((e) => e.includes('page introuvable c.md')));
});

test('les liens Discord inconnus ou vers un autre serveur sont refusés', () => {
  const known = { guild: '1', invitations: { p: 'https://discord.gg/ok' }, salons: { a: '10' } };
  const root = book({
    'ok.md': '[x](https://discord.gg/ok) [y](https://discord.com/channels/1/10) <a href="https://discord.gg/ok" class="button primary">z</a>',
    'bad.md': '[x](https://discord.gg/pirate) [y](https://discord.com/channels/2/10) <a href="https://discord.com/channels/1/99" class="button">z</a>',
  });
  assert.deepEqual(checkDiscord(join(root, 'ok.md'), root, known), []);
  const errors = checkDiscord(join(root, 'bad.md'), root, known);
  assert.equal(errors.length, 3);
});

test('les liens des boutons HTML sont vérifiés comme les autres', () => {
  const root = book({ 'a.md': '<a href="b.md" class="button primary">x</a>' });
  assert.ok(checkLinks(join(root, 'a.md'), root).some((e) => e.includes('lien cassé')));
});
