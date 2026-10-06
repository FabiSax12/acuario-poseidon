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

1. Push this repo to GitHub, GitLab, or Bitbucket
2. In Vercel, choose **Add New > Project** and import the repo
3. Keep the detected TanStack Start framework settings
4. Under **Settings > Environment Variables**, add:

   | Variable | Value |
   |----------|-------|
   | `SANITY_PROJECT_ID` | Sanity project id |
   | `SANITY_DATASET` | `production` |
   | `SANITY_API_VERSION` | optional; defaults to the date pinned in `src/data/sanity-client.ts` |
   | `VITE_SENTRY_DSN` and the other Sentry values | from `.env.example` |

5. Deploy

Vercel runs the build script and deploys Nitro's output as Vercel Functions and
static assets. The included `vercel.json` makes framework detection explicit.
`.vercelignore` keeps `studio/` out of the deployment.

Variables prefixed with `VITE_` are included in the browser bundle. Keep secrets
unprefixed so they remain server-only. The storefront has no Sanity token: do
not add `SANITY_WRITE_TOKEN` to Vercel.

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
