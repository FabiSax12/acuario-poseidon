import { createFileRoute, notFound } from "@tanstack/react-router";
import { NotFound } from "#/components/tienda/NotFound";
import { ProductDetail } from "#/components/tienda/ProductDetail";
import { findProduct } from "#/data/catalog";

export const Route = createFileRoute("/tienda/$productId")({
	loader: ({ params }) => {
		const product = findProduct(params.productId);
		if (!product) throw notFound();
		return { product };
	},
	component: ProductPage,
	notFoundComponent: () => (
		<NotFound
			title="Producto no encontrado"
			message="No tenemos ese producto en el catálogo. Puede que ya no esté disponible."
		/>
	),
});

function ProductPage() {
	const { product } = Route.useLoaderData();
	// Keyed so the quantity resets when moving between products.
	return <ProductDetail key={product.id} product={product} />;
}
