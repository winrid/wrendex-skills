# Checks used by `technical-seo`

21 checks. Generated from the Wrendex check catalog
(`GET https://app.wrendex.com/api/catalog`) - do not edit by hand.

Filter a crawl to one of these with
`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>`, or to a whole category
with `?category=<Category>`.

## Content

### `LOW_WORD_COUNT`

**Thin content** (NOTICE)

The page has very few words. Thin content rarely ranks and may be classified as low quality.

**Fix:** Add substantive copy that covers the topic in depth, or noindex / consolidate the page if it is a thin utility view.

## HTTP Status

### `HTTP_403`

**403 Forbidden** (ERROR)

The server refused the request. Crawlers and users alike see a wall instead of content.

**Fix:** Check auth rules, IP allowlists, and crawler user-agent blocks. Open the page to public traffic if it should be indexed.

### `HTTP_404`

**404 Not Found** (ERROR)

The page returns 404. Search engines drop it from the index and inbound links waste their authority.

**Fix:** Restore the page, redirect (301) the URL to its replacement, or remove inbound links pointing at it.

### `HTTP_409`

**409 Conflict** (ERROR)

The server reports the request conflicts with current state. Often a deployment or data race issue.

**Fix:** Inspect server logs, fix the conflicting condition, and retry. Add a regression test if it recurs.

### `HTTP_4XX`

**4xx client error** (ERROR)

The page returned a 4xx response other than 403/404/409. The URL is unreachable for crawlers.

**Fix:** Check the exact status in the alert detail and fix the underlying cause (auth, validation, missing resource).

### `HTTP_500`

**500 Internal Server Error** (ERROR)

The server crashed handling this URL. Repeated 500s deindex the page over time.

**Fix:** Check application logs for the stack trace and ship a fix. Add monitoring on this endpoint.

### `HTTP_5XX`

**5xx server error** (ERROR)

The page returned a 5xx response. Search engines treat repeated 5xx as a removal signal.

**Fix:** Investigate server logs for the failing path. Add retry / fallback handling so transient issues do not surface.

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

## Markup

### `MISSING_VIEWPORT`

**Missing viewport meta** (WARNING)

No <meta name="viewport"> tag. Mobile rendering will be broken and Google flags the page as non-mobile-friendly.

**Fix:** Add <meta name="viewport" content="width=device-width, initial-scale=1"> in the <head>.

### `INVALID_LANG`

**Invalid lang attribute** (NOTICE)

<html lang> is missing or not a valid BCP-47 tag. Search engines and screen readers cannot determine the page language.

**Fix:** Set a valid lang attribute on the <html> element (for example, lang="en" or lang="en-US").

## Robots.txt

### `ROBOTS_TXT_INACCESSIBLE`

**robots.txt inaccessible** (ERROR)

robots.txt could not be fetched. Crawlers may treat the entire site as disallowed.

**Fix:** Make /robots.txt return a 200. If you have no rules, serve an empty allow-all file.

## Security

### `HTTPS_CSS_TO_HTTP`

**HTTPS page loads HTTP CSS** (ERROR)

Stylesheet loaded over HTTP from an HTTPS page. Browsers block it as mixed content.

**Fix:** Update the stylesheet URL to https:// or self-host the file.

### `HTTPS_JS_TO_HTTP`

**HTTPS page loads HTTP JS** (ERROR)

Script loaded over HTTP from an HTTPS page. Blocked as mixed content; the page may break.

**Fix:** Update the script URL to https:// or self-host it.

### `HTTPS_IMG_TO_HTTP`

**HTTPS page loads HTTP image** (WARNING)

Image loaded over HTTP from an HTTPS page. Causes mixed-content warnings.

**Fix:** Update the image URL to https:// or move the asset to your CDN.

### `HTTPS_LINKS_TO_HTTP`

**HTTPS page links to HTTP** (WARNING)

An HTTPS page contains a plain HTTP link. Triggers mixed-content warnings on click-through.

**Fix:** Update the link to https://. Verify the destination supports HTTPS.

### `HTTP_LINKS_TO_HTTPS`

**HTTP page links to HTTPS** (NOTICE)

An HTTP page links to HTTPS. Usually fine, but suggests the page itself should also be HTTPS.

**Fix:** Migrate the source page to HTTPS to keep the whole journey secure.
