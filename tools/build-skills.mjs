#!/usr/bin/env node
// Generate skills/<slug>/ from tools/skills.config.mjs + data/check-catalog.json.
//
// Every skill directory is written standalone - its own copy of the client
// script, its own focus set, its own check reference. `npx skills add
// <repo> --skill broken-links` installs ONE directory, so nothing may live
// above the skill root or it will not be there at install time.

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SKILLS } from './skills.config.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = JSON.parse(readFileSync(join(ROOT, 'data', 'check-catalog.json'), 'utf8'));
const CLIENT = readFileSync(join(ROOT, 'templates', 'wrendex.mjs'), 'utf8');

const DESCRIPTION_LIMIT = 1024;
const INLINE_TABLE_LIMIT = 16;

const byType = new Map(CATALOG.map((e) => [e.type, e]));
const byCategory = new Map();
for (const e of CATALOG) {
  if (!byCategory.has(e.category)) byCategory.set(e.category, []);
  byCategory.get(e.category).push(e);
}

function resolveFocus(skill) {
  if (skill.categories === '*') return { entries: CATALOG, wildcard: true };

  const entries = [];
  const seen = new Set();
  const push = (e) => {
    if (e && !seen.has(e.type)) {
      seen.add(e.type);
      entries.push(e);
    }
  };

  for (const c of skill.categories || []) {
    const inCat = byCategory.get(c);
    if (!inCat) throw new Error(`${skill.slug}: unknown category "${c}"`);
    inCat.forEach(push);
  }
  for (const t of skill.types || []) {
    const e = byType.get(t);
    if (!e) throw new Error(`${skill.slug}: unknown check type "${t}"`);
    push(e);
  }
  if (!entries.length) throw new Error(`${skill.slug}: focus set is empty`);
  return { entries, wildcard: false };
}

const SEVERITY_ORDER = { ERROR: 0, WARNING: 1, NOTICE: 2 };
const bySeverityThenType = (a, b) =>
  (SEVERITY_ORDER[a.severityDefault] - SEVERITY_ORDER[b.severityDefault]) ||
  a.type.localeCompare(b.type);

function checkTable(entries) {
  const rows = [...entries].sort(bySeverityThenType).map(
    (e) => `| \`${e.type}\` | ${e.severityDefault} | ${e.title} |`,
  );
  return ['| Check | Severity | What it means |', '| --- | --- | --- |', ...rows].join('\n');
}

function categoryTable(entries) {
  const counts = new Map();
  for (const e of entries) counts.set(e.category, (counts.get(e.category) || 0) + 1);
  const rows = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([cat, n]) => `| ${cat} | ${n} |`);
  return ['| Category | Checks |', '| --- | --- |', ...rows].join('\n');
}

function skillMd(skill, entries, wildcard) {
  if (skill.description.length > DESCRIPTION_LIMIT) {
    throw new Error(`${skill.slug}: description is ${skill.description.length} chars, limit is ${DESCRIPTION_LIMIT}`);
  }

  const focusLine = wildcard
    ? `runs all ${entries.length} checks in the Wrendex catalog`
    : `runs ${entries.length} of its checks, across `
      + `${new Set(entries.map((e) => e.category)).size} categories`;

  const checksSection = entries.length <= INLINE_TABLE_LIMIT
    ? checkTable(entries)
    : `${categoryTable(entries)}\n\nEvery check, with what it means and how to fix it, is in [references/checks.md](references/checks.md).`;

  return `---
name: ${skill.slug}
description: ${skill.description}
---

# ${skill.title}

${skill.summary}

Backed by [Wrendex](https://wrendex.com), which crawls the site and ${focusLine}.

## When to use this

${skill.triggers.map((t) => `- ${t}`).join('\n')}

## Running it

Node 18 or newer. No dependencies to install.

**A free scan, no account:**

\`\`\`bash
node scripts/wrendex.mjs preview https://example.com
\`\`\`

Returns issue **counts** by check type. It does not return which URLs are
affected - that needs a workspace.

**The full fix list:**

\`\`\`bash
node scripts/wrendex.mjs signup                          # once per machine
node scripts/wrendex.mjs audit https://example.com --wait --max-pages 200
node scripts/wrendex.mjs issues <crawlId>
\`\`\`

\`signup\` takes no email and no password. It creates a workspace, saves a
\`wrn_\` token to \`~/.wrendex/credentials.json\` (mode 0600), and returns a
**claim link**. Hand that link to the user: whoever opens it becomes the owner
of the workspace. Until someone does, the workspace cannot be funded and is
deleted after 7 days.

A new workspace starts with **500 free credits** - one per page fetched, two
when JS rendering is on - so the first audit runs immediately, before anyone
pays. Cap a large site with \`--max-pages\` to make them last. When they run
out, \`audit\` returns \`{"ok": false, "code": "NO_CREDITS"}\` with the claim
link: the workspace has to be claimed before it can be funded.

## Reading the output

Every command writes JSON to stdout and progress to stderr.

\`issues\` returns one entry per **unique problem**, ranked by \`pageCount\` -
how many pages it affects. The checks fire per page, so a single dead URL
linked from 400 pages is one entry with \`pageCount: 400\`, not 400 findings.
\`pageUrls\` is a capped sample; trust \`pageCount\` for reach.

\`\`\`json
{
  "type": "LINKS_TO_BROKEN",
  "severity": "ERROR",
  "target": "https://example.com/old-pricing",
  "pageCount": 412,
  "pageUrls": ["https://example.com/", "https://example.com/blog"]
}
\`\`\`

Fix in \`pageCount\` order. High-reach items are nearly always one edit in a
shared template.

## What this covers

${checksSection}

## Working the findings

${skill.guidance.map((g) => `- ${g}`).join('\n')}
- Re-run \`audit\` after fixing to confirm. \`GET /api/crawls/{crawlId}/diff\`
  shows what a crawl resolved against the previous one.
- Do not edit files you were not asked to touch. Report what you found, fix
  what the user agreed to, and leave the rest in the list.

## Reference

- [references/checks.md](references/checks.md) - every check this skill uses,
  with the fix for each.
- API reference: <https://wrendex.com/docs/api>
- Agent guide: <https://wrendex.com/agents.md> - the same crawl is reachable
  over MCP at \`https://app.wrendex.com/mcp\` using the token from \`signup\`.
`;
}

