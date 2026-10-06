Welcome to your new TanStack Start app!

# Getting Started

To run this application:

```bash
pnpm install
pnpm dev
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Remove `@tailwindcss/vite` and `tailwindcss` from `package.json`

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
pnpm lint
pnpm format
pnpm check
```


## Deploy to Vercel

The storefront runs on Vercel. The catalogue and its editing panel are hosted
by Sanity (see [Catalogue](#catalogue-sanity)), so there is no server, database
or media storage to run.

Vercel is only the host. It does not build from Git: `vercel.json` turns its
Git deployments off (`git.deploymentEnabled: false`), and every deployment is
made by the GitHub Actions workflow in `.github/workflows/ci.yml` through the
Vercel CLI.

### What the workflow does

| Event | Checks | Deployment |
|-------|--------|------------|
| Pull request from a branch of this repo | storefront and Studio | preview; each run gets its own URL |
| Pull request from a fork, or opened by Dependabot | storefront and Studio | none (those runs get no secrets) |
| Push to `main` | storefront and Studio | production |
| Manual run (**Actions > CI > Run workflow**) | storefront and Studio | production on `main`, preview on any other branch |

The checks are the same commands you can run locally:

```bash
pnpm install --frozen-lockfile
pnpm check        # Biome
pnpm typecheck    # tsc --noEmit
pnpm test         # Vitest
pnpm build
```

and, in `studio/`, `pnpm typecheck` and `pnpm test`. Nothing is deployed unless
all of them pass.

The deploy job then runs `vercel pull`, `vercel build` and
`vercel deploy --prebuilt` (with `--prod` on `main`). The build happens on the
GitHub runner; Vercel receives the finished output. `vercel build` sets
`VERCEL=1`, which makes Nitro write Vercel Functions and static assets to
`.vercel/output` instead of the Node server in `.output` that `pnpm build`
produces locally. `.vercelignore` keeps `studio/` out of the deployment.

The deployment URL is in the run summary and on the `preview` or `production`
environment of the repo. On a pull request it also appears as a **View
deployment** button.

Two things in the deploy job do not stop a deployment but are worth reading in
the run log:

- A warning when `SANITY_PROJECT_ID` or `SANITY_DATASET` did not come down with
  `vercel pull`. Either the variable is missing for that environment in Vercel,
  or it is marked Sensitive there, in which case it is not downloaded and the
  warning can be ignored.
- After a production deploy, a smoke test requests the shop's public address
  and fails the run if it does not answer. It only runs when the repository
  variable `PRODUCTION_URL` is set (see below). It does not undo the deploy.

### Order of deployments

- A newer push to a pull request cancels the run it replaces.
- A run on `main` is never cancelled once it has started; a later push waits
  for it. With several quick pushes GitHub keeps only the newest waiting run,
  so the commits in between are not deployed on their own.
- Production only ever receives the current tip of `main`. A run for an older
  commit (an old run that someone re-runs, or one overtaken by a newer push)
  skips its deploy steps, says so in the summary and ends green.
- To deploy the current `main` again on purpose, run the workflow by hand on
  `main` (**Actions > CI > Run workflow**).

### First-time setup

1. Create the Vercel project from the repo root, without importing the repo in
   the Vercel dashboard:

   ```bash
   pnpm dlx vercel@62.4.0 login
   pnpm dlx vercel@62.4.0 link
   ```

   `vercel link` asks for the team and the project name, creates the project if
   it does not exist, and writes `.vercel/project.json` (gitignored) with
   `orgId` and `projectId`.

2. Create a token at **Vercel > Account Settings > Tokens**. Scope it to the
   team that owns the project and give it an expiry date.

3. In GitHub, under **Settings > Secrets and variables > Actions**, add three
   repository secrets:

   | Secret | Value |
   |--------|-------|
   | `VERCEL_TOKEN` | the token from step 2 |
   | `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
   | `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

   Optionally, on the **Variables** tab, add the repository variable
   `PRODUCTION_URL` with the shop's public address (for example
   `https://<shop-domain>/`) to turn on the smoke test.

4. In the Vercel project, under **Settings > Environment Variables**, add the
   following for both the Production and the Preview environment:

   | Variable | Value |
   |----------|-------|
   | `SANITY_PROJECT_ID` | Sanity project id |
   | `SANITY_DATASET` | `production` |
   | `SANITY_API_VERSION` | optional; defaults to the date pinned in `src/data/sanity-client.ts` |
   | `VITE_SENTRY_DSN` and the other Sentry values | from `.env.example` |

5. In the Vercel project, under **Settings > Deployment Protection**, confirm
   that Vercel Authentication is on for preview deployments. This repo is
   public, so preview URLs are visible to anyone on GitHub.

6. Protect production on the GitHub side (see [Access](#access)).

7. Push to `main`, or run the workflow by hand.

Environment variables live in Vercel only. `vercel pull` downloads the ones of
the target environment for the build, and the deployed functions read them at
run time. GitHub holds nothing but the three secrets and the optional variable.

Variables prefixed with `VITE_` are included in the browser bundle. Keep secrets
unprefixed so they remain server-only. The storefront has no Sanity token: do
not add `SANITY_WRITE_TOKEN` to Vercel.

Leave the Vercel project disconnected from the Git repository. If it is ever
connected (**Settings > Git**), `vercel.json` still stops Vercel from deploying
on its own.

The workflow pins the Vercel CLI, pnpm and Node versions at the top of
`ci.yml`. The Node major used there decides the runtime of the Vercel Functions
(Node 24 gives `nodejs24.x`).

### Access

A Vercel token cannot be limited to preview deployments. The one in
`VERCEL_TOKEN` can deploy to production, and a workflow run on any branch of
this repo can read it. Anyone who can push a branch here can therefore deploy
to production. Pull requests from forks cannot: they get no secrets.

To narrow that down:

- Protect `main` (**Settings > Branches**): require a pull request and the
  `Storefront checks` and `Studio checks` status checks.
- GitHub creates the `preview` and `production` environments on the first run.
  Under **Settings > Environments > production**, add a deployment branch rule
  that allows only `main`.
- Required reviewers on `production` are optional. A run that waits for
  approval holds the queue on `main`: later pushes wait behind it.

The token expires on the date chosen when it was created. From then on the
deploy job fails at the "Pull Vercel settings" step with an authentication
error, while the checks keep passing. To renew it, create a new token in
Vercel, replace the `VERCEL_TOKEN` secret, and re-run the failed job or run the
workflow by hand on `main`.

### Rolling back

A rollback points the production domain at an earlier deployment, without a
rebuild. It does not change `main`, and it does not change the catalogue:
products live in Sanity and are the same before and after.

1. Find the deployment to restore under **Deployments** in the Vercel
   dashboard, or with `pnpm dlx vercel@62.4.0 list`.
2. Roll back to it, from the dashboard (**Instant Rollback**) or with:

   ```bash
   pnpm dlx vercel@62.4.0 rollback <deployment-url-or-id>
   ```

3. Fix or revert the faulty commit on `main`. The workflow deploys it as usual.
4. Promote that new deployment. This step is required: according to Vercel's
   documentation, after a rollback Vercel stops assigning the production domain
   to new production deployments, so the fix is deployed but the domain keeps
   serving the rolled-back deployment until one is promoted. Use **Promote** in
   the dashboard or:

   ```bash
   pnpm dlx vercel@62.4.0 promote <deployment-url-or-id>
   ```

Also according to Vercel's documentation, the Hobby plan can only roll back to
the production deployment immediately before the current one.

### The Studio

The Sanity Studio is not deployed by the workflow; CI only runs its tests and
typecheck. Deploy it by hand with `pnpm run deploy` in `studio/` (see
[`studio/README.md`](./studio/README.md)).

### CDN cache

The catalogue pages (`/`, `/tienda`, `/tienda/<slug>`) and the `getProducts`
server function answer with:

```
Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=300
```

Vercel's CDN serves one copy for 5 minutes, then keeps serving it for 5 more
while it refreshes in the background; after that the next visitor waits for a
fresh read. A change published in the Studio therefore shows up in the shop
within about 10 minutes at worst, and Sanity receives a few requests per hour
instead of one per visit. Browsers always revalidate (`max-age=0`).

These answer with `Cache-Control: no-store` instead, so the CDN never keeps
them:

- a product page that ends in "not found";
- a page or `getProducts` call whose catalogue read failed;
- an empty catalogue (empty or wrong dataset, or every product failed to map).

The policy lives in `src/lib/cache-headers.ts`. The `getProducts` response is
shared between visitors, so it must not depend on who asks.

To check it after a deploy, request a page twice; the second response carries
`x-vercel-cache: HIT`:

```bash
curl -sI https://<shop-domain>/tienda | grep -i -E "cache-control|x-vercel-cache"
```


## Catalogue (Sanity)

Products live in a [Sanity](https://www.sanity.io) project. Staff edit names,
prices, photos and availability in the Sanity Studio, hosted by Sanity at
`https://<hostname>.sanity.studio`, and the storefront shows a published change
within about 10 minutes at worst, without a redeploy.

The Studio's source (schema, configuration, seed) is in [`studio/`](./studio).
It is a standalone project with its own `package.json` and lockfile (pnpm). It
is not part of the pnpm workspace, and the root Biome, Vitest, TypeScript and
Vercel configs ignore it. Setup, seeding, deploying the Studio, CORS origins
and inviting staff are covered in [`studio/README.md`](./studio/README.md).

The dataset is public (Sanity's free plan has no private datasets). Anyone can
read it through the Sanity API, so it must only hold what the shop already
shows.

### How the storefront reads it

| Piece | File |
|-------|------|
| Server-only Sanity client (project and dataset from env, no token) | `src/data/sanity-client.ts` |
| Server function `getProducts` | `src/data/loaders/products.ts` |
| Its body: read plus cache headers (unit tested) | `src/data/products-handler.ts` |
| Catalogue read behind it: one GROQ query, skip-and-log (unit tested with the client mocked) | `src/data/sanity-products.ts` |
| Sanity document to `Product` mapping (unit tested) | `src/lib/sanity-product-mapper.ts` |
| CDN cache policy (unit tested) | `src/lib/cache-headers.ts` |
| TanStack Query options, 60 s stale time | `src/data/queries/products.ts` |
| Route loaders and error screen | `src/routes/index.tsx`, `src/routes/tienda/`, `src/components/tienda/CatalogError.tsx` |

Sanity is only queried from server functions, through Sanity's API CDN, and
only for published documents. The browser receives plain `Product` objects and
never talks to the Sanity API. It does load product photos straight from
Sanity's image CDN (`cdn.sanity.io`), resized to 1200 px wide at most and in
the best format the browser accepts (`auto=format`).

There is one query, the product list. The product page selects its product
from it, so list and detail always agree.

A product the storefront cannot map (no slug or name, a category key it does
not know, a price that is not a number) is left out and logged on the server
as `[sanity] product "<slug>" skipped: <reason>`; the rest of the catalogue
still renders. A second product with a slug already in use is skipped and
logged the same way; the oldest one is kept. An unknown `water` key, a photo
that cannot be resolved, or a badge with only one of its label and tone keeps
the product and logs a warning.

`Product.id` is the Sanity `slug`. Products are listed oldest first
(`_createdAt`), which is the order the shop uses for "Relevancia" and the
landing page uses to pick the four featured fish.

### Environment variables

Copy `.env.example` to `.env.local`:

```bash
SANITY_PROJECT_ID=...        # from sanity.io/manage
SANITY_DATASET=production
SANITY_API_VERSION=          # optional, YYYY-MM-DD
```

All three are server-only. Do not prefix them with `VITE_`.

The Studio and the seed use differently named variables, in `studio/.env`:

| Read by | Project | Dataset |
|---------|---------|---------|
| Storefront (`.env.local`, Vercel) | `SANITY_PROJECT_ID` | `SANITY_DATASET` |
| Studio and seed (`studio/.env`) | `SANITY_STUDIO_PROJECT_ID` | `SANITY_STUDIO_DATASET` |

Both pairs must point at the same project and dataset. If they differ, staff
edit one dataset while the shop reads another, and the shop is empty (or shows
old products) with no error.

### First run

Requires Node 22.18 or newer. Create the Sanity project and load the demo
catalogue first: follow "First-time setup" in
[`studio/README.md`](./studio/README.md). Then, from the repo root:

```bash
pnpm install
pnpm dev          # storefront at http://localhost:3000
```

### Product fields

| Sanity field | Type | Storefront |
|--------------|------|------------|
| `name` | string, required | name |
| `slug` | slug from `name`, required, unique | product URL (`/tienda/<slug>`) |
| `category` | `peces`, `alimento`, `equipos`, `plantas` | category tab |
| `water` | `dulce`, `salada`, optional | water filter |
| `subtitle` | string | Latin name, or pack size / capacity |
| `price`, `compareAt` | number | price and crossed-out price |
| `image` | image with hotspot | photo; without one the `icon` placeholder is shown |
| `icon` | list | placeholder icon |
| `badgeLabel`, `badgeTone` | string, list | badge, shown only when both are set |
| `specs` | array of `spec { text }` | chips on the card |
| `beginner`, `inStock` | boolean | "principiantes" filter, stock state |
| `temp`, `ph`, `size`, `mates` | string | care sheet on the product page |

The list keys are mapped to the Spanish labels in
`src/lib/sanity-product-mapper.ts`. When you add a value to `category`, `icon`
or `badgeTone` in `studio/schemaTypes/product.ts`, add it to the lists in that
file too. Sanity keeps drafts: a product goes live when it is published.

The landing page category tiles and decorative images are static and stay in
`src/data/catalog.ts`.


## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).



# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
