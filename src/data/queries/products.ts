import { queryOptions } from "@tanstack/react-query";
import type { Product } from "#/data/catalog";
import { getProducts } from "#/data/loaders/products";

/**
 * How long a browser tab reuses the list before asking the server again. The
 * answer itself comes from the CDN (see src/lib/cache-headers.ts), so a staff
 * edit in Sanity takes about ten minutes at worst to show up.
 */
const STALE_TIME = 60_000;

/**
 * The whole catalogue. Every screen reads this one query, the product page
 * included, so list and detail never show different data for a product.
 */
export const productsQueryOptions = () =>
	queryOptions({
		queryKey: ["products"],
		queryFn: () => getProducts(),
		staleTime: STALE_TIME,
	});

/** `Product.id` is the Sanity slug, which is also the URL segment. */
export const findProduct = (products: Product[], id: string) =>
	products.find((product) => product.id === id);
