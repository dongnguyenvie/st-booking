/**
 * Auth0 Init Script
 *
 * Creates Auth0 applications (SPA + M2M) and API resource server
 * for the Carousel Marketplace monorepo. Reads credentials from apps/api/.env.
 *
 * Usage:
 *   node scripts/auth0-init.mjs
 *   node scripts/auth0-init.mjs --dry-run     # preview without creating
 *
 * Prerequisites:
 *   - AUTH0_DOMAIN, AUTH0_M2M_CLIENT_ID, AUTH0_M2M_CLIENT_SECRET in apps/api/.env
 *   - M2M app must be authorized for Auth0 Management API with scopes:
 *     create:clients, read:clients, create:resource_servers, read:resource_servers
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const API_ENV_PATH = resolve(ROOT, 'apps/api/.env');
const WEB_ENV_PATH = resolve(ROOT, 'apps/frontend/.env.local');

const DRY_RUN = process.argv.includes('--dry-run');

// ── Helpers ────────────────────────────────────────────────────────

const log = (msg) => console.log(msg);
const err = (msg) => {
  console.error(`[ERROR] ${msg}`);
  process.exit(1);
};

/** Parse a .env file into key-value pairs */
function parseEnv(filePath) {
  if (!existsSync(filePath)) err(`File not found: ${filePath}`);
  const content = readFileSync(filePath, 'utf-8');
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

/** Update or append a key=value in a .env file */
function upsertEnvVar(filePath, key, value) {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, `${key}=${value}\n`);
    return;
  }
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let found = false;
  const updated = lines.map((line) => {
    if (line.trim().startsWith(`${key}=`)) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });
  if (!found) updated.push(`${key}=${value}`);
  writeFileSync(filePath, updated.join('\n'));
}

// ── Auth0 Management API ───────────────────────────────────────────

