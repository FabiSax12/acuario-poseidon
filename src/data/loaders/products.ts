import { createServerFn } from "@tanstack/react-start";
import type { Product } from "#/data/catalog";
import { fetchProducts } from "#/data/strapi-products";

// Server function: Strapi is only ever called from this handler, with the
// read-only API token. The browser receives plain `Product` objects.
export const getProducts = createServerFn({ method: "GET" }).handler(
	(): Promise<Product[]> => fetchProducts(),
);
