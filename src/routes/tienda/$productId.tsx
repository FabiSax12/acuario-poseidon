import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { CatalogError } from "#/components/tienda/CatalogError";
import { NotFound } from "#/components/tienda/NotFound";
import { ProductDetail } from "#/components/tienda/ProductDetail";
import { findProduct, productsQueryOptions } from "#/data/queries/products";

export const Route = createFileRoute("/tienda/$productId")({
	loader: async ({ context, params }) => {
		const products = await context.queryClient.ensureQueryData(
			productsQueryOptions(),
		);
		if (!findProduct(products, params.productId)) throw notFound();
	},
	component: ProductPage,
	notFoundComponent: ProductNotFound,
	errorComponent: CatalogError,
});

function ProductNotFound() {
	return (
		<NotFound
			title="Producto no encontrado"
			message="No tenemos ese producto en el catálogo. Puede que ya no esté disponible."
		/>
	);
}

function ProductPage() {
	const { productId } = Route.useParams();
	// Selected from the list query, so a background refetch updates this page
	// and the related products together.
	const { data: product } = useSuspenseQuery({
		...productsQueryOptions(),
		select: (products) => findProduct(products, productId),
	});
	// The loader already rejects unknown slugs; this covers a product removed
	// from Strapi while the page is open and the query refetches.
	if (!product) return <ProductNotFound />;
	// Keyed so the quantity resets when moving between products.
	return <ProductDetail key={product.id} product={product} />;
}
