# Auth0 M2M Permissions Reference

Detailed reference for Machine-to-Machine (M2M) application scopes and permissions required by the Canmore Stays project.

## What Is M2M?

M2M (Machine-to-Machine) is an Auth0 application type that authenticates using **Client Credentials** (client_id + client_secret) — no user interaction needed. Used for server-to-server API calls.

In this project, the NestJS API uses M2M to call Auth0 Management API for user management and the init script uses it to create Auth0 resources.

## Required Scopes

### For Init Script (`scripts/auth0-init.mjs`)

| Scope | Purpose |
|-------|---------|
| `create:clients` | Create SPA application ("Canmore Stays Web") |
| `read:clients` | Check if SPA app already exists (idempotent) |
| `create:resource_servers` | Create API Resource Server |
| `read:resource_servers` | Check if API already exists (idempotent) |

### For NestJS API (runtime)

| Scope | Purpose |
|-------|---------|
| `create:users` | Create users in Auth0 during registration/seeding |
| `delete:users` | Rollback — delete Auth0 user if local DB insert fails |

### All Scopes Combined

When creating the M2M app, grant **all 6 scopes** at once:

```
create:clients
read:clients
create:resource_servers
read:resource_servers
create:users
delete:users
```

## How to Grant Scopes

### During M2M App Creation

1. Auth0 Dashboard → **Applications** → **Create Application**
2. Name: `Canmore Stays M2M`, Type: **Machine to Machine**
3. "Select API" dialog → choose **Auth0 Management API**
4. Check the 6 scopes listed above
5. Click **Authorize**

### After Creation (Add/Change Scopes)

1. Auth0 Dashboard → **Applications** → **APIs** tab
2. Find **Auth0 Management API** → click the expand arrow
3. Check/uncheck scopes as needed
4. Click **Update**

Or:

1. Auth0 Dashboard → **APIs** → **Auth0 Management API**
2. Tab **Machine to Machine Applications**
3. Find your M2M app → toggle **Authorized** on
4. Click the dropdown arrow → check scopes
5. Click **Update**

## Fixing Missing Scopes

| Error | Missing Scope | Fix |
|-------|--------------|-----|
| `403` on `POST /api/v2/clients` | `create:clients` | Add scope, re-run script |
| `403` on `GET /api/v2/clients` | `read:clients` | Add scope, re-run script |
| `403` on `POST /api/v2/resource-servers` | `create:resource_servers` | Add scope, re-run script |
| `403` on `POST /api/v2/users` | `create:users` | Add scope, restart API |
| `403` on `DELETE /api/v2/users` | `delete:users` | Add scope, restart API |

After adding scopes, the M2M app's next token request will include the new permissions. No need to rotate client ID/secret.

## Scope Minimization

Follow **principle of least privilege**:

| Scope | Needed? | Why |
|-------|---------|-----|
| `create:clients` | Yes | Init script creates SPA app |
| `read:clients` | Yes | Idempotent check |
| `create:resource_servers` | Yes | Init script creates API |
| `read:resource_servers` | Yes | Idempotent check |
| `create:users` | Yes | Seed + registration |
| `delete:users` | Optional | Only for rollback on DB failure |
| `update:clients` | No | Script doesn't modify existing apps |
| `delete:clients` | No | Script doesn't delete apps |
| `read:users` | No | Not used currently |
| `update:users` | No | Not used currently |

## How M2M Auth Works

```
NestJS API / Init Script
  → POST https://{domain}/oauth/token
    body: { grant_type: "client_credentials",
            client_id: AUTH0_M2M_CLIENT_ID,
            client_secret: AUTH0_M2M_CLIENT_SECRET,
            audience: "https://{domain}/api/v2/" }
  ← { access_token: "...", expires_in: 86400 }

  → Use access_token as Bearer token for Management API calls
  → Token cached until expiry (with 60s buffer in API service)
```

## Security Best Practices

- **Never commit** M2M client secret to git
- Store in `.env` (gitignored) or secrets manager (Vault, AWS SSM, etc.)
- Rotate secret periodically: Dashboard → App → Settings → **Rotate Secret**
- After rotation: update `apps/api/.env` and restart API
- Only grant scopes actually needed — review quarterly
- Use separate M2M apps for different environments (dev/staging/prod)
