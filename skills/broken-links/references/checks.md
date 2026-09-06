# Checks used by `broken-links`

25 checks. Generated from the Wrendex check catalog
(`GET https://app.wrendex.com/api/catalog`) - do not edit by hand.

Filter a crawl to one of these with
`GET /api/crawls/{crawlId}/issue-summary?type=<TYPE>`, or to a whole category
with `?category=<Category>`.

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
