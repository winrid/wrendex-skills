---
name: technical-seo
description: Audit the technical SEO of a site: crawlability, indexability, noindex/nofollow conflicts, HTTP status codes, robots.txt, mixed content and viewport tags. Use when the user says "technical SEO", "is my site crawlable", "Google is not indexing my pages", "pages missing from search", or "technical audit".
---

# Technical SEO

The crawlability and indexability layer: noindex, status codes, robots.txt, mixed content, viewport.

Backed by [Wrendex](https://wrendex.com), which crawls the site and runs 21 of its checks, across 6 categories.

## When to use this

- "do a technical SEO audit"
- "Google is not indexing some of my pages"
- "is my site crawlable?"
- "why are pages missing from search results?"

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
| HTTP Status | 6 |
| Indexability | 6 |
| Security | 5 |
| Markup | 2 |
| Content | 1 |
| Robots.txt | 1 |

Every check, with what it means and how to fix it, is in [references/checks.md](references/checks.md).

## Working the findings

- NOINDEX_PAGE is not automatically a bug. Staging routes, thank-you pages and paginated archives are often noindex on purpose. Check with the user before removing one.
- NOINDEX_CONFLICT and NOFOLLOW_CONFLICT mean the meta tag and the X-Robots-Tag header disagree. Fix the source of truth, not whichever one is easier to reach.
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
