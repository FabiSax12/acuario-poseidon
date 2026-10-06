import { setResponseHeaders } from "@tanstack/react-start/server";
import type { Product } from "#/data/catalog";
import { fetchProducts } from "#/data/sanity-products";
import { catalogCacheHeaders, noStoreHeaders } from "#/lib/cache-headers";

// Body of the `getProducts` server function, kept separate so the cache
// headers can be unit tested with `setResponseHeaders` mocked.

/**
 * Reads the catalogue and sets the response's cache policy. The headers cover
 * the request made on client-side navigation; the pages rendered on the
 * server set their own policy with the route `headers` option.
 */
export async function getProductsHandler(): Promise<Product[]> {
	try {
		const products = await fetchProducts();
		setResponseHeaders(new Headers(catalogCacheHeaders(products.length)));
		return products;
	} catch (error) {
		// The error is serialised into an HTTP 200 response, so it is marked
		// explicitly: it must never pick up a cacheable header.
		setResponseHeaders(new Headers(noStoreHeaders()));
		throw error;
	}
}
