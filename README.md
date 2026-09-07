# Wrendex agent skills

Technical SEO skills for coding agents. Each one crawls a real site with
[Wrendex](https://wrendex.com) and hands back a ranked, per-URL list of what to
fix, so the agent can go and fix it.

Ten skills, one crawl engine, 143 checks.

## Install

Everything:

```bash
npx skills add winrid/wrendex-skills
```

Or just the one you want:

```bash
npx skills add winrid/wrendex-skills --skill broken-links
```

| Skill | What it finds |
| --- | --- |
| [`seo-audit`](skills/seo-audit) | Everything, ranked by reach. Start here. |
| [`technical-seo`](skills/technical-seo) | Crawlability, indexability, status codes, mixed content |
| [`broken-links`](skills/broken-links) | Dead internal and external links, 404s, links to redirects |
| [`duplicate-content`](skills/duplicate-content) | Identical bodies, repeated titles, thin pages |
| [`canonical-tags`](skills/canonical-tags) | rel=canonical pointing at redirects, 404s, the wrong protocol |
| [`sitemap-audit`](skills/sitemap-audit) | Sitemap entries that 404, redirect, or contradict the page |
| [`robots-txt`](skills/robots-txt) | Unreachable robots.txt, noindex and nofollow inventory |
| [`render-blocking`](skills/render-blocking) | Render-blocking CSS/JS, oversized bundles, duplicated code |
| [`core-web-vitals`](skills/core-web-vitals) | TTFB, compression, page weight, LCP and CLS images |
| [`structured-data`](skills/structured-data) | JSON-LD against schema.org and Google rich-result rules |

## How a skill runs

```bash
node scripts/wrendex.mjs preview https://example.com   # free, no account, counts only
node scripts/wrendex.mjs signup                        # workspace + token, no email
node scripts/wrendex.mjs audit https://example.com --wait
node scripts/wrendex.mjs issues <crawlId>              # the fix list
```

`signup` takes no email and no password. It creates a workspace, saves a `wrn_`
token to `~/.wrendex/credentials.json`, and returns a **claim link** for the
agent to hand to its human. Whoever opens that link owns the workspace.
Unclaimed workspaces are deleted after 7 days.

Node 18+. No dependencies.

## Repo layout

`skills/` is **generated**. Do not edit it by hand.

```
data/check-catalog.json   the 143 checks, vendored from GET /api/catalog
templates/wrendex.mjs     the client, copied into every skill
tools/skills.config.mjs   the skill set: slugs, triggers, focus, guidance
tools/build-skills.mjs    generator
skills/<slug>/            generated, committed, installable standalone
```

Each skill directory is self-contained: its own copy of the client, its own
`focus.json`, its own check reference. `npx skills add --skill <one>` installs a
single directory, so nothing a skill needs may live above its own root.

```bash
npm run build          # regenerate skills/
npm run sync-catalog   # refresh data/check-catalog.json from the live API
npm run check          # rebuild and fail if skills/ is out of date
```

To add a skill, add an entry to `tools/skills.config.mjs` and rebuild. The
generator validates every category and check name against the catalog, caps
`description` at 1024 characters, and fails the build if a `SKILL.md` runs past
500 lines.

## License

MIT
