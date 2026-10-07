import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "#/components/ds/Badge";
import { Button } from "#/components/ds/Button";
import { GlassPanel } from "#/components/ds/GlassPanel";
import { Icon, type IconName } from "#/components/ds/Icon";
import { ProductCard } from "#/components/ds/ProductCard";
import { QuantityStepper } from "#/components/ds/QuantityStepper";
import { Tooltip } from "#/components/ds/Tooltip";
import type { Product } from "#/data/catalog";
import { productsQueryOptions } from "#/data/queries/products";
import { money } from "#/lib/money";
import { PhotoSlot, productMedia } from "./PhotoSlot";
import { useStore } from "./StoreProvider";

type CareSpec = [
	icon: IconName,
	label: string,
	value: string | undefined,
	tip: string,
];

export function ProductDetail({ product: p }: { product: Product }) {
	const navigate = useNavigate();
	const { add } = useStore();
	const [qty, setQty] = useState(1);
	const { data: products } = useSuspenseQuery(productsQueryOptions());
	const related = products
		.filter((x) => x.cat === p.cat && x.id !== p.id)
		.slice(0, 3);
	const specs: CareSpec[] = p.temp
		? [
				[
					"thermometer",
					"Temperatura",
					p.temp,
					"Mantén el agua estable con un calentador",
				],
				[
					"flask-conical",
					"pH",
					p.ph,
					"Mídelo una vez por semana con el kit de test",
				],
				[
					"ruler",
					"Tamaño adulto",
					p.size,
					"Calcula el acuario según el tamaño adulto, no el de compra",
				],
				[
					"fish",
					"Convivencia",
					p.mates,
					"Pregúntanos antes de mezclar especies",
				],
			]
		: [];
	return (
		<section
			data-screen-label="Producto"
			className="px-[var(--gutter)] pt-[112px] pb-[72px] lg:pt-[130px] lg:pb-[100px]"
			style={{
				maxWidth: "var(--container-max)",
				margin: "0 auto",
			}}
		>
			<Link
				to="/tienda"
				style={{
					display: "inline-flex",
					alignItems: "center",
					gap: 6,
					height: 44,
					padding: 0,
					background: "none",
					border: 0,
					color: "var(--tide-300)",
					font: "500 15px/1 var(--font-sans)",
					cursor: "pointer",
				}}
			>
				<Icon name="chevron-left" size={18} />
				Volver a la tienda
			</Link>
			<div
				className="grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10"
				style={{
					display: "grid",
					marginTop: 12,
					alignItems: "start",
				}}
			>
				<GlassPanel padding={12} radius={32}>
					<div
						style={{
							position: "relative",
							aspectRatio: "4/3",
							borderRadius: 22,
							overflow: "hidden",
						}}
					>
						{p.image ? (
							<div
								style={{
									position: "absolute",
									inset: 0,
									background: `url("${p.image}") center/cover`,
								}}
							/>
						) : (
							<PhotoSlot icon={p.icon} />
						)}
					</div>
				</GlassPanel>
				<div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
					<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
						{p.stock ? (
							<Badge tone="kelp" dot>
								En stock
							</Badge>
						) : (
							<Badge tone="neutral">Agotado</Badge>
						)}
						{p.water && (
							<Badge tone="neutral" icon="droplet">
								{p.water}
							</Badge>
						)}
						{p.badge && <Badge tone={p.badge.tone}>{p.badge.label}</Badge>}
					</div>
					<div>
						<h1
							style={{
								font: "var(--type-h1)",
								// 52px by design, reached at 1024px.
								fontSize: "clamp(34px, 5.1vw, 52px)",
								overflowWrap: "break-word",
							}}
						>
							{p.name}
						</h1>
						<p
							style={{
								font: "italic 400 18px/1.4 var(--font-sans)",
								color: "var(--text-muted)",
								marginTop: 6,
							}}
						>
							{p.latin}
						</p>
					</div>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							alignItems: "baseline",
							gap: 12,
						}}
					>
						<span
							style={{ font: "500 36px/1 var(--font-mono)", color: "#fff" }}
						>
							{money(p.price)}
						</span>
						{p.compareAt && (
							<s
								style={{
									font: "400 18px/1 var(--font-mono)",
									color: "var(--text-faint)",
								}}
							>
								{money(p.compareAt)}
							</s>
						)}
					</div>
					{specs.length > 0 && (
						<GlassPanel
							intensity="whisper"
							padding={6}
							radius={20}
							className="grid-cols-1 sm:grid-cols-2"
							style={{ display: "grid" }}
						>
							{specs.map(([ic, l, v, tip]) => (
								<Tooltip key={l} content={tip} style={{ display: "flex" }}>
									<div
										// biome-ignore lint/a11y/noNoninteractiveTabindex: focusable so keyboard users can open the tooltip, as in the design
										tabIndex={0}
										style={{
											display: "flex",
											gap: 12,
											padding: 14,
											width: "100%",
										}}
									>
										<span style={{ color: "var(--tide-300)", marginTop: 2 }}>
											<Icon name={ic} size={20} />
										</span>
										<div style={{ minWidth: 0, overflowWrap: "break-word" }}>
											<div
												style={{
													font: "600 11px/1 var(--font-sans)",
													letterSpacing: ".12em",
													textTransform: "uppercase",
													color: "var(--text-faint)",
													marginBottom: 6,
												}}
											>
												{l}
											</div>
											<div
												style={{
													font:
														l === "Convivencia"
															? "400 14px/1.35 var(--font-sans)"
															: "500 16px/1 var(--font-mono)",
													color: "var(--text-strong)",
												}}
											>
												{v}
											</div>
										</div>
									</div>
								</Tooltip>
							))}
						</GlassPanel>
					)}
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: 12,
							alignItems: "center",
						}}
					>
						<QuantityStepper value={qty} onChange={setQty} max={20} />
						<Button
							size="lg"
							iconLeft="shopping-bag"
							disabled={!p.stock}
							onClick={() => add(p, qty)}
							style={{ flex: 1 }}
						>
							{p.stock ? "Añadir al carrito" : "Agotado"}
						</Button>
					</div>
					<div
						style={{
							display: "flex",
							gap: 12,
							alignItems: "flex-start",
							color: "var(--text-muted)",
							font: "400 14px/1.5 var(--font-sans)",
						}}
					>
						<span style={{ color: "var(--tide-300)" }}>
							<Icon name="hand-heart" size={20} />
						</span>
						Asesoría incluida: te explicamos cómo aclimatarlo y qué necesita
						para estar sano.
					</div>
				</div>
			</div>
			{related.length > 0 && (
				<div className="mt-14 lg:mt-20">
					<h2 style={{ font: "var(--type-h2)", marginBottom: 24 }}>
						También te puede interesar
					</h2>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
							gap: 20,
						}}
					>
						{related.map((r) => (
							<ProductCard
								key={r.id}
								image={r.image}
								media={productMedia(r)}
								name={r.name}
								subtitle={r.latin}
								price={r.price}
								specs={r.specs}
								badge={r.badge}
								onAdd={r.stock ? () => add(r) : undefined}
								onClick={() =>
									navigate({
										to: "/tienda/$productId",
										params: { productId: r.id },
									})
								}
							/>
						))}
					</div>
				</div>
			)}
		</section>
	);
}
