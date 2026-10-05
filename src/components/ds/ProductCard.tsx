import { useState } from "react";
import { Badge, type BadgeTone, type BadgeVariant } from "./Badge";
import { IconButton } from "./IconButton";

const money = (n: number, c: string) =>
	c +
	Number(n).toLocaleString("es", {
		minimumFractionDigits: n % 1 ? 2 : 0,
		maximumFractionDigits: 2,
	});

export interface ProductCardProps {
	/** Photo URL; ignored when `media` is given. */
	image?: string;
	/** Custom content for the photo area, e.g. a placeholder. */
	media?: React.ReactNode;
	name: string;
	subtitle?: string;
	price: number;
	/** Previous price, shown struck through. */
	compareAt?: number;
	currency?: string;
	badge?: { label: string; tone?: BadgeTone; variant?: BadgeVariant };
	specs?: readonly string[];
	/** The add button is only rendered when a handler is given. */
	onAdd?: (event: React.MouseEvent) => void;
	onClick?: React.MouseEventHandler<HTMLElement>;
	style?: React.CSSProperties;
}

export function ProductCard({
	image,
	media,
	name,
	subtitle,
	price,
	compareAt,
	currency = "$",
	badge,
	specs = [],
	onAdd,
	onClick,
	style,
}: ProductCardProps) {
	const [hover, setHover] = useState(false);
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: markup kept as in the design system source (fidelity port)
		<article
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={onClick}
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 14,
				padding: 10,
				borderRadius: "var(--radius-card)",
				cursor: onClick ? "pointer" : "default",
				background: hover ? "var(--glass-tint-3)" : "var(--glass-tint-2)",
				border: "1px solid var(--glass-stroke)",
				boxShadow: `var(--glass-highlight),${hover ? "var(--shadow-3)" : "var(--shadow-2)"}`,
				backdropFilter: "var(--glass-filter)",
				WebkitBackdropFilter: "var(--glass-filter)",
				transform: hover ? "translateY(-4px)" : "none",
				transition:
					"transform var(--dur-base) var(--ease-current), background var(--dur-base), box-shadow var(--dur-base)",
				...style,
			}}
		>
			<div
				style={{
					position: "relative",
					aspectRatio: "4 / 3",
					borderRadius: "calc(var(--radius-card) - 8px)",
					overflow: "hidden",
					background: "var(--abyss-800)",
				}}
			>
				{media}
				{!media && image && (
					<img
						src={image}
						alt=""
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							display: "block",
							transform: hover ? "scale(1.05)" : "scale(1)",
							transition: "transform var(--dur-slow) var(--ease-current)",
						}}
					/>
				)}
				{badge && (
					<span style={{ position: "absolute", top: 10, left: 10 }}>
						<Badge
							tone={badge.tone || "tide"}
							variant={badge.variant || "solid"}
						>
							{badge.label}
						</Badge>
					</span>
				)}
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 4,
					padding: "0 6px",
				}}
			>
				<h3
					style={{
						margin: 0,
						font: "600 17px/1.3 var(--font-sans)",
						color: "var(--text-strong)",
					}}
				>
					{name}
				</h3>
				{subtitle && (
					<p
						style={{
							margin: 0,
							font: "italic 400 14px/1.3 var(--font-sans)",
							color: "var(--text-muted)",
						}}
					>
						{subtitle}
					</p>
				)}
				{specs.length > 0 && (
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "4px 12px",
							marginTop: 6,
						}}
					>
						{specs.map((s) => (
							<span
								key={s}
								style={{
									font: "400 12px/1.4 var(--font-mono)",
									color: "var(--tide-200)",
								}}
							>
								{s}
							</span>
						))}
					</div>
				)}
			</div>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0 0 0 6px",
					marginTop: "auto",
				}}
			>
				<span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
					<span
						style={{ font: "var(--type-price)", color: "var(--text-strong)" }}
					>
						{money(price, currency)}
					</span>
					{compareAt && (
						<s
							style={{
								font: "400 13px/1 var(--font-mono)",
								color: "var(--text-faint)",
							}}
						>
							{money(compareAt, currency)}
						</s>
					)}
				</span>
				{onAdd && (
					<IconButton
						icon="plus"
						label={`Añadir ${name}`}
						variant="solid"
						onClick={(e) => {
							e.stopPropagation();
							onAdd(e);
						}}
					/>
				)}
			</div>
		</article>
	);
}
