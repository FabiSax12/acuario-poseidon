const INTENSITY = {
	whisper: ["var(--glass-tint-1)", "var(--glass-filter)"],
	default: ["var(--glass-tint-2)", "var(--glass-filter)"],
	strong: ["var(--glass-tint-3)", "var(--glass-filter-strong)"],
	smoked: ["var(--glass-tint-dark)", "var(--glass-filter-strong)"],
} as const;
const GLOW = {
	tide: "var(--glow-tide)",
	coral: "var(--glow-coral)",
	bronze: "var(--glow-bronze)",
};

export interface GlassPanelProps extends React.HTMLAttributes<HTMLElement> {
	as?: React.ElementType;
	intensity?: keyof typeof INTENSITY;
	radius?: number | string;
	padding?: number | string;
	glow?: keyof typeof GLOW;
}

export function GlassPanel({
	as = "div",
	intensity = "default",
	radius = "var(--radius-panel)",
	padding = "var(--space-8)",
	glow,
	children,
	style,
	...rest
}: GlassPanelProps) {
	const [bg, filter] = INTENSITY[intensity] || INTENSITY.default;
	const Tag = as;
	return (
		<Tag
			style={{
				position: "relative",
				background: bg,
				border: "1px solid var(--glass-stroke)",
				borderRadius: radius,
				padding,
				boxSizing: "border-box",
				boxShadow: [
					"var(--glass-highlight)",
					"var(--shadow-3)",
					glow && GLOW[glow],
				]
					.filter(Boolean)
					.join(","),
				backdropFilter: filter,
				WebkitBackdropFilter: filter,
				color: "var(--text-body)",
				...style,
			}}
			{...rest}
		>
			{children}
		</Tag>
	);
}
