---
name: seo-audit
description: Run a full technical SEO audit of a site and get a ranked, per-URL list of what to fix. Use when the user says "audit my site", "run an SEO audit", "check my SEO", "why is my site not ranking", "find SEO problems", or wants a health check before a launch or migration.
---

# SEO Audit

Crawl a whole site and come back with a ranked list of what to fix, worst reach first.

Backed by [Wrendex](https://wrendex.com), which crawls the site and runs all 143 checks in the Wrendex catalog.

## When to use this

- "run an SEO audit on example.com"
- "what SEO issues does my site have?"
- "check my site before we launch"
- "why is my site not ranking?"

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
| Internal Links | 13 |
| Hreflang | 10 |
| Redirects | 10 |
| Sitemap | 10 |
| Structured Data | 10 |
| Structured Data (Google) | 9 |
| Canonical | 8 |
| Cross-Crawl Changes | 6 |
| External Links | 6 |
| HTTP Status | 6 |
| Indexability | 6 |
| Images | 5 |
| Meta Description | 5 |
| Security | 5 |
| Title | 5 |
| Performance | 4 |
| AMP | 3 |
| CSS | 3 |
| Headings | 3 |
| JS | 3 |
| Social | 3 |
| Duplicate Code | 2 |
| Markup | 2 |
| Render-Blocking | 2 |
| Billing | 1 |
| Content | 1 |
| Duplicates | 1 |
| Robots.txt | 1 |

Every check, with what it means and how to fix it, is in [references/checks.md](references/checks.md).

## Working the findings

- Start here when the request is open-ended. The narrower skills in this repo (broken-links, canonical-tags, sitemap-audit, ...) share the same crawl, so if a crawl already ran you can pass its crawlId straight to those instead of re-crawling.
- Fix in reach order. The output is sorted by pageCount, and one item with pageCount: 400 is worth more than forty items with pageCount: 1.
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
