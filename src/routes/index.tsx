import { createFileRoute } from "@tanstack/react-router";
import { CatalogError } from "#/components/tienda/CatalogError";
import { Landing } from "#/components/tienda/Landing";
import { productsQueryOptions } from "#/data/queries/products";

export const Route = createFileRoute("/")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(productsQueryOptions());
	},
	component: Landing,
	errorComponent: CatalogError,
});
