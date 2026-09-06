# Checks used by `seo-audit`

143 checks. Generated from the Wrendex check catalog
(`GET https://app.wrendex.com/api/catalog`) - do not edit by hand.

Filter a crawl to one of these with
`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>`, or to a whole category
with `?category=<Category>`.

## AMP

### `AMP_VALIDATION_ERRORS`

**AMP validation errors** (WARNING)

The AMP variant has validation errors and is ineligible for AMP-specific surfaces.

**Fix:** Run the AMP validator and fix the reported errors.

### `AMP_CANONICAL_MISMATCH`

**AMP canonical mismatch** (NOTICE)

The AMP page and its canonical disagree on the canonical URL.

**Fix:** Set the AMP page's canonical to the non-AMP URL and vice versa using <link rel="amphtml">.

### `AMP_EXCESSIVE_CSS`

**AMP excessive CSS** (NOTICE)

The AMP page exceeds the CSS budget allowed by the AMP spec.

**Fix:** Trim unused CSS rules and inline only what AMP needs.

## Billing

### `OUT_OF_CREDITS`

**Crawl stopped: out of credits** (ERROR)

This crawl was aborted because the tenant ran out of credits before all pages could be fetched. Already-crawled pages are persisted; the report is partial.

**Fix:** Top up your credit balance or enable auto-top-up under Billing, then re-run the crawl.

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

## Content

### `LOW_WORD_COUNT`

**Thin content** (NOTICE)

The page has very few words. Thin content rarely ranks and may be classified as low quality.

**Fix:** Add substantive copy that covers the topic in depth, or noindex / consolidate the page if it is a thin utility view.

## Cross-Crawl Changes

### `BECAME_NON_INDEXABLE`

**Page became non-indexable** (WARNING)

A previously indexable page is now blocked from indexing.

**Fix:** If indexing should continue, remove the noindex directive. Otherwise document the change.

### `REDIRECT_TARGET_CHANGED`

**Redirect target changed** (WARNING)

A redirect now points at a different URL than in the previous crawl.

**Fix:** Confirm the new target is correct. Update internal links to match.

### `H1_CHANGED`

**H1 changed** (NOTICE)

The H1 changed since the previous crawl.

**Fix:** Verify the new heading matches the intended page topic.

### `META_DESCRIPTION_CHANGED`

**Meta description changed** (NOTICE)

The meta description changed since the previous crawl.

**Fix:** Verify the new copy is intentional. Roll back if the change was accidental.

### `TITLE_CHANGED`

**Title changed** (NOTICE)

The page title changed since the previous crawl.

**Fix:** Confirm the change is intentional. If not, restore the previous title or update sources of truth.

### `WORD_COUNT_CHANGED`

**Word count changed** (NOTICE)

The page word count moved meaningfully between crawls.

**Fix:** Check whether content was added or removed deliberately. Investigate template / data regressions if not.

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

## Duplicates

### `IDENTICAL_CONTENT`

**Identical content** (WARNING)

Two or more pages serve identical body content.

**Fix:** Consolidate to a single canonical URL via 301 or canonical tag, or differentiate the content meaningfully.

## External Links

### `EXTERNAL_LINK_4XX`

**External link broken (4xx)** (WARNING)

An outbound external link returns a 4xx error.

**Fix:** Replace with a working URL, link to an archive copy, or remove the link.

### `EXTERNAL_LINK_5XX`

**External link 5xx** (WARNING)

An outbound external link returned a 5xx error.

**Fix:** Recheck after the destination's outage. Replace if persistently down.

### `EXTERNAL_LINK_5XX_REDIRECT`

**External redirect to 5xx** (WARNING)

The external link redirects to a server-error response.

**Fix:** Replace with a working destination or remove the link.

### `EXTERNAL_LINK_3XX`

**External link redirects** (NOTICE)

An outbound external link redirects, costing user time.

**Fix:** Update the link to the final destination URL.

### `EXTERNAL_LINK_BLOCKED`

**External link blocked** (NOTICE)

The external host blocked our crawler. Could be intentional bot blocking.

**Fix:** Verify the link in a browser. If permanently blocked, consider replacing it.

### `EXTERNAL_LINK_TIMEOUT`

**External link timeout** (NOTICE)

The external link timed out during the crawl.

**Fix:** Verify in a browser. Replace if the destination is reliably slow or unreachable.

## Headings

### `H1_MISSING`

**H1 missing** (WARNING)

The page has no H1. Crawlers and screen readers rely on it as the primary topic signal.

**Fix:** Add a single H1 that names the page topic clearly. Place it above the main content.

