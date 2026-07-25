# Auth0 Setup Guide

## Overview

Auth0 is the Identity Provider for `apps/api`. The API issues its own internal JWT after validating the Auth0 token.

**Architecture**:

```
Frontend → Auth0 (login/register) → Auth0 token
Frontend → signInByAuth0 / register mutation → internal JWT
Frontend → subsequent API calls with internal JWT
```

---

## Step 1: Create a Tenant

1. Go to [auth0.com](https://auth0.com) → Sign up or Login
2. Click **Create Tenant**
3. Fill in:
   - **Tenant Domain**: `your-app` (becomes `your-app.auth0.com`)
   - **Region**: Choose based on data residency (US, EU, AU)
   - **Environment Tag**: `Development`
4. Create a **separate Production tenant** when deploying — never share tenants between environments

---

## Database Connection (No Setup Required)

Auth0 automatically creates a default database connection named **`Username-Password-Authentication`** for every tenant. This is what the API uses for email/password registration — **no manual setup needed**.

View it at: Dashboard → **Authentication** → **Database**

**Free tier**: 7,500 active users/month, no credit card required.

---

## Step 2: Create an API (Resource Server)

This represents `apps/api` in Auth0.

1. Dashboard → **Applications** → **APIs** → **Create API**
2. Fill in:
   - **Name**: `Canmore Stays API`
   - **Identifier (Audience)**: `https://api.canmorestays.com`
     - Logical URI — does not need to resolve to a real URL
     - Used as the `audience` claim in JWT tokens
   - **Signing Algorithm**: `RS256`
3. Save and note the **Audience** value

---

## Step 3: Create a Frontend Application (SPA/Web)

This represents `apps/frontend` (React/Next.js).

1. Dashboard → **Applications** → **Applications** → **Create Application**
2. Choose **Single Page Application**
3. Fill in:
   - **Allowed Callback URLs**: `http://localhost:3000/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Note:
   - **Domain**: `your-app.auth0.com`
   - **Client ID**: used in frontend Auth0 SDK config

---

## Step 4: Create a Machine-to-Machine (M2M) Application

This is used by `apps/api` server to call the Auth0 Management API (for creating/deleting users programmatically).

1. Dashboard → **Applications** → **Applications** → **Create Application**
2. Choose **Machine to Machine Applications**
3. Name: `Canmore Stays API Server`
4. Click **Create**
5. When prompted "Which API?":
   - Select **Auth0 Management API**
   - Expand **Permissions** and tick:
     - `create:users`
     - `delete:users`
   - Click **Authorize**
6. Go to the app's **Settings** tab and note:
   - **Client ID** → `AUTH0_M2M_CLIENT_ID`
   - **Client Secret** → `AUTH0_M2M_CLIENT_SECRET` (**keep secret — server-side only**)

---

## Environment Variables

Add to `apps/api/.env`:

```env
# Auth0 tenant domain (no https://)
AUTH0_DOMAIN=your-app.auth0.com

# API audience (matches the Identifier in Step 2)
AUTH0_AUDIENCE=https://api.canmorestays.com

# M2M credentials for Management API (Step 4)
AUTH0_M2M_CLIENT_ID=your_m2m_client_id
AUTH0_M2M_CLIENT_SECRET=your_m2m_client_secret
```

---

## GraphQL Mutations (Implemented)

| Mutation               | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `register(input)`      | Creates user in Auth0 + local DB, returns internal JWT      |
| `signInByAuth0(input)` | Validates Auth0 access token via JWKS, returns internal JWT |

**`register` flow**:

1. Create user in Auth0 via Management API
2. Hash password + create user in local DB (with `auth0Id` linked)
3. Rollback Auth0 user if DB insert fails

**`signInByAuth0` flow**:

1. Validate Auth0 access token via JWKS (`RS256`)
2. Find or create local user by `auth0Id` / `email`
3. Return internal JWT

---

## Key Files

| File                                                         | Purpose                                           |
| ------------------------------------------------------------ | ------------------------------------------------- |
| `src/modules/auth/services/auth0-token-validator.service.ts` | Validates Auth0 JWT via JWKS                      |
| `src/modules/auth/services/auth0-management.service.ts`      | Management API wrapper (create/delete users)      |
| `src/modules/auth/auth.resolver.ts`                          | GraphQL mutations: `register`, `signInByAuth0`    |
| `src/modules/auth/auth.service.ts`                           | Business logic, internal JWT generation           |
| `prisma/schema.prisma`                                       | User model with `auth0Id`, `password?` (optional) |

---

## Auth0 Dashboard Reference

| Resource              | Path                                           |
| --------------------- | ---------------------------------------------- |
| Tenant settings       | `https://manage.auth0.com/dashboard`           |
| API (Resource Server) | Dashboard → Applications → APIs                |
| SPA App               | Dashboard → Applications → Applications        |
| M2M App               | Dashboard → Applications → Applications        |
| JWKS endpoint         | `https://{AUTH0_DOMAIN}/.well-known/jwks.json` |
| Token endpoint        | `https://{AUTH0_DOMAIN}/oauth/token`           |
| Management API        | `https://{AUTH0_DOMAIN}/api/v2/`               |
