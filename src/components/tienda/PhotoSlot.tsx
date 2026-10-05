import { Icon, type IconName } from "#/components/ds/Icon";
import type { Product } from "#/data/catalog";

export interface PhotoSlotProps {
	icon?: IconName;
	label?: string;
	style?: React.CSSProperties;
}

// Honest placeholder for product photos we don't have yet.
export function PhotoSlot({
	icon = "box",
	label = "Foto del producto",
	style,
}: PhotoSlotProps) {
	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 10,
				color: "var(--tide-200)",
				background:
					"radial-gradient(90% 80% at 30% 20%, var(--abyss-600), var(--abyss-900))",
				...style,
			}}
		>
			<Icon name={icon} size={40} strokeWidth={1.25} />
			<span
				style={{
					font: "500 11px/1 var(--font-mono)",
					letterSpacing: ".08em",
					textTransform: "uppercase",
					color: "var(--text-faint)",
				}}
			>
				{label}
			</span>
		</div>
	);
}

/** Placeholder for a ProductCard's photo area when the product has no image. */
export const productMedia = (product: Pick<Product, "img" | "icon">) =>
	product.img ? undefined : <PhotoSlot icon={product.icon} />;