### `DUPLICATE_H1`

**Duplicate H1 across pages** (NOTICE)

Multiple pages share the same H1, suggesting overlapping topics or templating gaps.

**Fix:** Make each page's H1 specific to its topic. Audit templates that interpolate the same string.

### `H1_MULTIPLE`

**Multiple H1 tags** (NOTICE)

More than one H1 dilutes the primary topic signal and confuses screen readers.

**Fix:** Keep one H1 per page. Demote the rest to H2 or H3 to reflect the real document outline.

## Hreflang

### `HREFLANG_POINTS_TO_BROKEN`

**hreflang target broken** (ERROR)

An hreflang entry points at a 4xx / 5xx URL.

**Fix:** Update the hreflang URL to a live, localised page. Restore the broken target if it should exist.

### `HREFLANG_MISSING_RECIPROCAL`

**Missing reciprocal hreflang** (WARNING)

Page A links to page B via hreflang, but B does not link back. Without reciprocity, the cluster is ignored.

**Fix:** Add the reciprocal hreflang entry on the localised page so each locale references all the others.

### `INVALID_HREFLANG`

**Invalid hreflang code** (WARNING)

An hreflang attribute has an invalid language / region code.

**Fix:** Use a valid ISO 639-1 language code, optionally with an ISO 3166-1 region (for example, en-GB).

### `HREFLANG_LANG_MISMATCH`

**hreflang language mismatch** (NOTICE)

The hreflang language does not match the actual page language.

**Fix:** Align <html lang> and the hreflang tag, or repoint hreflang at the right localised URL.

### `HREFLANG_MISSING_SELF_REF`

**Missing self-referential hreflang** (NOTICE)

An hreflang cluster must include a self-reference for each locale. This page omits its own.

**Fix:** Add an hreflang entry that points at this page with its own locale code.

### `HREFLANG_MISSING_X_DEFAULT`

**Missing x-default hreflang** (NOTICE)

No x-default fallback is defined for users whose locale does not match any listed variant.

**Fix:** Add an hreflang="x-default" entry pointing at the locale chooser or generic page.

### `HREFLANG_MULTI_LANG_SINGLE_PAGE`

**Multiple languages on one page** (NOTICE)

The page declares hreflang for multiple language codes pointing at itself.

**Fix:** Use one canonical locale per page. Move secondary locales to dedicated URLs.

### `HREFLANG_MULTI_PAGE_SINGLE_LANG`

**One language across many pages** (NOTICE)

Several pages claim to be the canonical for the same language code.

**Fix:** Pick one canonical URL per locale. Update the others to point at it via hreflang and canonical.

### `HREFLANG_POINTS_TO_NON_CANONICAL`

**hreflang target non-canonical** (NOTICE)

An hreflang entry points at a URL whose canonical is something else.

**Fix:** Always point hreflang at the canonical URL of each locale.

### `HREFLANG_POINTS_TO_REDIRECT`

**hreflang target redirects** (NOTICE)

An hreflang entry redirects to another URL. Search engines may discount it.

**Fix:** Repoint the hreflang at the final URL directly.

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

## Internal Links

### `LINKS_TO_BROKEN`

**Links to broken page** (ERROR)

This page links to a 4xx / 5xx URL on the site. Users hit dead ends and equity is wasted.

**Fix:** Update the link to a working URL or remove it. Restore or redirect the broken target if it should still exist.

### `LINKS_TO_BROKEN_NON_INDEXABLE`

**Links to broken non-indexable** (WARNING)

The link target is both broken and non-indexable, so neither users nor crawlers can use it.

**Fix:** Replace with a live, indexable link or remove the reference entirely.

### `LINKS_TO_REDIRECT_NON_INDEXABLE`

**Links to non-indexable redirect** (WARNING)

The link redirects to a URL the crawler cannot index. Equity is lost.

**Fix:** Point the link directly at an indexable destination, or fix the noindex / robots block on the redirect target.

### `NOFOLLOW_ONLY_INCOMING`

**Only nofollow incoming links** (WARNING)

Every internal link to this page is nofollow. Search engines do not pass authority through.

**Fix:** Promote at least one canonical incoming link to dofollow so the page can rank.

### `ORPHAN_PAGE`

**Orphan page** (WARNING)

No internal page links here. Search engines reach it only via the sitemap, with weak ranking signals.

**Fix:** Link the page from a related hub or category page so crawlers can discover and value it.

### `DOUBLE_SLASH_URL`

**Double-slash in URL** (NOTICE)

