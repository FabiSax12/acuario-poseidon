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

1. Push this repo to GitHub, GitLab, or Bitbucket
2. In Vercel, choose **Add New > Project** and import the repo
3. Keep the detected TanStack Start framework settings
4. Add production values from `.env.example` under **Settings > Environment Variables**
5. Deploy

Vercel runs the build script and deploys Nitro's output as Vercel Functions and
static assets. The included `vercel.json` makes framework detection explicit.

Variables prefixed with `VITE_` are included in the browser bundle. Keep secrets
unprefixed so they remain server-only.


## Catalogue (Strapi)

Products live in a Strapi 5 backend in [`cms/`](./cms). Staff edit names,
prices, photos and availability in the Strapi admin panel and the storefront
shows the change within a minute, without a redeploy.

`cms/` is a standalone project with its own `package.json` and lockfile (pnpm).
It is not part of the pnpm workspace, and the root Biome, Vitest, TypeScript and
Vercel configs ignore it.

### How the storefront reads it

| Piece | File |
|-------|------|
| Server-only Strapi client (URL and token from env) | `src/data/strapi-sdk.ts` |
| Server function `getProducts` | `src/data/loaders/products.ts` |
| Catalogue read behind it: pagination, skip-and-log (unit tested with the client mocked) | `src/data/strapi-products.ts` |
| Strapi entry to `Product` mapping (unit tested) | `src/lib/product-mapper.ts` |
| TanStack Query options, 60 s stale time | `src/data/queries/products.ts` |
| Route loaders and error screen | `src/routes/index.tsx`, `src/routes/tienda/`, `src/components/tienda/CatalogError.tsx` |

Strapi is only called from server functions, with a read-only API token. The
browser receives plain `Product` objects and never talks to the Strapi API. It
does load product photos straight from Strapi's public `/uploads` folder, so
`STRAPI_URL` must be reachable from shoppers' browsers.

There is one query, the product list. The product page selects its product
from it, so list and detail always agree.

A product the storefront cannot map (a category key it does not know, a price
that is not a number) is left out and logged on the server as
`[strapi] product "<slug>" skipped: <reason>`; the rest of the catalogue still
renders. An unknown `water` key keeps the product and logs a warning.

`Product.id` is the Strapi `slug`. Products are listed oldest first, which is
the order the shop uses for "Relevancia" and the landing page uses to pick the
four featured fish.

### Environment variables

Copy `.env.example` to `.env.local`:

```bash
STRAPI_URL=http://localhost:1337   # base URL, without /api
STRAPI_API_TOKEN=...               # read-only token, see below
```

Both are server-only. Do not prefix them with `VITE_`.

### First run

Requires Node 22.18 or newer (the seed and token scripts are TypeScript files
run by Node directly).

```bash
cd cms
pnpm install
pnpm seed      # demo products and their photos; safe to run again
pnpm token     # prints STRAPI_API_TOKEN=... for ../.env.local
pnpm develop   # Strapi at http://localhost:1337
```

Run `seed` and `token` while Strapi is stopped: they boot their own Strapi
instance on the same SQLite file.

Then open http://localhost:1337/admin and create the first admin user (Strapi
asks for it on the first visit; it is stored in the local database only).

In another terminal, from the repo root:

```bash
pnpm install
pnpm dev          # storefront at http://localhost:3000
```

`cms/.env` holds Strapi's own secrets and is gitignored. If it is missing, copy
`cms/.env.example` and fill in every empty secret with its own random string
(`openssl rand -base64 32`; `APP_KEYS` takes four, comma-separated).

### Creating the API token by hand

`pnpm token` creates a token named "Storefront (read-only)" that can only
`find` and `findOne` products. To do the same in the admin panel:

1. Go to **Settings > API Tokens > Create new API Token**.
2. Name it, set **Token duration** to *Unlimited* and **Token type** to
   *Custom*.
3. Under **Permissions > Product**, tick `find` and `findOne` only.
4. Save, copy the token (it is shown once) into `.env.local` as
   `STRAPI_API_TOKEN`, and restart `pnpm dev`.

Leave the **Public** role (Settings > Users & Permissions > Roles) without
permissions, so the API cannot be read without the token.

### Product fields

| Strapi field | Type | Storefront |
|--------------|------|------------|
| `name` | text, required | name |
| `slug` | UID from `name`, required | product URL (`/tienda/<slug>`) |
| `category` | `peces`, `alimento`, `equipos`, `plantas` | category tab |
| `water` | `dulce`, `salada`, optional | water filter |
| `subtitle` | text | Latin name, or pack size / capacity |
| `price`, `compareAt` | decimal | price and crossed-out price |
| `image` | single image | photo; without one the `icon` placeholder is shown |
| `icon` | enum | placeholder icon |
| `badgeLabel`, `badgeTone` | text, enum | badge, shown only when both are set |
| `specs` | repeatable `shared.spec { text }` | chips on the card |
| `beginner`, `inStock` | boolean | "principiantes" filter, stock state |
| `temp`, `ph`, `size`, `mates` | text | care sheet on the product page |

The enum keys are mapped to the Spanish labels in `src/lib/product-mapper.ts`.
When you add a value to `icon` or `badgeTone` in Strapi, add it to the lists in
that file too. Draft and publish is off: saving a product makes it live.

The landing page category tiles and decorative images are static and stay in
`src/data/catalog.ts`.

### Deploying

Hosting Strapi is not set up yet. `.vercelignore` keeps `cms/` out of the
storefront deployment. A hosted Strapi needs a persistent database and media
storage (SQLite and local uploads do not survive on serverless hosts), and
`STRAPI_URL` / `STRAPI_API_TOKEN` set in the storefront's environment. See
"Before deploying" in [`cms/README.md`](./cms/README.md).

### Article scaffold

The article loaders, block renderer and `StrapiImage` from the original
TanStack add-on are still in the repo, unused, for a later guides section. They
share the server-only client. `getStrapiMedia(url, baseUrl)` in
`src/lib/strapi-utils.ts` no longer reads a public env var: make media URLs
absolute on the server, as the product mapper does. `StrapiImage` passes no
base URL, so a relative Strapi URL would resolve against the storefront origin;
fix that when the articles are wired up. The article server functions validate
their input (`src/lib/article-input.ts`) and use the same error sanitiser as
the product loader.


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
