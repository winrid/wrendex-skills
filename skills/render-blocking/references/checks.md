# Checks used by `render-blocking`

10 checks. Generated from the Wrendex check catalog
(`GET https://app.wrendex.com/api/catalog`) - do not edit by hand.

Filter a crawl to one of these with
`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>`, or to a whole category
with `?category=<Category>`.

## CSS

### `BROKEN_CSS`

**Broken stylesheet** (ERROR)

A linked stylesheet returns an error response. The page renders without its styles.

**Fix:** Fix the stylesheet URL or restore the missing file.

### `OVERSIZED_CSS`

**Oversized stylesheet** (WARNING)

A stylesheet is unusually large, slowing page render.

**Fix:** Split the stylesheet, drop unused rules, and consider per-route CSS chunks.

### `REDIRECTED_CSS`

**Stylesheet redirects** (NOTICE)

A linked stylesheet URL redirects, costing an extra round-trip.

**Fix:** Update the link tag to the final stylesheet URL.

## Duplicate Code

### `DUPLICATE_CSS_CODE`

**Duplicate CSS** (NOTICE)

Multiple stylesheets ship the same rules, inflating CSS payload.

**Fix:** Consolidate shared rules into a single stylesheet and trim duplicates from per-page CSS.

### `DUPLICATE_JS_CODE`

**Duplicate JavaScript** (NOTICE)

Multiple script bundles ship the same code, wasting bandwidth and parsing time.

**Fix:** Deduplicate via a shared chunk, externalise common dependencies, or audit your bundler split-chunks config.

## JS

### `BROKEN_JS`

**Broken script** (ERROR)

A linked script returns an error. The page may behave incorrectly.

**Fix:** Fix the script URL or restore the missing file.

### `OVERSIZED_JS`

**Oversized script** (WARNING)

A script bundle is unusually large, hurting time-to-interactive.

**Fix:** Code-split, lazy-load non-critical bundles, and tree-shake aggressively.

### `REDIRECTED_JS`

**Script redirects** (NOTICE)

A script URL redirects, adding a round-trip on every page load.

**Fix:** Update the script tag to the final URL.

## Render-Blocking

### `RENDER_BLOCKING_CSS`

**Render-blocking CSS** (WARNING)

A stylesheet blocks first paint. Hurts Largest Contentful Paint and perceived speed.

**Fix:** Inline critical CSS for above-the-fold content and load the rest with media queries or async strategies.

### `RENDER_BLOCKING_JS`

**Render-blocking JS** (WARNING)

A script in the <head> blocks rendering until parsed and executed.

**Fix:** Move scripts to the end of the body or add async / defer. Trim non-critical scripts entirely.
