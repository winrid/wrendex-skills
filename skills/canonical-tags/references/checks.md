# Checks used by `canonical-tags`

8 checks. Generated from the Wrendex check catalog
(`GET https://app.wrendex.com/api/catalog`) - do not edit by hand.

Filter a crawl to one of these with
`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>`, or to a whole category
with `?category=<Category>`.

## Canonical

### `CANONICAL_HTTPS_TO_HTTP`

**Canonical https to http** (ERROR)

The page is HTTPS but the canonical is HTTP. Search engines may demote the page.

**Fix:** Set the canonical to the HTTPS variant.

### `CANONICAL_POINTS_TO_4XX`

**Canonical points to 4xx** (ERROR)

The canonical URL returns a 4xx error. The page has no valid canonical.

**Fix:** Repoint the canonical at a live URL or remove the canonical tag entirely.

### `CANONICAL_POINTS_TO_5XX`

**Canonical points to 5xx** (ERROR)

The canonical URL returns a 5xx error.

**Fix:** Fix the failing canonical target or repoint at a live URL.

### `CANONICAL_POINTS_TO_REDIRECT`

**Canonical points to redirect** (WARNING)

The canonical URL redirects. Search engines may follow it but the signal is weakened.

**Fix:** Repoint the canonical at the final URL.

### `DUPLICATES_NO_CANONICAL`

**Duplicates without canonical** (WARNING)

Multiple pages share the same content but none declare a canonical.

**Fix:** Add a canonical tag on each duplicate pointing at the preferred URL.

### `NON_CANONICAL_AS_CANONICAL`

**Non-canonical declared as canonical** (WARNING)

The page sets itself as canonical but other pages declare a different canonical for the same content.

**Fix:** Pick one URL as the canonical for the cluster and update every page to agree.

### `CANONICAL_HTTP_TO_HTTPS`

**Canonical http to https** (NOTICE)

The page is HTTP but its canonical is HTTPS. Expected during a migration; should not persist.

**Fix:** Migrate the page to HTTPS so the canonical and the URL agree.

### `CANONICAL_NO_INCOMING_LINKS`

**Canonical has no incoming links** (NOTICE)

The canonical URL is not linked anywhere internally, suggesting the cluster is fragmented.

**Fix:** Add internal links to the canonical version. Verify the rest of the site agrees on which URL is canonical.
