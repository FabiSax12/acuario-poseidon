# Acuario Poseidón CMS

Strapi 5 backend for the storefront catalogue. Standalone project: it has its
own `package.json` and lockfile (pnpm) and is not part of the root pnpm
workspace.

The full workflow, including how the storefront reads this data, is in the
[root README](../README.md#catalogue-strapi).

## Commands

Run from this directory. Requires Node 22.18 or newer.

| Command | What it does |
|---------|--------------|
| `pnpm install` | Installs dependencies |
| `pnpm develop` | Starts Strapi with auto-reload at http://localhost:1337 (admin at `/admin`) |
| `pnpm seed` | Loads the demo products and their photos; safe to run again |
| `pnpm token` | Creates the storefront's read-only API token and prints it once |
| `pnpm build` | Builds the admin panel |
| `pnpm start` | Starts Strapi without auto-reload |

Run `seed` and `token` while Strapi is stopped.

## Layout

| Path | Contents |
|------|----------|
| `src/api/product/` | `product` collection type (schema, controller, router, service) |
| `src/components/shared/spec.json` | `shared.spec` component used by `product.specs` |
| `scripts/seed.mts`, `scripts/seed-data.mts` | Demo catalogue and its loader |
| `scripts/create-token.mts` | Read-only API token for the storefront |
| `config/` | Strapi configuration |
| `.tmp/data.db` | Local SQLite database (gitignored) |
| `public/uploads/` | Media library files (gitignored) |

## Seed behaviour

- Products are matched by `slug` and images by file name. Anything that already
  exists is left untouched, so edits made in the admin panel are kept.
- Photos come from `../public/assets/imagery/`. A missing file is reported and
  the product is created without a photo. A later run attaches the photo once
  the file exists. This is the only change made to an existing product, and
  only while it has no photo (so a photo removed on purpose in the admin panel
  comes back on the next seed run).

## Environment

`.env` is gitignored. To recreate it, copy `.env.example` and give every empty
secret its own random string (`openssl rand -base64 32`; `APP_KEYS` takes four,
comma-separated). With `NODE_ENV=production` Strapi refuses to start while any
of them is empty or still a `toBeModified` placeholder (`src/index.ts`).

## Accounts

The storefront has no customer accounts. Public sign-up
(`/api/auth/local/register`) is switched off on every start in `src/index.ts`,
so it is off on a fresh database too and cannot be re-enabled from the admin
panel without removing that code.

## Before deploying

- Delete the "Full Access" API token that Strapi creates on first start
  (Settings > API Tokens). The storefront only needs "Storefront (read-only)".
- Set real secrets in the host's environment (see Environment).
- `STRAPI_URL` must be reachable from shoppers' browsers: product photos load
  from `/uploads`. The API itself stays behind the token.
- If a browser ever calls the Strapi API directly, restrict CORS origins in
  `config/middlewares.ts`. Today only the storefront server calls it.
- Use a persistent database and media storage; SQLite and local uploads do not
  survive on serverless hosts.
- Run `pnpm audit` and review the result.
