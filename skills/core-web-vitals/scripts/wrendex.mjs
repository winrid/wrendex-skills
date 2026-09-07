#!/usr/bin/env node
// Wrendex agent client. Zero dependencies, Node 18+ (global fetch).
//
// Generated file - do not edit in place. The source of truth is
// templates/wrendex.mjs in the wrendex-skills repo; `npm run build` copies it
// into every skill so each skill directory installs standalone.
//
// Status goes to stderr, machine-readable JSON goes to stdout.
//
//   node scripts/wrendex.mjs preview <url>              anonymous scan, no account
//   node scripts/wrendex.mjs signup [--name <name>]     mint a workspace + token
//   node scripts/wrendex.mjs audit <url> [--wait] [--max-pages N]
//   node scripts/wrendex.mjs status <crawlId>
//   node scripts/wrendex.mjs issues <crawlId> [--all]   ranked fix list
//   node scripts/wrendex.mjs whoami

import { readFileSync, writeFileSync, mkdirSync, existsSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_BASE = 'https://app.wrendex.com';
const CRED_DIR = join(homedir(), '.wrendex');
const CRED_FILE = join(CRED_DIR, 'credentials.json');
const HERE = dirname(fileURLToPath(import.meta.url));

const log = (...a) => process.stderr.write(a.join(' ') + '\n');
const emit = (obj) => process.stdout.write(JSON.stringify(obj, null, 2) + '\n');

class ApiError extends Error {
  constructor(status, code, message, body) {
    super(message);
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

function baseUrl(creds) {
  return process.env.WRENDEX_API_BASE || creds?.apiBaseUrl || DEFAULT_BASE;
}

function loadCreds() {
  if (process.env.WRENDEX_TOKEN) {
    return {
      token: process.env.WRENDEX_TOKEN,
      tenantId: process.env.WRENDEX_TENANT_ID || null,
      apiBaseUrl: process.env.WRENDEX_API_BASE || DEFAULT_BASE,
      source: 'env',
    };
  }
  if (!existsSync(CRED_FILE)) return null;
  try {
    return { ...JSON.parse(readFileSync(CRED_FILE, 'utf8')), source: 'file' };
  } catch {
    return null;
  }
}

function saveCreds(creds) {
  mkdirSync(CRED_DIR, { recursive: true });
  writeFileSync(CRED_FILE, JSON.stringify(creds, null, 2) + '\n', { mode: 0o600 });
  try {
    chmodSync(CRED_FILE, 0o600);
  } catch {
    // Best effort: a filesystem that refuses the mode is not a reason to fail.
  }
  return creds;
}

async function api(path, { method = 'GET', body, token, base } = {}) {
  const url = (base || DEFAULT_BASE).replace(/\/+$/, '') + path;
  const headers = { accept: 'application/json' };
  if (token) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers['content-type'] = 'application/json';

  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  let parsed = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }
  }

  if (!res.ok) {
    const code = parsed?.code || parsed?.error || `HTTP_${res.status}`;
    const msg = parsed?.message || parsed?.title || text.slice(0, 400) || res.statusText;
    throw new ApiError(res.status, code, msg, parsed);
  }
  return parsed;
}

// ---------------------------------------------------------------- commands

async function cmdSignup(args) {
  const existing = loadCreds();
  if (existing && !args.force) {
    log('Already have credentials. Pass --force to mint a second workspace.');
    emit({ ok: true, reused: true, tenantId: existing.tenantId, claimUrl: existing.claimUrl || null });
    return;
  }

  const base = process.env.WRENDEX_API_BASE || DEFAULT_BASE;
  log('Creating a Wrendex workspace (no email, no password)...');

  // READ alone cannot enqueue a crawl, and the server defaults to READ when
  // the body omits scopes, so ask for WRITE explicitly.
  const r = await api('/api/agent/signup', {
    method: 'POST',
    base,
    body: {
      agentName: args.name || 'AI agent',
      tokenName: 'wrendex-skills',
      scopes: ['READ', 'WRITE'],
    },
  });

  const creds = saveCreds({
    token: r.apiToken.token,
    tenantId: r.tenant.id,
    apiBaseUrl: r.apiBaseUrl || base + '/api',
    claimUrl: r.claimUrl,
    claimExpiresAt: r.claimExpiresAt,
    createdAt: new Date().toISOString(),
  });

  log(`Workspace created with ${r.creditBalance ?? 0} credits. `
    + `Token saved to ${CRED_FILE} (mode 0600).`);
  emit({
    ok: true,
    tenantId: creds.tenantId,
    // Welcome credits: one per page fetched, two with JS rendering. Read it
    // rather than assuming a crawl will go through.
    creditBalance: r.creditBalance ?? 0,
    claimUrl: r.claimUrl,
    claimExpiresAt: r.claimExpiresAt,
    mcpEndpoint: r.mcpEndpoint,
    docsUrl: r.docsUrl,
    // The workspace has no human owner until someone opens claimUrl. Show it.
    handToUser: `Open ${r.claimUrl} to take ownership of this workspace. `
      + `Unclaimed workspaces are deleted after 7 days and cannot be funded.`,
  });
}

async function requireCreds() {
  const creds = loadCreds();
  if (creds) return creds;
  throw new ApiError(0, 'NO_CREDENTIALS',
    'No Wrendex credentials. Run: node scripts/wrendex.mjs signup');
}

async function findOrCreateSite(creds, url, maxPages) {
  const base = baseUrl(creds).replace(/\/api$/, '');
  const sites = await api(`/api/tenants/${creds.tenantId}/sites`, { token: creds.token, base });

  const norm = (u) => String(u || '').replace(/\/+$/, '').toLowerCase();
  const hit = (sites || []).find((s) => norm(s.url) === norm(url));
  if (hit) return { site: hit, created: false };

  // An unverified site is capped at Site.UNVERIFIED_MAX_PAGES server-side;
  // asking for more comes back as 409 VERIFICATION_REQUIRED.
  const body = { url };
  if (maxPages) body.maxPages = Number(maxPages);

  const site = await api(`/api/tenants/${creds.tenantId}/sites`, {
    method: 'POST',
    token: creds.token,
    base,
    body,
  });
  return { site, created: true };
}

async function cmdAudit(args) {
  const url = args._[0];
  if (!url) throw new ApiError(0, 'BAD_USAGE', 'Usage: wrendex.mjs audit <url> [--wait]');

  const creds = await requireCreds();
  const base = baseUrl(creds).replace(/\/api$/, '');

  const { site, created } = await findOrCreateSite(creds, url, args['max-pages']);
  log(`${created ? 'Added' : 'Found'} site ${site.url} (${site.id})`);

  let run;
  try {
    run = await api(`/api/sites/${site.id}/crawls`, { method: 'POST', token: creds.token, base });
  } catch (e) {
    // A fresh workspace has a zero credit balance, so this is the expected
    // first-run outcome until someone claims and funds it. Say so precisely
    // rather than surfacing a bare 402.
    if (e.status === 402) {
      emit({
        ok: false,
        code: 'NO_CREDITS',
        siteId: site.id,
        claimUrl: creds.claimUrl || null,
        handToUser: creds.claimUrl
          ? `This workspace is out of crawl credits. Open ${creds.claimUrl} to claim it, `
            + `then add credits to keep auditing.`
          : 'This workspace is out of crawl credits. Claim and fund it, then re-run the audit.',
        alternative: 'For a free scan with no account, run: node scripts/wrendex.mjs preview ' + url,
      });
      process.exitCode = 3;
      return;
    }
    throw e;
  }

  log(`Crawl ${run.id} queued.`);
  if (!args.wait) {
    emit({ ok: true, siteId: site.id, crawlId: run.id, status: run.status });
    return;
  }

  const final = await pollCrawl(creds, run.id, args.timeout || 900);
  emit({ ok: true, siteId: site.id, crawlId: final.id, status: final.status,
    pagesCrawled: final.pagesCrawled, healthScore: final.healthScore,
    errorCount: final.errorCount, warningCount: final.warningCount, noticeCount: final.noticeCount });
}

async function pollCrawl(creds, crawlId, timeoutSeconds) {
  const base = baseUrl(creds).replace(/\/api$/, '');
  const deadline = Date.now() + timeoutSeconds * 1000;
  let delay = 3000;

  for (;;) {
    const run = await api(`/api/crawls/${crawlId}`, { token: creds.token, base });
    if (run.status === 'completed' || run.status === 'failed' || run.status === 'cancelled') {
      return run;
    }
    if (Date.now() > deadline) {
      log(`Still ${run.status} after ${timeoutSeconds}s; returning the in-progress run.`);
      return run;
    }
    log(`  ${run.status}: ${run.pagesCrawled}/${run.pagesDiscovered} pages`);
    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay * 1.5, 15000);
  }
}

