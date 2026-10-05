import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "#/components/ds/ProductCard";
import { Reveal } from "#/components/ds/Reveal";
import { Select } from "#/components/ds/Select";
import { Switch } from "#/components/ds/Switch";
import { Tabs } from "#/components/ds/Tabs";
import { Tag } from "#/components/ds/Tag";
import type { WaterType } from "#/data/catalog";
import { productsQueryOptions } from "#/data/queries/products";
import {
	countByCategory,
	filterProducts,
	SHOP_CATEGORIES,
	type ShopCategory,
	SORT_OPTIONS,
	type SortOption,
	WATER_TYPES,
} from "#/lib/shop";
import { productMedia } from "./PhotoSlot";
import { useStore } from "./StoreProvider";

export function Shop() {
	const navigate = useNavigate();
	const { add } = useStore();
	const { data: products } = useSuspenseQuery(productsQueryOptions());
	const [cat, setCat] = useState<ShopCategory>("Todo");
	const [water, setWater] = useState<WaterType | null>(null);
	const [beginner, setBeginner] = useState(false);
	const [inStock, setInStock] = useState(false);
	const [sort, setSort] = useState<SortOption>("Relevancia");
	const items = filterProducts(products, {
		category: cat,
		water,
		beginner,
		inStock,
		sort,
	});
	return (
		<section
			data-screen-label="Tienda"
			style={{
				maxWidth: "var(--container-max)",
				margin: "0 auto",
				padding: "140px var(--gutter) 120px",
				position: "relative",
			}}
		>
			<div className="pos-overline">Tienda</div>
			<h1
				style={{
					font: "400 var(--fs-display-md)/1.02 var(--font-display)",
					margin: "12px 0 28px",
				}}
			>
				Todo para tu acuario
			</h1>
			<Tabs
				items={SHOP_CATEGORIES.map((c) => ({
					value: c,
					label: c,
					count: countByCategory(products, c),
				}))}
				value={cat}
				onChange={setCat}
			/>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 16,
					flexWrap: "wrap",
					margin: "20px 0 32px",
				}}
			>
				<div
					style={{
						display: "flex",
						gap: 8,
						flexWrap: "wrap",
						alignItems: "center",
					}}
				>
					{WATER_TYPES.map((w) => (
						<Tag
							key={w}
							icon="droplet"
							selected={water === w}
							onClick={() => setWater(water === w ? null : w)}
						>
							{w}
						</Tag>
					))}
					<Tag
						icon="sprout"
						selected={beginner}
						onClick={() => setBeginner(!beginner)}
					>
						Para principiantes
					</Tag>
					<Switch
						label="Solo en stock"
						checked={inStock}
						onChange={setInStock}
						style={{ marginLeft: 8 }}
					/>
				</div>
				<Select
					aria-label="Ordenar"
					value={sort}
					onChange={(e) => setSort(e.target.value as SortOption)}
					options={SORT_OPTIONS}
					style={{ width: 240 }}
				/>
			</div>
			{items.length === 0 && (
				<p style={{ color: "var(--text-muted)", padding: "48px 0" }}>
					No hay productos con estos filtros. Prueba quitando alguno.
				</p>
			)}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
					gap: 20,
				}}
			>
				{items.map((p, i) => (
					<Reveal
						key={p.id + cat}
						delay={(i % 4) * 70}
						style={{ height: "100%" }}
					>
						<ProductCard
							image={p.image}
							media={productMedia(p)}
							name={p.name}
							subtitle={p.latin}
							price={p.price}
							compareAt={p.compareAt}
							badge={!p.stock ? { label: "Agotado", tone: "neutral" } : p.badge}
							specs={p.specs}
							onAdd={p.stock ? () => add(p) : undefined}
							onClick={() =>
								navigate({
									to: "/tienda/$productId",
									params: { productId: p.id },
								})
							}
							style={{ height: "100%", boxSizing: "border-box" }}
						/>
					</Reveal>
				))}
			</div>
		</section>
	);
}
