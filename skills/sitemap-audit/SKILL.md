---
name: sitemap-audit
description: Audit XML sitemaps: URLs that 404 or redirect, noindex or non-canonical entries, pages missing from the sitemap entirely, duplicates across sitemap files, and malformed XML. Use when the user says "check my sitemap", "sitemap.xml", "sitemap errors in Search Console", or "my sitemap is out of date".
---

# Sitemap Audit

Check XML sitemaps against what the crawler actually found.

Backed by [Wrendex](https://wrendex.com), which crawls the site and runs 10 of its checks, across 1 categories.

## When to use this

- "check my sitemap"
- "Search Console says my sitemap has errors"
- "is my sitemap up to date?"

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
| `INVALID_SITEMAP_FORMAT` | ERROR | Invalid sitemap format |
| `SITEMAP_403_FORBIDDEN` | ERROR | Sitemap URL forbidden |
| `SITEMAP_4XX` | ERROR | Sitemap URL returns 4xx |
| `SITEMAP_5XX` | ERROR | Sitemap URL returns 5xx |
| `SITEMAP_NOINDEX` | WARNING | Sitemap URL is noindex |
| `SITEMAP_TIMEOUT` | WARNING | Sitemap URL timed out |
| `DUPLICATE_IN_SITEMAPS` | NOTICE | Duplicate URL in sitemaps |
| `MISSING_FROM_SITEMAP` | NOTICE | URL missing from sitemap |
| `SITEMAP_3XX_REDIRECT` | NOTICE | Sitemap URL redirects |
| `SITEMAP_NON_CANONICAL` | NOTICE | Sitemap URL non-canonical |

## Working the findings

- MISSING_FROM_SITEMAP is measured against what the crawl reached, so it is only meaningful on a crawl that finished. Check the run status before acting on it.
- SITEMAP_NOINDEX and SITEMAP_NON_CANONICAL are contradictions the site is telling Google: the sitemap says "index this", the page says "do not". Decide which one is right.
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