async function getManagementToken(domain, clientId, clientSecret) {
  const res = await fetch(`https://${domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${domain}/api/v2/`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    err(`Failed to get management token: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function mgmtRequest(domain, token, method, path, body) {
  const res = await fetch(`https://${domain}/api/v2${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

/** Find existing client by name */
async function findClient(domain, token, name) {
  const { data } = await mgmtRequest(domain, token, 'GET', `/clients?q=${encodeURIComponent(`name:"${name}"`)}&search_engine=v3`, null);
  if (Array.isArray(data)) {
    return data.find((c) => c.name === name) ?? null;
  }
  return null;
}

/** Find existing API by identifier */
async function findApi(domain, token, identifier) {
  const { data } = await mgmtRequest(domain, token, 'GET', '/resource-servers', null);
  if (Array.isArray(data)) {
    return data.find((a) => a.identifier === identifier) ?? null;
  }
  return null;
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  log('=== Auth0 Init ===\n');

  // 1. Read credentials from API .env
  const env = parseEnv(API_ENV_PATH);
  const domain = env.AUTH0_DOMAIN;
  const m2mId = env.AUTH0_M2M_CLIENT_ID;
  const m2mSecret = env.AUTH0_M2M_CLIENT_SECRET;
  const audience = env.AUTH0_AUDIENCE || 'https://api.canmorestays.com';
  const originDomain = env.ORIGIN_DOMAIN || 'http://localhost:3000';

  if (!domain || !m2mId || !m2mSecret) {
    err('Missing AUTH0_DOMAIN, AUTH0_M2M_CLIENT_ID, or AUTH0_M2M_CLIENT_SECRET in apps/api/.env');
  }

  log(`  Domain:   ${domain}`);
  log(`  Audience: ${audience}`);
  log(`  Origin:   ${originDomain}`);
  log(`  M2M ID:   ${m2mId.slice(0, 8)}...`);
  log('');

  if (DRY_RUN) {
    log('[DRY RUN] Would create the following resources:');
    log('  - SPA Application: "Carousel Marketplace Web"');
    log('  - M2M Application: "Carousel Marketplace API"');
    log(`  - API Resource Server: "${audience}"`);
    log('\nRe-run without --dry-run to create.');
    return;
  }

  // 2. Get management token
  log('[*] Fetching management token...');
  const token = await getManagementToken(domain, m2mId, m2mSecret);
  log('[+] Management token obtained\n');

  // 3. Create or find SPA application (for Next.js web)
  log('[*] Setting up SPA application "Carousel Marketplace Web"...');
  let spaClient = await findClient(domain, token, 'Carousel Marketplace Web');
  if (spaClient) {
    log(`[=] Already exists: ${spaClient.client_id}`);
  } else {
    const { ok, data } = await mgmtRequest(domain, token, 'POST', '/clients', {
      name: 'Carousel Marketplace Web',
      app_type: 'spa',
      token_endpoint_auth_method: 'none',
      callbacks: [`${originDomain}/callback`],
      allowed_logout_urls: [originDomain],
      web_origins: [originDomain],
      allowed_origins: [originDomain],
      grant_types: ['authorization_code', 'implicit', 'refresh_token'],
      oidc_conformant: true,
    });
    if (!ok) err(`Failed to create SPA client: ${JSON.stringify(data)}`);
    spaClient = data;
    log(`[+] Created: ${spaClient.client_id}`);
  }

  // 4. Create or find API Resource Server
  log('\n[*] Setting up API Resource Server...');
  let apiServer = await findApi(domain, token, audience);
  if (apiServer) {
    log(`[=] Already exists: ${apiServer.identifier}`);
  } else {
    const { ok, data } = await mgmtRequest(domain, token, 'POST', '/resource-servers', {
      name: 'Carousel Marketplace API',
      identifier: audience,
      signing_alg: 'RS256',
      token_lifetime: 86400,
      scopes: [
        { value: 'admin:read', description: 'Read admin resources' },
        { value: 'admin:write', description: 'Write admin resources' },
        { value: 'listing:read', description: 'Read listings' },
        { value: 'listing:write', description: 'Create and edit listings' },
        { value: 'reservation:read', description: 'Read reservations' },
        { value: 'reservation:write', description: 'Create and manage reservations' },
      ],
    });
    if (!ok) err(`Failed to create API: ${JSON.stringify(data)}`);
    apiServer = data;
    log(`[+] Created: ${apiServer.identifier}`);
  }

  // 5. Update .env files with new values
  log('\n[*] Updating .env files...');

  // Update web .env.local with SPA client ID
  upsertEnvVar(WEB_ENV_PATH, 'NEXT_PUBLIC_AUTH0_CLIENT_ID', spaClient.client_id);
  upsertEnvVar(WEB_ENV_PATH, 'NEXT_PUBLIC_AUTH0_DOMAIN', domain);
  upsertEnvVar(WEB_ENV_PATH, 'NEXT_PUBLIC_AUTH0_AUDIENCE', audience);
  log(`[+] Updated ${WEB_ENV_PATH}`);

  // Ensure API .env has audience
  upsertEnvVar(API_ENV_PATH, 'AUTH0_AUDIENCE', audience);
  log(`[+] Updated ${API_ENV_PATH}`);

  // 6. Summary
  log('\n=== Auth0 Init Complete ===\n');
  log('  Resources:');
  log(`    SPA Client ID:  ${spaClient.client_id}`);
  log(`    API Audience:   ${audience}`);
  log(`    M2M Client ID:  ${m2mId} (existing)`);
  log('');
  log('  Files updated:');
  log('    apps/frontend/.env.local  → NEXT_PUBLIC_AUTH0_CLIENT_ID, DOMAIN, AUDIENCE');
  log('    apps/api/.env        → AUTH0_AUDIENCE');
  log('');
  log('  Next steps:');
  log('    1. Verify apps/frontend/.env.local and apps/api/.env');
  log('    2. Run: pnpm dev');
  log('    3. Test Auth0 login at http://localhost:3000/login');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
