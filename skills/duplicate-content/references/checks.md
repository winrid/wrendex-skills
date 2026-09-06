# Checks used by `duplicate-content`

7 checks. Generated from the Wrendex check catalog
(`GET https://app.wrendex.com/api/catalog`) - do not edit by hand.

Filter a crawl to one of these with
`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>`, or to a whole category
with `?category=<Category>`.

## Canonical

### `DUPLICATES_NO_CANONICAL`

**Duplicates without canonical** (WARNING)

Multiple pages share the same content but none declare a canonical.

**Fix:** Add a canonical tag on each duplicate pointing at the preferred URL.

### `NON_CANONICAL_AS_CANONICAL`

**Non-canonical declared as canonical** (WARNING)

The page sets itself as canonical but other pages declare a different canonical for the same content.

**Fix:** Pick one URL as the canonical for the cluster and update every page to agree.

## Content

### `LOW_WORD_COUNT`

**Thin content** (NOTICE)

The page has very few words. Thin content rarely ranks and may be classified as low quality.

**Fix:** Add substantive copy that covers the topic in depth, or noindex / consolidate the page if it is a thin utility view.

## Duplicates

### `IDENTICAL_CONTENT`

**Identical content** (WARNING)

Two or more pages serve identical body content.

**Fix:** Consolidate to a single canonical URL via 301 or canonical tag, or differentiate the content meaningfully.

## Headings

### `DUPLICATE_H1`

**Duplicate H1 across pages** (NOTICE)

Multiple pages share the same H1, suggesting overlapping topics or templating gaps.

**Fix:** Make each page's H1 specific to its topic. Audit templates that interpolate the same string.

## Meta Description

### `DUPLICATE_META_DESCRIPTION`

**Duplicate meta description** (NOTICE)

Multiple pages share the same meta description, weakening relevance signals.

**Fix:** Write a distinct meta description for each page that highlights what is unique about it.

## Title

### `DUPLICATE_TITLE`

**Duplicate title across pages** (WARNING)

Two or more pages share the same title, making them compete in search results.

**Fix:** Give each page a unique title that reflects its specific content. Use templates with page-specific variables.
