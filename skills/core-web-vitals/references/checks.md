# Checks used by `core-web-vitals`

9 checks. Generated from the Wrendex check catalog
(`GET https://app.wrendex.com/api/catalog`) - do not edit by hand.

Filter a crawl to one of these with
`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>`, or to a whole category
with `?category=<Category>`.

## Images

### `BROKEN_IMAGE`

**Broken image** (ERROR)

The image URL returns an error. Users see a placeholder, search engines drop it from image results.

**Fix:** Fix the image URL or upload the missing asset. Add monitoring on critical images.

### `MISSING_ALT_TEXT`

**Missing alt text** (WARNING)

An image has no alt attribute. Screen readers and image search cannot describe it.

**Fix:** Add descriptive alt text. Use alt="" only for purely decorative images.

### `OVERSIZED_IMAGE`

**Oversized image** (WARNING)

The image file is much larger than its rendered size, slowing the page.

**Fix:** Serve right-sized variants via srcset, compress losslessly, and prefer modern formats (AVIF / WebP).

### `IMAGE_REDIRECT`

**Image URL redirects** (NOTICE)

The image src redirects, costing an extra round-trip on every load.

**Fix:** Update the markup to the final URL so the browser fetches the asset directly.

### `MISSING_IMAGE_DIMENSIONS`

**Missing image dimensions** (NOTICE)

The image has no width / height attributes, which causes layout shift (bad CLS).

**Fix:** Add explicit width and height attributes that match the intrinsic image ratio.

## Performance

### `NO_COMPRESSION`

**No HTTP compression** (WARNING)

The response is not gzip / br compressed, wasting bandwidth and slowing time-to-first-byte for clients.

**Fix:** Enable gzip or brotli on the server / CDN for HTML, CSS, JS, and JSON.

### `SLOW_PAGE`

**Slow page response** (WARNING)

Total response time is high. Slow pages cost rankings and conversions.

**Fix:** Profile the page, fix backend hot spots, enable caching, and trim render-blocking resources.

### `SLOW_TTFB`

**Slow time-to-first-byte** (WARNING)

TTFB is high, indicating server or origin latency. This drags every other metric.

**Fix:** Add caching at the CDN and origin, optimise the slowest backend handler, and move static assets to a CDN.

### `OVERSIZED_HTML`

**Oversized HTML** (NOTICE)

The HTML payload is unusually large, slowing parsing and hurting Core Web Vitals.

**Fix:** Strip unused inline data, paginate long lists, and move large markup chunks behind progressive loads.
