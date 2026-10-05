import { queryOptions } from "@tanstack/react-query";
import type { Product } from "#/data/catalog";
import { getProducts } from "#/data/loaders/products";

/** Staff edits in Strapi show up within a minute, without a redeploy. */
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

/** `Product.id` is the Strapi slug, which is also the URL segment. */
export const findProduct = (products: Product[], id: string) =>
	products.find((product) => product.id === id);
