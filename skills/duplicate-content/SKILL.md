---
name: 'duplicate-content'
description: 'Find duplicate content across a site: identical page bodies, repeated titles and meta descriptions, duplicate H1s and thin pages, plus the missing canonicals behind them. Use when the user says "duplicate content", "duplicate titles", "my pages are competing", "thin content", or "canonicalization issues".'
---

# Duplicate Content

Find pages competing with each other: identical bodies, repeated titles, thin content.

Backed by [Wrendex](https://wrendex.com), which crawls the site and runs 7 of its checks, across 6 categories.

## When to use this

- "do I have duplicate content?"
- "find duplicate titles across my site"
- "my pages are cannibalizing each other"
- "check for thin content"

## Running it

Node 18 or newer. No dependencies to install.

**A free scan, no account:**

```bash
node scripts/wrendex.mjs preview https://example.com
```

Returns issue **counts** by check type. It does not return which URLs are
affected - that needs a workspace.

**The full fix list:**

```bash
node scripts/wrendex.mjs signup                          # once per machine
node scripts/wrendex.mjs audit https://example.com --wait --max-pages 200
node scripts/wrendex.mjs issues <crawlId>
```

`signup` takes no email and no password. It creates a workspace, saves a
`wrn_` token to `~/.wrendex/credentials.json` (mode 0600), and returns a
**claim link**. Hand that link to the user: whoever opens it becomes the owner
of the workspace. Until someone does, the workspace cannot be funded and is
deleted after 7 days.

A new workspace starts with **500 free credits** - one per page fetched, two
when JS rendering is on - so the first audit runs immediately, before anyone
pays. Cap a large site with `--max-pages` to make them last. When they run
out, `audit` returns `{"ok": false, "code": "NO_CREDITS"}` with the claim
link: the workspace has to be claimed before it can be funded.

## Reading the output

Every command writes JSON to stdout and progress to stderr.

`issues` returns one entry per **unique problem**, ranked by `pageCount` -
how many pages it affects. The checks fire per page, so a single dead URL
linked from 400 pages is one entry with `pageCount: 400`, not 400 findings.
`pageUrls` is a capped sample; trust `pageCount` for reach.

```json
{
  "type": "LINKS_TO_BROKEN",
  "severity": "ERROR",
  "target": "https://example.com/old-pricing",
  "pageCount": 412,
  "pageUrls": ["https://example.com/", "https://example.com/blog"]
}
```

Fix in `pageCount` order. High-reach items are nearly always one edit in a
shared template.

## What this covers

| Check | Severity | What it means |
| --- | --- | --- |
| `DUPLICATE_TITLE` | WARNING | Duplicate title across pages |
| `DUPLICATES_NO_CANONICAL` | WARNING | Duplicates without canonical |
| `IDENTICAL_CONTENT` | WARNING | Identical content |
| `NON_CANONICAL_AS_CANONICAL` | WARNING | Non-canonical declared as canonical |
| `DUPLICATE_H1` | NOTICE | Duplicate H1 across pages |
| `DUPLICATE_META_DESCRIPTION` | NOTICE | Duplicate meta description |
| `LOW_WORD_COUNT` | NOTICE | Thin content |

## Working the findings

- IDENTICAL_CONTENT plus DUPLICATES_NO_CANONICAL is the pairing that matters: duplicates are fine when one of them is canonical. Add the canonical before rewriting any copy.
- Faceted and paginated URLs are the usual source. Look for a query-parameter pattern in the affected URLs before treating each page as a separate authoring problem.
- Re-run `audit` after fixing to confirm. `GET /api/crawls/{crawlId}/diff`
  shows what a crawl resolved against the previous one.
- Do not edit files you were not asked to touch. Report what you found, fix
  what the user agreed to, and leave the rest in the list.

## Reference

- [references/checks.md](references/checks.md) - every check this skill uses,
  with the fix for each.
- API reference: <https://wrendex.com/docs/api>
- Agent guide: <https://wrendex.com/agents.md> - the same crawl is reachable
  over MCP at `https://app.wrendex.com/mcp` using the token from `signup`.
