# Checks used by `robots-txt`

7 checks. Generated from the Wrendex check catalog
(`GET https://app.wrendex.com/api/catalog`) - do not edit by hand.

Filter a crawl to one of these with
`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>`, or to a whole category
with `?category=<Category>`.

## Indexability

### `NOINDEX_CONFLICT`

**Conflicting noindex signals** (WARNING)

Different sources (meta robots, X-Robots-Tag, sitemap) disagree on whether the page should be indexed.

**Fix:** Pick one source of truth and align the others. Audit middleware that may inject conflicting headers.

### `NOINDEX_NOFOLLOW`

**noindex, nofollow** (WARNING)

The page blocks both indexing and link following. Inbound link authority is wasted.

**Fix:** Decide what the page is for. Either remove it, remove inbound links, or relax the directive.

### `NOINDEX_PAGE`

**Page is noindex** (WARNING)

The page sets robots noindex. Search engines will not include it in results.

**Fix:** If the page should rank, remove the noindex directive from meta robots and the X-Robots-Tag header.

### `NOFOLLOW_CONFLICT`

**Conflicting nofollow signals** (NOTICE)

Meta robots and X-Robots-Tag disagree on follow / nofollow.

**Fix:** Decide which directive is correct, then remove the other.

### `NOFOLLOW_PAGE`

**Page-level nofollow** (NOTICE)

All outbound links on this page are flagged nofollow at the page level, breaking internal link equity.

**Fix:** Drop the page-level nofollow unless this is a pure UGC sandbox. Use per-link rel=nofollow where it really matters.

### `NOINDEX_FOLLOW`

**noindex, follow** (NOTICE)

The page is noindex but follow. Often intentional, occasionally a leftover that hides ranking content.

**Fix:** Confirm the page should not rank. If it should, remove the noindex.

## Robots.txt

### `ROBOTS_TXT_INACCESSIBLE`

**robots.txt inaccessible** (ERROR)

robots.txt could not be fetched. Crawlers may treat the entire site as disallowed.

**Fix:** Make /robots.txt return a 200. If you have no rules, serve an empty allow-all file.
