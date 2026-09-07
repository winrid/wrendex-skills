---
name: 'broken-links'
description: 'Find and fix broken links, 404s, dead external URLs and links pointing at redirects across a site. Use when the user says "check for broken links", "find 404s", "my links are dead", "link audit", "link rot", or is cleaning up internal linking before a launch.'
---

# Broken Links

Find dead internal and external links, 404s, and links that point at redirects.

Backed by [Wrendex](https://wrendex.com), which crawls the site and runs 25 of its checks, across 3 categories.

## When to use this

- "check my site for broken links"
- "find 404s on example.com"
- "are any of my outbound links dead?"
- "clean up internal linking"

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
| External Links | 6 |
| HTTP Status | 6 |

Every check, with what it means and how to fix it, is in [references/checks.md](references/checks.md).

## Working the findings

- One dead URL linked from 400 pages is ONE item with pageCount: 400, not 400 findings. Fix the link target once, in the template or partial that emits it.
- EXTERNAL_LINK_TIMEOUT and EXTERNAL_LINK_BLOCKED are often the remote site rate-limiting the crawler, not a dead link. Verify one by hand before mass-editing.
- LINKS_TO_REDIRECT_INDEXABLE is a cheap win: point the link at the final URL and drop a hop for every crawler and visitor.
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