The URL contains a doubled slash, often produced by a templating bug, and can split crawl signals.

**Fix:** Fix the link template that emits the doubled slash. Add a redirect from the malformed URL to the canonical one.

### `LINKS_TO_REDIRECT_INDEXABLE`

**Links to redirected page** (NOTICE)

The link target redirects to an indexable page. Working but wastes a hop and a little crawl budget.

**Fix:** Update the link to the final URL so users and crawlers skip the redirect.

### `MIXED_FOLLOW_INCOMING`

**Mixed follow / nofollow incoming** (NOTICE)

Internal links to this page mix follow and nofollow, which is usually a templating accident.

**Fix:** Audit the link templates and choose a consistent stance. Drop accidental rel=nofollow.

### `NO_OUTGOING_LINKS`

**No outgoing internal links** (NOTICE)

The page links to nothing else on the site. Crawlers cannot use it as a hub.

**Fix:** Add contextual links to related pages. Even a footer / nav block helps if the page must stand alone.

### `NOFOLLOW_OUTGOING_INTERNAL`

**Nofollow on internal link** (NOTICE)

An internal link is marked rel=nofollow, blocking authority flow on your own site.

**Fix:** Remove rel=nofollow from internal links. Reserve it for genuine UGC or paid placements.

### `REDIRECT_NO_INCOMING`

**Redirect with no incoming** (NOTICE)

A redirect endpoint with no inbound internal links is dead weight in the link graph.

**Fix:** Remove the redirect if no link references it, or add the inbound link the redirect was meant to support.

### `SINGLE_DOFOLLOW_INCOMING`

**Only one dofollow incoming** (NOTICE)

Just one internal page passes equity here. Single points of failure for crawl and rank.

**Fix:** Add more contextual links from related pages so the destination has redundant discovery paths.

### `TOO_MANY_URL_PARAMS`

**Too many URL parameters** (NOTICE)

The URL stacks many query parameters, which can fragment crawl coverage and confuse canonicalisation.

**Fix:** Consolidate parameters via canonical URLs or rewrite to clean paths where possible.

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

## Markup

### `MISSING_VIEWPORT`

**Missing viewport meta** (WARNING)

No <meta name="viewport"> tag. Mobile rendering will be broken and Google flags the page as non-mobile-friendly.

**Fix:** Add <meta name="viewport" content="width=device-width, initial-scale=1"> in the <head>.

### `INVALID_LANG`

**Invalid lang attribute** (NOTICE)

<html lang> is missing or not a valid BCP-47 tag. Search engines and screen readers cannot determine the page language.

**Fix:** Set a valid lang attribute on the <html> element (for example, lang="en" or lang="en-US").

## Meta Description

### `META_DESCRIPTION_MISSING`

**Meta description missing** (WARNING)

Without a meta description, search engines auto-generate a snippet, which is rarely flattering for click-through.

**Fix:** Add a 120 to 160 character <meta name="description"> that summarises the page and nudges the click.

### `META_DESCRIPTION_MULTIPLE`

**Multiple meta descriptions** (WARNING)

More than one meta description tag is present; crawlers pick one unpredictably.

**Fix:** Keep exactly one <meta name="description"> per page in the <head>.

### `DUPLICATE_META_DESCRIPTION`

**Duplicate meta description** (NOTICE)

Multiple pages share the same meta description, weakening relevance signals.

**Fix:** Write a distinct meta description for each page that highlights what is unique about it.

### `META_DESCRIPTION_TOO_LONG`

**Meta description too long** (NOTICE)

Descriptions wider than what Google shows (~985px on desktop) get truncated in SERP snippets, losing your final call to action. Truncation depends on the rendered width of the characters, not just their count.

**Fix:** Trim to 120 to 160 characters. Lead with the value proposition.

### `META_DESCRIPTION_TOO_SHORT`

**Meta description too short** (NOTICE)

Very short descriptions waste prime SERP real estate and miss keywords.

**Fix:** Expand to 120 to 160 characters with specific, page-relevant copy.

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

## Redirects

### `BROKEN_REDIRECT`

**Broken redirect** (ERROR)

The redirect target is a 4xx / 5xx response. Users land on an error.

**Fix:** Repoint the redirect at a live URL. Remove the rule entirely if no working destination exists.

### `HTTPS_TO_HTTP_REDIRECT`

**HTTPS redirects to HTTP** (ERROR)

An HTTPS URL redirects to HTTP. This is a security and SEO regression.

**Fix:** Repoint the redirect at the HTTPS variant. Audit your redirect rules for accidental scheme downgrades.

