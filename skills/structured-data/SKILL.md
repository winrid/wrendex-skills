---
name: structured-data
description: Validate JSON-LD structured data across a site against schema.org and against Google rich-result requirements: parse errors, invalid or deprecated types and properties, missing required fields, unresolved @id references and bad dates. Use when the user says "structured data", "schema markup", "JSON-LD", "rich results", "rich snippets", or "Search Console structured data errors".
---

# Structured Data

Validate JSON-LD against schema.org and against what Google actually requires.

Backed by [Wrendex](https://wrendex.com), which crawls the site and runs 19 of its checks, across 2 categories.

## When to use this

- "validate my structured data"
- "my rich results stopped showing"
- "check my schema markup"
- "Search Console is reporting structured data errors"

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

| Category | Checks |
| --- | --- |
| Structured Data | 10 |
| Structured Data (Google) | 9 |

Every check, with what it means and how to fix it, is in [references/checks.md](references/checks.md).

## Working the findings

- The JSON_LD_GOOGLE_* checks are the ones that gate rich results. A page can be valid schema.org and still lose its rich result by missing a Google-required field, so fix those first.
- Structured data is nearly always template-generated. Group the findings by template before editing anything: one fix usually clears hundreds of pages.
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
