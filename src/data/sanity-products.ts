import type { Product } from "#/data/catalog";
import { getSanityClient, readFromSanity } from "#/data/sanity-client";
import {
	mapSanityProduct,
	type SanityProduct,
} from "#/lib/sanity-product-mapper";

// Plain function behind the `getProducts` server function, kept separate so it
// can be unit tested with the Sanity client mocked.

/**
 * The whole catalogue in one request. Ordered oldest first: the shop keeps
 * that order for "Relevancia" and the landing page uses it to pick the
 * featured fish. `image` is returned as stored (asset reference, crop and
 * hotspot) and turned into a URL by the mapper.
 */
export const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt asc, _id asc) {
	_id,
	name,
	"slug": slug.current,
	category,
	water,
	subtitle,
	price,
	compareAt,
	image,
	icon,
	badgeLabel,
	badgeTone,
	specs,
	beginner,
	inStock,
	temp,
	ph,
	size,
	mates
}`;

/**
 * Reads the whole catalogue. A document that cannot be mapped, or that repeats
 * the slug of an earlier one, is left out and logged on the server, so one
 * bad product does not take the shop down.
 */
export function fetchProducts(): Promise<Product[]> {
	return readFromSanity("products list", async (config) => {
		const docs =
			await getSanityClient(config).fetch<SanityProduct[]>(PRODUCTS_QUERY);
		if (!Array.isArray(docs)) {
			throw new TypeError("the products query did not return a list");
		}

		const products: Product[] = [];
		const seen = new Set<string>();
		for (const doc of docs) {
			// A document without a slug is identified by its document id.
			const ref = doc.slug?.trim() || doc._id;
			const result = mapSanityProduct(doc, config);
			if (!result.ok) {
				console.warn(`[sanity] product "${ref}" skipped: ${result.reason}`);
				continue;
			}
			// The slug is the product URL and its id in the cart, so only the
			// first (oldest) document with a given slug is kept.
			if (seen.has(result.product.id)) {
				console.warn(
					`[sanity] product "${result.product.id}" skipped: duplicate slug (document "${doc._id}")`,
				);
				continue;
			}
			seen.add(result.product.id);
			for (const warning of result.warnings) {
				console.warn(`[sanity] product "${ref}": ${warning}`);
			}
			products.push(result.product);
		}
		return products;
	});
}