### `REDIRECT_LOOP`

**Redirect loop** (ERROR)

The redirect chain points back to itself. Browsers and crawlers give up.

**Fix:** Find the rule that creates the cycle and remove or repoint it.

### `TIMEOUT`

**Request timed out** (ERROR)

The crawl request timed out. The URL is effectively unreachable for crawlers and slow users.

**Fix:** Investigate origin latency. Add caching, retries, and monitoring on the slow endpoint.

### `META_REFRESH_REDIRECT`

**Meta refresh redirect** (WARNING)

The page uses a <meta http-equiv="refresh"> tag. Crawlers may treat it as a soft 200 instead of a redirect.

**Fix:** Use a server-side 301 / 302 redirect instead of meta refresh.

### `REDIRECT_CHAIN_TOO_LONG`

**Redirect chain too long** (WARNING)

The redirect chain has too many hops. Some crawlers stop following before the destination.

**Fix:** Collapse the chain so the original URL hops directly to the final URL.

### `HTTP_TO_HTTPS_REDIRECT`

**HTTP to HTTPS redirect** (NOTICE)

An HTTP URL redirects to HTTPS. Expected, but every internal link should target HTTPS directly to skip the hop.

**Fix:** Update internal links to use https:// so users and crawlers skip the redirect.

### `REDIRECT_302`

**302 temporary redirect** (NOTICE)

The URL serves a 302. Crawlers may keep crawling the source if they expect it to come back.

**Fix:** If the redirect is permanent, switch to 301 so authority transfers fully.

### `REDIRECT_3XX`

**3xx redirect** (NOTICE)

The URL returns a non-301/302 redirect status. Browsers follow it but crawlers handle it inconsistently.

**Fix:** Replace with a 301 (permanent) where appropriate.

### `REDIRECT_CHAIN`

**Redirect chain** (NOTICE)

More than one redirect hop before the final URL. Wastes crawl budget and slows users.

**Fix:** Update the first hop to point directly at the final URL.

## Render-Blocking

### `RENDER_BLOCKING_CSS`

**Render-blocking CSS** (WARNING)

A stylesheet blocks first paint. Hurts Largest Contentful Paint and perceived speed.

**Fix:** Inline critical CSS for above-the-fold content and load the rest with media queries or async strategies.

### `RENDER_BLOCKING_JS`

**Render-blocking JS** (WARNING)

A script in the <head> blocks rendering until parsed and executed.

**Fix:** Move scripts to the end of the body or add async / defer. Trim non-critical scripts entirely.

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

## Social

### `MISSING_OG_TAGS`

**Missing Open Graph tags** (NOTICE)

The page is missing og:title / og:description / og:image. Social shares fall back to ugly auto-snippets.

**Fix:** Add og:title, og:description, og:image, and og:url. Reuse the page title and a cropped hero image.

### `MISSING_TWITTER_CARD`

**Missing Twitter Card** (NOTICE)

twitter:card is absent. Twitter / X falls back to a plain link preview.

**Fix:** Add twitter:card (typically summary_large_image) plus twitter:title, twitter:description, twitter:image.

### `OG_CANONICAL_MISMATCH`

**og:url and canonical disagree** (NOTICE)

og:url does not match the canonical URL. Shares may land on the wrong variant.

**Fix:** Set og:url to the canonical URL of the page.

## Structured Data

### `JSON_LD_PARSE_ERROR`

**JSON-LD parse error** (ERROR)

A JSON-LD script block could not be parsed as valid JSON.

**Fix:** Fix the JSON syntax. Validate with a linter before shipping.

### `JSON_LD_INVALID_TYPE`

**JSON-LD invalid @type** (WARNING)

The @type does not exist on schema.org or is misspelled.

**Fix:** Replace with a valid schema.org type that fits the content.

### `JSON_LD_MISSING_TYPE`

**JSON-LD missing @type** (WARNING)

A JSON-LD object has no @type. Search engines cannot interpret it.

**Fix:** Add an @type that names the schema (for example, Article, Product).

### `JSON_LD_DEPRECATED_PROPERTY`

**JSON-LD deprecated property** (NOTICE)

The JSON-LD object uses a property that has been deprecated.

**Fix:** Migrate to the recommended replacement property.

### `JSON_LD_DEPRECATED_TYPE`

**JSON-LD deprecated type** (NOTICE)

The JSON-LD object uses a schema.org type that has been deprecated.

**Fix:** Migrate to the recommended replacement type listed in the schema.org docs.

### `JSON_LD_DUPLICATE_PROPERTY`

