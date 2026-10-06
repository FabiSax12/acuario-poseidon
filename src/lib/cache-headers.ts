/**
 * CDN cache policy for everything that shows the catalogue: the pages rendered
 * on the server and the `getProducts` server function behind client-side
 * navigation.
 *
 * `max-age=0` keeps browsers revalidating. `s-maxage=300` lets the CDN serve
 * one copy for five minutes. `stale-while-revalidate=300` lets it answer from
 * that copy for five more minutes while it refreshes in the background; after
 * that the next visitor waits for a fresh read. A price or stock change is
 * therefore visible within about ten minutes at worst, and the CMS sees a
 * handful of requests per hour instead of one per visit.
 */
export const CATALOG_CACHE_CONTROL =
	"public, max-age=0, s-maxage=300, stale-while-revalidate=300";

/** For responses that must not be stored by the CDN or the browser. */
export const NO_STORE = "no-store";

export const noStoreHeaders = (): Record<string, string> => ({
	"Cache-Control": NO_STORE,
});

/**
 * Headers for a response that carries `productCount` products. An empty
 * catalogue is never cached: it usually means an empty or wrong dataset, or
 * that every document failed to map, and must not stick once that is fixed.
 */
export const catalogCacheHeaders = (
	productCount: number,
): Record<string, string> =>
	productCount > 0
		? { "Cache-Control": CATALOG_CACHE_CONTROL }
		: noStoreHeaders();

/** What the catalogue route loaders return, for `catalogRouteHeaders`. */
export interface CatalogLoaderData {
	productCount: number;
}

/**
 * Route `headers` option for the catalogue pages. The router also calls it
 * for a match that ended in `notFound()` or in an error, and the CDN caches
 * 404 responses, so only a page that loaded products gets the catalogue
 * policy.
 */
export const catalogRouteHeaders = ({
	match,
	loaderData,
}: {
	match: { status: "pending" | "success" | "error" | "notFound" };
	loaderData?: CatalogLoaderData;
}): Record<string, string> =>
	match.status === "success"
		? catalogCacheHeaders(loaderData?.productCount ?? 0)
		: noStoreHeaders();
