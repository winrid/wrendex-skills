// The skill set, and the only file to edit when adding one.
//
// `slug` is the discovery surface. skills.sh search matches hardest on the
// owner/repo/skill slug and orders matches by install count, so each slug is a
// phrase people actually type ("broken links", "core web vitals") rather than a
// product name. Wrendex is what runs underneath; it is not what the skill is
// called.
//
// `categories` and `types` resolve against data/check-catalog.json (the same
// payload GET /api/catalog serves) into the focus set the skill filters to.

export const SKILLS = [
  {
    slug: 'seo-audit',
    title: 'SEO Audit',
    // Umbrella skill: no focus filter, every check in the catalog.
    categories: '*',
    summary:
      'Crawl a whole site and come back with a ranked list of what to fix, worst reach first.',
    description:
      'Run a full technical SEO audit of a site and get a ranked, per-URL list of what to fix. '
      + 'Use when the user says "audit my site", "run an SEO audit", "check my SEO", '
      + '"why is my site not ranking", "find SEO problems", or wants a health check before a launch or migration.',
    triggers: [
      '"run an SEO audit on example.com"',
      '"what SEO issues does my site have?"',
      '"check my site before we launch"',
      '"why is my site not ranking?"',
    ],
    guidance: [
      'Start here when the request is open-ended. The narrower skills in this repo '
        + '(broken-links, canonical-tags, sitemap-audit, ...) share the same crawl, so if a '
        + 'crawl already ran you can pass its crawlId straight to those instead of re-crawling.',
      'Fix in reach order. The output is sorted by pageCount, and one item with '
        + 'pageCount: 400 is worth more than forty items with pageCount: 1.',
    ],
  },
  {
    slug: 'technical-seo',
    title: 'Technical SEO',
    categories: ['Indexability', 'HTTP Status', 'Markup', 'Robots.txt', 'Content', 'Security'],
    summary:
      'The crawlability and indexability layer: noindex, status codes, robots.txt, mixed content, viewport.',
    description:
      'Audit the technical SEO of a site: crawlability, indexability, noindex/nofollow conflicts, '
      + 'HTTP status codes, robots.txt, mixed content and viewport tags. Use when the user says '
      + '"technical SEO", "is my site crawlable", "Google is not indexing my pages", '
      + '"pages missing from search", or "technical audit".',
    triggers: [
      '"do a technical SEO audit"',
      '"Google is not indexing some of my pages"',
      '"is my site crawlable?"',
      '"why are pages missing from search results?"',
    ],
    guidance: [
      'NOINDEX_PAGE is not automatically a bug. Staging routes, thank-you pages and paginated '
        + 'archives are often noindex on purpose. Check with the user before removing one.',
      'NOINDEX_CONFLICT and NOFOLLOW_CONFLICT mean the meta tag and the X-Robots-Tag header '
        + 'disagree. Fix the source of truth, not whichever one is easier to reach.',
    ],
  },
  {
    slug: 'broken-links',
    title: 'Broken Links',
    categories: ['Internal Links', 'External Links', 'HTTP Status'],
    summary: 'Find dead internal and external links, 404s, and links that point at redirects.',
    description:
      'Find and fix broken links, 404s, dead external URLs and links pointing at redirects across a site. '
      + 'Use when the user says "check for broken links", "find 404s", "my links are dead", '
      + '"link audit", "link rot", or is cleaning up internal linking before a launch.',
    triggers: [
      '"check my site for broken links"',
      '"find 404s on example.com"',
      '"are any of my outbound links dead?"',
      '"clean up internal linking"',
    ],
    guidance: [
      'One dead URL linked from 400 pages is ONE item with pageCount: 400, not 400 findings. '
        + 'Fix the link target once, in the template or partial that emits it.',
      'EXTERNAL_LINK_TIMEOUT and EXTERNAL_LINK_BLOCKED are often the remote site rate-limiting '
        + 'the crawler, not a dead link. Verify one by hand before mass-editing.',
      'LINKS_TO_REDIRECT_INDEXABLE is a cheap win: point the link at the final URL and drop a '
        + 'hop for every crawler and visitor.',
    ],
  },
  {
    slug: 'duplicate-content',
    title: 'Duplicate Content',
    types: [
      'IDENTICAL_CONTENT',
      'DUPLICATES_NO_CANONICAL',
      'DUPLICATE_TITLE',
      'DUPLICATE_META_DESCRIPTION',
      'DUPLICATE_H1',
      'NON_CANONICAL_AS_CANONICAL',
      'LOW_WORD_COUNT',
    ],
    summary:
      'Find pages competing with each other: identical bodies, repeated titles, thin content.',
    description:
      'Find duplicate content across a site: identical page bodies, repeated titles and meta descriptions, '
      + 'duplicate H1s and thin pages, plus the missing canonicals behind them. Use when the user says '
      + '"duplicate content", "duplicate titles", "my pages are competing", "thin content", or '
      + '"canonicalization issues".',
    triggers: [
      '"do I have duplicate content?"',
      '"find duplicate titles across my site"',
      '"my pages are cannibalizing each other"',
      '"check for thin content"',
    ],
    guidance: [
      'IDENTICAL_CONTENT plus DUPLICATES_NO_CANONICAL is the pairing that matters: duplicates are '
        + 'fine when one of them is canonical. Add the canonical before rewriting any copy.',
      'Faceted and paginated URLs are the usual source. Look for a query-parameter pattern in the '
        + 'affected URLs before treating each page as a separate authoring problem.',
    ],
  },
  {
    slug: 'canonical-tags',
    title: 'Canonical Tags',
    categories: ['Canonical'],
    summary: 'Audit rel=canonical: self-reference, redirect targets, protocol mismatches, orphans.',
    description:
      'Audit rel=canonical tags across a site: canonicals pointing at redirects, 404s or non-indexable pages, '
      + 'http/https mismatches, and pages canonicalized away with no incoming links. Use when the user says '
      + '"canonical tags", "canonicalization", "rel=canonical", "wrong canonical URL", or '
      + '"which version of this page does Google index".',
    triggers: [
      '"check my canonical tags"',
      '"my canonicals point to the wrong URL"',
      '"fix canonicalization on example.com"',
    ],
    guidance: [
      'CANONICAL_POINTS_TO_REDIRECT wastes the signal entirely: the canonical should name the '
        + 'final 200 URL, never a hop.',
      'CANONICAL_HTTP_TO_HTTPS and its mirror usually mean the canonical is built from a hardcoded '
        + 'origin somewhere in a template. Fix the template, not the pages.',
    ],
  },
  {
    slug: 'sitemap-audit',
    title: 'Sitemap Audit',
    categories: ['Sitemap'],
    summary: 'Check XML sitemaps against what the crawler actually found.',
    description:
      'Audit XML sitemaps: URLs that 404 or redirect, noindex or non-canonical entries, pages missing '
      + 'from the sitemap entirely, duplicates across sitemap files, and malformed XML. Use when the user says '
      + '"check my sitemap", "sitemap.xml", "sitemap errors in Search Console", or "my sitemap is out of date".',
    triggers: [
      '"check my sitemap"',
      '"Search Console says my sitemap has errors"',
      '"is my sitemap up to date?"',
    ],
    guidance: [
      'MISSING_FROM_SITEMAP is measured against what the crawl reached, so it is only meaningful '
        + 'on a crawl that finished. Check the run status before acting on it.',
      'SITEMAP_NOINDEX and SITEMAP_NON_CANONICAL are contradictions the site is telling Google: '
        + 'the sitemap says "index this", the page says "do not". Decide which one is right.',
    ],
  },
  {
    slug: 'robots-txt',
    title: 'robots.txt',
    categories: ['Robots.txt', 'Indexability'],
    summary: 'Check robots.txt reachability and the noindex/nofollow directives around it.',
    description:
      'Check robots.txt and the indexing directives around it: an unreachable robots.txt, noindex and '
      + 'nofollow pages, and conflicting meta-tag versus header signals. Use when the user says '
      + '"robots.txt", "am I blocking Google", "noindex", "nofollow", or "my pages are excluded from search".',
    triggers: [
      '"check my robots.txt"',
      '"am I accidentally blocking Google?"',
      '"which pages are noindex?"',
    ],
    guidance: [
      'ROBOTS_TXT_INACCESSIBLE is an ERROR because a 5xx on robots.txt makes well-behaved crawlers '
        + 'back off the whole site. A 404 is fine; a timeout is not.',
      'Read the noindex findings as an inventory, not a defect list. The useful question for the '
        + 'user is which of these they intended.',
    ],
  },
  {
    slug: 'render-blocking',
    title: 'Render-Blocking Resources',
    categories: ['Render-Blocking', 'CSS', 'JS', 'Duplicate Code'],
    summary:
      'Find render-blocking CSS and JS, oversized bundles, and code duplicated across bundles.',
    description:
      'Find render-blocking CSS and JavaScript, oversized or broken bundles, and code duplicated across '
      + 'bundles that ships to the browser twice. Use when the user says "render-blocking", '
      + '"my site loads slowly", "too much JavaScript", "duplicate scripts", "duplicate trackers", or '
      + '"reduce bundle size".',
    triggers: [
      '"why does my site render so slowly?"',
      '"find render-blocking resources"',
      '"am I loading the same script twice?"',
      '"my bundles are too big"',
    ],
    guidance: [
      'DUPLICATE_JS_CODE is the check most other tools do not have: it compares the actual bytes '
        + 'across bundles, so it catches the same library or tracker shipped twice under two '
        + 'filenames. Use get_duplicate_code_regions (GET /api/alerts/{alertId}/duplicate-regions) '
        + 'for the exact regions.',
      'Two tag managers, or a tag manager plus a hardcoded snippet, is the usual cause of a '
        + 'duplicated tracker. Check the HTML head before touching the build config.',
    ],
  },
  {
    slug: 'core-web-vitals',
    title: 'Core Web Vitals',
    categories: ['Performance', 'Images'],
    summary: 'Server-side vitals: TTFB, compression, page weight, and the images driving LCP and CLS.',
    description:
      'Audit the page-weight and server-response side of Core Web Vitals: slow TTFB, missing compression, '
      + 'oversized HTML, and the oversized or undimensioned images behind poor LCP and CLS. Use when the '
      + 'user says "core web vitals", "my site is slow", "improve LCP", "layout shift", "TTFB", or '
      + '"PageSpeed score".',
    triggers: [
      '"my site is slow, what should I fix?"',
      '"improve my core web vitals"',
      '"fix layout shift on my pages"',
    ],
    guidance: [
      'These are lab-side causes, not field measurements. Wrendex measures what the server sent; '
        + 'it does not report a CrUX score. Say so rather than implying a vitals number.',
      'MISSING_IMAGE_DIMENSIONS is the cheapest CLS fix there is: width and height attributes on '
        + 'the img tag, no layout change.',
      'NO_COMPRESSION is usually one line of server or CDN config and affects every page at once. '
        + 'Do it before per-page work.',
    ],
  },
  {
    slug: 'structured-data',
    title: 'Structured Data',
    categories: ['Structured Data', 'Structured Data (Google)'],
    summary: 'Validate JSON-LD against schema.org and against what Google actually requires.',
    description:
      'Validate JSON-LD structured data across a site against schema.org and against Google rich-result '
      + 'requirements: parse errors, invalid or deprecated types and properties, missing required fields, '
      + 'unresolved @id references and bad dates. Use when the user says "structured data", "schema markup", '
      + '"JSON-LD", "rich results", "rich snippets", or "Search Console structured data errors".',
    triggers: [
      '"validate my structured data"',
      '"my rich results stopped showing"',
      '"check my schema markup"',
      '"Search Console is reporting structured data errors"',
    ],
    guidance: [
      'The JSON_LD_GOOGLE_* checks are the ones that gate rich results. A page can be valid '
        + 'schema.org and still lose its rich result by missing a Google-required field, so fix '
        + 'those first.',
      'Structured data is nearly always template-generated. Group the findings by template before '
        + 'editing anything: one fix usually clears hundreds of pages.',
    ],
  },
];
