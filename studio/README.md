# Acuario Poseidón Studio

Sanity Studio for the storefront catalogue. Standalone project: it has its own
`package.json` and lockfile (pnpm) and is not part of the root pnpm workspace.

The content lives in Sanity's hosted Content Lake, and the Studio itself is
hosted by Sanity at `https://<hostname>.sanity.studio`. Nothing here runs on
Vercel. How the storefront reads this data is in the
[root README](../README.md#catalogue-sanity).

> The dataset is **public** (the free plan has no private datasets): anyone
> can query it without logging in. Only put in it what the shop already shows.
> No cost prices, supplier names or internal notes.

## Commands

Run from this directory. Requires Node 22.18 or newer.

| Command | What it does |
|---------|--------------|
| `pnpm install` | Installs dependencies |
| `pnpm dev` | Starts the Studio with auto-reload at http://localhost:3333 |
| `pnpm seed` | Writes the demo products and their photos; safe to run again |
| `pnpm run deploy` | Builds the Studio and publishes it to `<hostname>.sanity.studio` |
| `pnpm build` | Builds the Studio into `dist/` without publishing |
| `pnpm typecheck` | Type checks the config, schema and scripts |
| `pnpm test` | Runs the seed unit tests (`node --test`) |

Use `pnpm run deploy`, not `pnpm deploy`: the latter is a pnpm built-in.

## First-time setup

1. Install and log in (opens a browser):

   ```bash
   pnpm install
   pnpm exec sanity login
   ```

2. Create the project with a public `production` dataset, and note the project
   id it prints (`pnpm exec sanity projects list` shows it again):

   ```bash
   pnpm exec sanity projects create "Acuario Poseidón" --dataset production --dataset-visibility public
   ```

3. Copy `.env.example` to `.env` and set `SANITY_STUDIO_PROJECT_ID`.

4. Create a write token for the seed and put it in `.env` as
   `SANITY_WRITE_TOKEN`:

   ```bash
   pnpm exec sanity tokens create "Seed" --role=editor
   ```

5. Load the demo catalogue, then check it in the local Studio:

   ```bash
   pnpm seed
   pnpm dev
   ```

   The seed prints the project id and dataset it writes to; check them.

6. Publish the Studio. The first run asks for the hostname and prints an app
   id; save both in `.env` (`SANITY_STUDIO_HOSTNAME`, `SANITY_STUDIO_APP_ID`)
   so later deploys ask nothing:

   ```bash
   pnpm run deploy
   ```

7. In the storefront, set `SANITY_PROJECT_ID` and `SANITY_DATASET` (in
   `../.env.local`, and in the Vercel project).

## Environment

`.env` is gitignored. See `.env.example` for every variable.

- The Studio and `pnpm seed` read `SANITY_STUDIO_PROJECT_ID` and
  `SANITY_STUDIO_DATASET` from this directory's `.env`. The storefront reads
  `SANITY_PROJECT_ID` and `SANITY_DATASET` from `../.env.local` and from
  Vercel. The two pairs must point at the same project and dataset. A
  mismatch gives no error: it shows as an empty shop.

- Only variables prefixed with `SANITY_STUDIO_` are included in the Studio's
  browser bundle. The project id and dataset are not secrets.
- `SANITY_WRITE_TOKEN` is only read by `pnpm seed`, on your machine. It is not
  bundled, and it must never be set on Vercel: the storefront reads without a
  token. Delete the token in https://www.sanity.io/manage once the seed is
  done if you do not plan to run it again.

## CORS origins

CORS origins control which web pages may call the Sanity API from a browser.
List them with `pnpm exec sanity cors list`.

- The Studio needs its own origin with credentials allowed. Add any that is
  missing:

  ```bash
  pnpm exec sanity cors add http://localhost:3333 --credentials
  pnpm exec sanity cors add https://<hostname>.sanity.studio --credentials
  ```

- The storefront queries Sanity from its server, where CORS does not apply, so
  it needs no origin. If browser code ever queries Sanity directly, add the
  shop's origins without credentials:

  ```bash
  pnpm exec sanity cors add http://localhost:3000 --no-credentials
  pnpm exec sanity cors add https://<shop-domain> --no-credentials
  ```

## Inviting staff

Staff log in to the hosted Studio with Google, GitHub or email. Invite them
from https://www.sanity.io/manage (project > Members), or:

```bash
pnpm exec sanity users invite <email> --role editor
```

The free plan allows 20 users.

## Editing products

Sanity keeps a draft while a product is being edited. A change reaches the
shop only after **Publish**, and then within about ten minutes at worst (the
storefront's CDN cache window).

A product needs a name, a slug, a category and a price. The Studio blocks
publishing without them; if one is missing anyway, the storefront leaves the
product out and logs it.

## Layout

| Path | Contents |
|------|----------|
| `sanity.config.ts` | Studio configuration (project, dataset, schema) |
| `sanity.cli.ts` | CLI configuration (project, dataset, hosted Studio) |
| `schemaTypes/product.ts` | `product` document type |
| `schemaTypes/spec.ts` | `spec` object used by `product.specs` |
| `scripts/seed.mts` | Seed runner: uploads photos, writes products |
| `scripts/seed-document.mts` | Seed product to Sanity document (unit tested) |
| `scripts/seed-data.mts` | The 12 demo products |

Field labels are in Spanish because staff read them; field names, which the
storefront queries, are in English.

## Seed behaviour

- Each product is written with `createOrReplace` under the id
  `product-<slug>`, so running the seed again never duplicates. It does reset
  those 12 products to the seed values, discarding edits made to them in the
  Studio. Products created in the Studio are not touched.
- It prints the target project id and dataset before writing anything.
- Photos come from `../public/assets/imagery/`. Sanity stores an image once
  per file content, so re-uploading does not duplicate either. If any photo is
  missing, the seed lists the missing files, writes nothing and exits with an
  error.
- Each product gets a fixed `_createdAt`, one minute apart, in the order of
  `seed-data.mts`. The storefront lists products oldest first.
