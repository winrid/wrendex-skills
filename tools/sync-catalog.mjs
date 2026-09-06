#!/usr/bin/env node
// Refresh data/check-catalog.json from the live public catalog endpoint.
//
// The catalog is public (GET /api/catalog, no auth), and it is the source of
// every check name, severity and fix in the generated skills. Vendoring it
// keeps `npm run build` deterministic and offline; this script is how the
// vendored copy gets updated when checks are added.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'data', 'check-catalog.json');
const BASE = process.env.WRENDEX_API_BASE || 'https://app.wrendex.com';

const REQUIRED = ['type', 'category', 'severityDefault', 'title', 'description', 'howToFix'];

const res = await fetch(`${BASE.replace(/\/+$/, '')}/api/catalog`, {
  headers: { accept: 'application/json' },
});
if (!res.ok) {
  process.stderr.write(`GET ${BASE}/api/catalog -> ${res.status}\n`);
  process.exit(1);
}

const catalog = await res.json();
if (!Array.isArray(catalog) || catalog.length === 0) {
  process.stderr.write('Catalog response was not a non-empty array; refusing to overwrite.\n');
  process.exit(1);
}
for (const entry of catalog) {
  for (const field of REQUIRED) {
    if (!entry[field]) {
      process.stderr.write(`Entry ${entry.type || '?'} is missing "${field}"; refusing to overwrite.\n`);
      process.exit(1);
    }
  }
}

const before = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : [];
const added = catalog.filter((e) => !before.some((b) => b.type === e.type)).map((e) => e.type);
const removed = before.filter((b) => !catalog.some((e) => e.type === b.type)).map((b) => b.type);

writeFileSync(OUT, JSON.stringify(catalog, null, 2) + '\n');

process.stdout.write(`${catalog.length} checks written to data/check-catalog.json\n`);
if (added.length) process.stdout.write(`  added:   ${added.join(', ')}\n`);
if (removed.length) process.stdout.write(`  removed: ${removed.join(', ')}\n`);
process.stdout.write('Run `npm run build` to regenerate the skills.\n');