async function cmdStatus(args) {
  const crawlId = args._[0];
  if (!crawlId) throw new ApiError(0, 'BAD_USAGE', 'Usage: wrendex.mjs status <crawlId>');
  const creds = await requireCreds();
  const base = baseUrl(creds).replace(/\/api$/, '');
  emit(await api(`/api/crawls/${crawlId}`, { token: creds.token, base }));
}

function loadFocus() {
  const path = join(HERE, '..', 'focus.json');
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

async function cmdIssues(args) {
  const crawlId = args._[0];
  if (!crawlId) throw new ApiError(0, 'BAD_USAGE', 'Usage: wrendex.mjs issues <crawlId>');

  const creds = await requireCreds();
  const base = baseUrl(creds).replace(/\/api$/, '');
  const focus = args.all ? null : loadFocus();
  const limit = Number(args.limit || 40);

  // The API filters by ONE type or ONE category per request, but a skill is
  // scoped to a set of checks. Ask for everything the crawl found, then narrow
  // here against focus.json - one request instead of one per type.
  const items = [];
  let page = 0;
  for (;;) {
    const res = await api(
      `/api/crawls/${crawlId}/issue-summary?page=${page}&size=100`
        + (args.severity ? `&severity=${encodeURIComponent(args.severity)}` : ''),
      { token: creds.token, base },
    );
    items.push(...(res.items || []));
    page += 1;
    if (items.length >= res.total || !res.items?.length || page > 50) break;
  }

  const wanted = focus?.types ? new Set(focus.types) : null;
  const matched = wanted ? items.filter((i) => wanted.has(i.type)) : items;

  // pageCount is reach: one dead URL linked from 400 pages is one item worth
  // 400 pages, not 400 findings. Rank by it.
  matched.sort((a, b) => b.pageCount - a.pageCount);

  emit({
    ok: true,
    crawlId,
    focus: focus?.name || 'all checks',
    totalMatched: matched.length,
    totalInCrawl: items.length,
    issues: matched.slice(0, limit).map((i) => ({
      type: i.type,
      severity: i.severity,
      target: i.target,
      targetIsSubject: i.targetIsSubject,
      message: i.message,
      pageCount: i.pageCount,
      pageUrls: i.pageUrls,
      alertIds: i.alertIds?.slice(0, 5),
    })),
  });
}

async function cmdPreview(args) {
  const url = args._[0];
  if (!url) throw new ApiError(0, 'BAD_USAGE', 'Usage: wrendex.mjs preview <url>');

  const base = process.env.WRENDEX_API_BASE || DEFAULT_BASE;
  log(`Starting an anonymous scan of ${url} (no account needed)...`);

  const start = await api('/api/anonymous-crawls', { method: 'POST', base, body: { url } });
  const token = start.token;
  const deadline = Date.now() + (Number(args.timeout || 600) * 1000);
  let delay = 3000;
  let last = null;

  for (;;) {
    last = await api(`/api/anonymous-crawls/${token}`, { base });
    if (last.status === 'completed' || last.status === 'failed') break;
    if (Date.now() > deadline) break;
    log(`  ${last.status}: ${last.pagesCrawled}/${last.pagesDiscovered} pages`);
    await new Promise((r) => setTimeout(r, delay));
    delay = Math.min(delay * 1.5, 15000);
  }

  const focus = args.all ? null : loadFocus();
  const wanted = focus?.types ? new Set(focus.types) : null;
  const byType = {};
  for (const cat of last.issuesSummary?.byCategory || []) {
    for (const [type, count] of Object.entries(cat.byType || {})) {
      if (!wanted || wanted.has(type)) byType[type] = count;
    }
  }

  emit({
    ok: true,
    mode: 'anonymous-preview',
    url: last.url,
    status: last.status,
    healthScore: last.healthScore,
    pagesCrawled: last.pagesCrawled,
    focus: focus?.name || 'all checks',
    countsByType: byType,
    // The anonymous endpoint returns counts only. Which URLs are affected
    // needs a workspace, so do not pretend otherwise.
    limitation: 'Anonymous scans return issue COUNTS only, not the affected URLs. '
      + 'Run `node scripts/wrendex.mjs signup` for the per-URL fix list.',
    resultsUrl: `${base.replace(/\/+$/, '')}/a/${token}`,
  });
}

async function cmdWhoami() {
  const creds = loadCreds();
  if (!creds) {
    emit({ ok: false, code: 'NO_CREDENTIALS', hint: 'Run: node scripts/wrendex.mjs signup' });
    process.exitCode = 3;
    return;
  }
  const base = baseUrl(creds).replace(/\/api$/, '');
  const tenants = await api('/api/tenants', { token: creds.token, base });
  // The endpoint returns the full tenant record, claim token and billing
  // internals included. Print only what an agent needs to act.
  emit({
    ok: true,
    source: creds.source,
    tenantId: creds.tenantId,
    claimUrl: creds.claimUrl || null,
    workspaces: (tenants || []).map((t) => ({
      id: t.id,
      name: t.name,
      creditBalance: t.creditBalance,
      claimed: Boolean(t.claimedAt),
    })),
  });
}

// ---------------------------------------------------------------- plumbing

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        out[key] = true;
      } else {
        out[key] = next;
        i += 1;
      }
    } else {
      out._.push(a);
    }
  }
  return out;
}

const COMMANDS = {
  preview: cmdPreview,
  signup: cmdSignup,
  audit: cmdAudit,
  status: cmdStatus,
  issues: cmdIssues,
  whoami: cmdWhoami,
};

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const fn = COMMANDS[cmd];
  if (!fn) {
    log(`Usage: wrendex.mjs <${Object.keys(COMMANDS).join('|')}> [args]`);
    process.exitCode = 2;
    return;
  }
  await fn(parseArgs(rest));
}

main().catch((e) => {
  if (e instanceof ApiError) {
    emit({ ok: false, code: e.code, status: e.status, message: e.message });
  } else {
    emit({ ok: false, code: 'UNEXPECTED', message: e.message });
  }
  process.exitCode = 1;
});
