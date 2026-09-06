# Checks used by `sitemap-audit`

10 checks. Generated from the Wrendex check catalog
(`GET https://app.wrendex.com/api/catalog`) - do not edit by hand.

Filter a crawl to one of these with
`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>`, or to a whole category
with `?category=<Category>`.

## Sitemap

### `INVALID_SITEMAP_FORMAT`

**Invalid sitemap format** (ERROR)

The sitemap could not be parsed as valid XML / sitemap protocol.

**Fix:** Validate the sitemap with a linter, fix the malformed entries, and re-upload.

### `SITEMAP_403_FORBIDDEN`

**Sitemap URL forbidden** (ERROR)

A URL in the sitemap returns 403. Search engines cannot index it.

**Fix:** Open the page to crawlers or remove it from the sitemap.

### `SITEMAP_4XX`

**Sitemap URL returns 4xx** (ERROR)

A URL in the sitemap is broken.

**Fix:** Remove the URL from the sitemap or restore the page.

### `SITEMAP_5XX`

**Sitemap URL returns 5xx** (ERROR)

A URL in the sitemap returns a server error.

**Fix:** Investigate the failing endpoint and fix it, or temporarily remove the URL from the sitemap.

### `SITEMAP_NOINDEX`

**Sitemap URL is noindex** (WARNING)

A URL in the sitemap is marked noindex. The two signals contradict each other.

**Fix:** Remove the URL from the sitemap or remove the noindex directive.

### `SITEMAP_TIMEOUT`

**Sitemap URL timed out** (WARNING)

A URL in the sitemap timed out during the crawl.

**Fix:** Investigate the slow endpoint or remove the URL until performance is restored.

### `DUPLICATE_IN_SITEMAPS`

**Duplicate URL in sitemaps** (NOTICE)

The same URL appears in more than one sitemap or more than once in the same sitemap.

**Fix:** Deduplicate the sitemap entries.

### `MISSING_FROM_SITEMAP`

**URL missing from sitemap** (NOTICE)

A linked, indexable URL is not present in any sitemap.

**Fix:** Add the URL to the sitemap or fix the sitemap generator that excluded it.

### `SITEMAP_3XX_REDIRECT`

**Sitemap URL redirects** (NOTICE)

A URL listed in the sitemap redirects.

**Fix:** Update the sitemap to list the final URL.

### `SITEMAP_NON_CANONICAL`

**Sitemap URL non-canonical** (NOTICE)

A URL in the sitemap is not the canonical version of its page.

**Fix:** Replace with the canonical URL.
