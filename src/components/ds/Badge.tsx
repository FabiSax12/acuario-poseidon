import { Icon, type IconName } from "./Icon";

const TONES = {
	tide: ["var(--tide-400)", "rgba(63,211,198,.16)", "var(--tide-200)"],
	coral: ["var(--coral-400)", "rgba(255,138,104,.18)", "var(--coral-200)"],
	bronze: ["var(--bronze-400)", "rgba(217,180,106,.18)", "var(--bronze-200)"],
	kelp: ["var(--kelp-400)", "rgba(79,209,139,.16)", "#b9f0d1"],
	neutral: ["var(--pearl-100)", "rgba(255,255,255,.12)", "var(--pearl-100)"],
} as const;

export type BadgeTone = keyof typeof TONES;
export type BadgeVariant = "soft" | "solid";

export interface BadgeProps {
	children?: React.ReactNode;
	tone?: BadgeTone;
	variant?: BadgeVariant;
	icon?: IconName;
	dot?: boolean;
	style?: React.CSSProperties;
}

export function Badge({
	children,
	tone = "tide",
	variant = "soft",
	icon,
	dot,
	style,
}: BadgeProps) {
	const [solid, soft, text] = TONES[tone] || TONES.tide;
	const isSolid = variant === "solid";
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 5,
				height: 24,
				padding: "0 10px",
				borderRadius: "var(--radius-pill)",
				boxSizing: "border-box",
				background: isSolid ? solid : soft,
				color: isSolid ? "var(--abyss-950)" : text,
				border: isSolid ? "none" : `1px solid ${soft}`,
				font: "600 11px/1 var(--font-sans)",
				letterSpacing: ".08em",
				textTransform: "uppercase",
				whiteSpace: "nowrap",
				backdropFilter: isSolid ? undefined : "blur(8px)",
				WebkitBackdropFilter: isSolid ? undefined : "blur(8px)",
				...style,
			}}
		>
			{dot && (
				<span
					style={{
						width: 6,
						height: 6,
						borderRadius: "50%",
						background: isSolid ? "var(--abyss-950)" : solid,
					}}
				/>
			)}
			{icon && <Icon name={icon} size={13} strokeWidth={2} />}
			{children}
		</span>
	);
}
