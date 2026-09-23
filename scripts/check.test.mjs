import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { run, checkInstallLink, EXPECTED_PERMISSIONS } from './check.mjs';

test('le site actuel passe toutes les vérifications', () => {
  const { files, errors } = run();
  assert.deepEqual(errors, []);
  assert.ok(files.length >= 5);
});

test('le bitfield de permissions vaut 131241', () => {
  assert.equal(EXPECTED_PERMISSIONS, 131241n);
});

test('un mauvais client_id est détecté', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nls-'));
  const f = join(dir, 'i.html');
  writeFileSync(f, '<a id="install" href="https://discord.com/oauth2/authorize?client_id=1&amp;permissions=131241&amp;integration_type=0&amp;scope=bot+applications.commands">x</a>');
  assert.ok(checkInstallLink(f).some((e) => e.includes('client_id')));
});

test('des permissions différentes sont détectées', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nls-'));
  const f = join(dir, 'i.html');
  writeFileSync(f, '<a id="install" href="https://discord.com/oauth2/authorize?client_id=1545186081228726292&amp;permissions=8&amp;integration_type=0&amp;scope=bot+applications.commands">x</a>');
  assert.ok(checkInstallLink(f).some((e) => e.includes('permissions')));
});
