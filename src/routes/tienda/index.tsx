import { createFileRoute } from "@tanstack/react-router";
import { CatalogError } from "#/components/tienda/CatalogError";
import { Shop } from "#/components/tienda/Shop";
import { productsQueryOptions } from "#/data/queries/products";

export const Route = createFileRoute("/tienda/")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(productsQueryOptions());
	},
	component: Shop,
	errorComponent: CatalogError,
});
