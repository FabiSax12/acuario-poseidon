import type { Product } from "#/data/catalog";
import { getStrapiClient, readFromStrapi } from "#/data/strapi-sdk";
import { mapProduct } from "#/lib/product-mapper";
import type { TProduct, TStrapiResponseCollection } from "#/types/strapi";

// Plain function behind the `getProducts` server function, kept separate so it
// can be unit tested with the Strapi client mocked.

/** Matches `rest.maxLimit` in cms/config/api.ts. */
const PAGE_SIZE = 100;

const POPULATE = ["image", "specs"];

/**
 * Catalogue order, which the shop keeps for "Relevancia" and the landing page
 * uses to pick the featured fish: oldest entry first.
 */
const SORT = ["createdAt:asc", "id:asc"];

/**
 * Reads the whole catalogue. An entry that cannot be mapped is left out and
 * logged on the server, so one bad product does not take the shop down.
 */
export function fetchProducts(): Promise<Product[]> {
	return readFromStrapi("products list", async (config) => {
		const collection = getStrapiClient(config).collection("products");
		const entries: TProduct[] = [];
		let pageCount = 1;
		for (let page = 1; page <= pageCount; page++) {
			const response = (await collection.find({
				sort: SORT,
				populate: POPULATE,
				pagination: { page, pageSize: PAGE_SIZE },
			})) as unknown as TStrapiResponseCollection<TProduct>;
			entries.push(...response.data);
			pageCount = response.meta?.pagination?.pageCount ?? 1;
		}

		const products: Product[] = [];
		for (const entry of entries) {
			const result = mapProduct(entry, config.url);
			if (!result.ok) {
				console.warn(
					`[strapi] product "${entry.slug}" skipped: ${result.reason}`,
				);
				continue;
			}
			for (const warning of result.warnings) {
				console.warn(`[strapi] product "${entry.slug}": ${warning}`);
			}
			products.push(result.product);
		}
		return products;
	});
}