function checksReference(skill, entries) {
  const groups = new Map();
  for (const e of [...entries].sort(bySeverityThenType)) {
    if (!groups.has(e.category)) groups.set(e.category, []);
    groups.get(e.category).push(e);
  }

  const sections = [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([cat, list]) => {
      const body = list
        .map(
          (e) =>
            `### \`${e.type}\`\n\n`
            + `**${e.title}** (${e.severityDefault})\n\n`
            + `${e.description}\n\n`
            + `**Fix:** ${e.howToFix}\n`,
        )
        .join('\n');
      return `## ${cat}\n\n${body}`;
    });

  return `# Checks used by \`${skill.slug}\`

${entries.length} checks. Generated from the Wrendex check catalog
(\`GET https://app.wrendex.com/api/catalog\`) - do not edit by hand.

Filter a crawl to one of these with
\`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>\`, or to a whole category
with \`?category=<Category>\`.

${sections.join('\n')}`;
}

function build() {
  const outRoot = join(ROOT, 'skills');
  if (existsSync(outRoot)) rmSync(outRoot, { recursive: true });

  const slugs = new Set();
  for (const skill of SKILLS) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(skill.slug)) {
      throw new Error(`${skill.slug}: slug must be kebab-case`);
    }
    if (slugs.has(skill.slug)) throw new Error(`duplicate slug ${skill.slug}`);
    slugs.add(skill.slug);

    const { entries, wildcard } = resolveFocus(skill);
    const dir = join(outRoot, skill.slug);
    mkdirSync(join(dir, 'scripts'), { recursive: true });
    mkdirSync(join(dir, 'references'), { recursive: true });

    writeFileSync(join(dir, 'SKILL.md'), skillMd(skill, entries, wildcard));
    writeFileSync(join(dir, 'scripts', 'wrendex.mjs'), CLIENT, { mode: 0o755 });
    writeFileSync(join(dir, 'references', 'checks.md'), checksReference(skill, entries));

    // The client reads this to narrow a crawl-wide issue summary to the checks
    // this skill is about. Wildcard skills ship no filter at all.
    writeFileSync(
      join(dir, 'focus.json'),
      JSON.stringify(
        wildcard
          ? { name: skill.title, types: null }
          : { name: skill.title, types: entries.map((e) => e.type) },
        null,
        2,
      ) + '\n',
    );

    const lines = readFileSync(join(dir, 'SKILL.md'), 'utf8').split('\n').length;
    if (lines > 500) throw new Error(`${skill.slug}: SKILL.md is ${lines} lines, limit is 500`);
    process.stdout.write(
      `  ${skill.slug.padEnd(18)} ${String(entries.length).padStart(3)} checks  ${lines} lines\n`,
    );
  }
  process.stdout.write(`\n${SKILLS.length} skills written to skills/\n`);
}

build();