**JSON-LD duplicate property** (NOTICE)

The same property is declared more than once on a JSON-LD object.

**Fix:** Remove the duplicate or merge into an array if multiple values are intended.

### `JSON_LD_INVALID_PROPERTY`

**JSON-LD invalid property** (NOTICE)

A property on the JSON-LD object is not defined for the declared @type.

**Fix:** Remove the property or move it to a parent / nested object that allows it.

### `JSON_LD_INVALID_VALUE`

**JSON-LD invalid value** (NOTICE)

A property's value is not in the expected format (for example, malformed URL).

**Fix:** Fix the value to match the expected format.

### `JSON_LD_UNEXPECTED_PROPERTY`

**JSON-LD unexpected property** (NOTICE)

An unrecognised property appeared on a JSON-LD object.

**Fix:** Remove the property or replace with a recognised schema.org one.

### `JSON_LD_UNEXPECTED_PROPERTY_TYPE`

**JSON-LD wrong property type** (NOTICE)

A property's value type does not match the schema.org expected type (for example, string instead of Date).

**Fix:** Coerce the value to the expected type.

## Structured Data (Google)

### `JSON_LD_GOOGLE_MISSING_IMAGE`

**Google rich result missing image** (WARNING)

Google's rich result for this type requires an image and none was provided.

**Fix:** Add an image property pointing at a high-quality, public image.

### `JSON_LD_GOOGLE_MISSING_ONE_OF_REQUIRED`

**Google rich result missing one-of required** (WARNING)

Google requires at least one of a set of fields and none are present.

**Fix:** Add at least one of the required fields documented for the rich-result type.

### `JSON_LD_GOOGLE_MISSING_REQUIRED`

**Google rich result missing required field** (WARNING)

A field Google requires for the rich result is missing. The page is ineligible until it is added.

**Fix:** Add the required field as listed in Google's rich-result documentation.

### `JSON_LD_GOOGLE_EMPTY_FIELD`

**Google rich result empty field** (NOTICE)

A field that should hold a value is empty.

**Fix:** Populate the field with a meaningful value or remove it if optional.

### `JSON_LD_GOOGLE_INVALID_DATE`

**Google rich result invalid date** (NOTICE)

A date field is not in ISO 8601 format.

**Fix:** Use ISO 8601 (for example, 2026-04-30T12:00:00Z).

### `JSON_LD_GOOGLE_INVALID_VALUE`

**Google rich result invalid value** (NOTICE)

A field's value is outside the format Google expects.

**Fix:** Update the value to match Google's documented format.

### `JSON_LD_GOOGLE_PROPERTY_MISSING_TYPE`

**Google rich result property missing type** (NOTICE)

A nested object that Google expects to be typed has no @type.

**Fix:** Add the expected @type on the nested object.

### `JSON_LD_GOOGLE_UNRECOGNIZED_PROPERTY`

**Google rich result unrecognised property** (NOTICE)

A property is not recognised by Google for this rich-result type.

**Fix:** Remove the property or replace with a documented one.

### `JSON_LD_GOOGLE_UNRESOLVED_ID`

**Google rich result unresolved @id** (NOTICE)

An @id reference does not match any object on the page.

**Fix:** Add the referenced object or fix the @id to point at an existing one.

## Title

### `TITLE_MISSING`

**Page title missing** (ERROR)

The page has no <title> tag. Search engines fall back to the URL or a fragment of body text, which hurts click-through.

**Fix:** Add a unique, descriptive <title> in the <head>. Aim for 50 to 60 characters that match the page intent.

### `DUPLICATE_TITLE`

**Duplicate title across pages** (WARNING)

Two or more pages share the same title, making them compete in search results.

**Fix:** Give each page a unique title that reflects its specific content. Use templates with page-specific variables.

### `TITLE_MULTIPLE`

**Multiple title tags** (WARNING)

More than one <title> tag was found. Browsers and crawlers pick one inconsistently.

**Fix:** Keep exactly one <title> tag in the <head>. Remove the duplicates from templates and partials.

### `TITLE_TOO_LONG`

**Title too long** (WARNING)

Titles wider than what Google shows (~580px on desktop) are truncated in search results, hiding the part that converts. Truncation depends on the rendered width of the characters, not just their count.

**Fix:** Trim the title to 50 to 60 characters and front-load the most important keywords.

### `TITLE_TOO_SHORT`

**Title too short** (NOTICE)

Very short titles miss ranking-relevant keywords and look thin in SERP listings.

**Fix:** Expand the title to 30 to 60 characters with descriptive, specific wording about the page topic.
