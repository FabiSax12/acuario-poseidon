import { createFileRoute } from "@tanstack/react-router";
import { CatalogError } from "#/components/tienda/CatalogError";
import { Shop } from "#/components/tienda/Shop";
import { productsQueryOptions } from "#/data/queries/products";
import { catalogRouteHeaders } from "#/lib/cache-headers";

export const Route = createFileRoute("/tienda/")({
	loader: async ({ context }) => {
		const products = await context.queryClient.ensureQueryData(
			productsQueryOptions(),
		);
		// Read by catalogRouteHeaders: an empty catalogue is not cached.
		return { productCount: products.length };
	},
	headers: catalogRouteHeaders,
	component: Shop,
	errorComponent: CatalogError,
});
