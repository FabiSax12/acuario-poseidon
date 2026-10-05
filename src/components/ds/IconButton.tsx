import { useState } from "react";
import { Icon, type IconName } from "./Icon";

const SIZES = { sm: [36, 16], md: [44, 20], lg: [56, 24] } as const;

export interface IconButtonProps {
	icon: IconName | React.ReactElement;
	/** Accessible name, also shown as the native tooltip. */
	label: string;
	variant?: "glass" | "solid" | "ghost";
	size?: keyof typeof SIZES;
	/** Counter bubble; hidden when null or 0. */
	badge?: number | string | null;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	style?: React.CSSProperties;
}

export function IconButton({
	icon,
	label,
	variant = "glass",
	size = "md",
	badge,
	onClick,
	disabled,
	style,
}: IconButtonProps) {
	const [hover, setHover] = useState(false);
	const [d, is] = SIZES[size] || SIZES.md;
	const V = {
		glass: {
			bg: hover ? "var(--glass-tint-3)" : "var(--glass-tint-2)",
			fg: "var(--text-strong)",
			border: "1px solid var(--glass-stroke)",
			glass: true,
		},
		solid: {
			bg: hover ? "var(--tide-300)" : "var(--tide-400)",
			fg: "var(--abyss-950)",
			border: "1px solid transparent",
			glass: false,
		},
		ghost: {
			bg: hover ? "rgba(255,255,255,.08)" : "transparent",
			fg: "var(--text-body)",
			border: "1px solid transparent",
			glass: false,
		},
	}[variant];
	return (
		<button
			type="button"
			aria-label={label}
			title={label}
			onClick={onClick}
			disabled={disabled}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				position: "relative",
				width: d,
				height: d,
				flexShrink: 0,
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: "50%",
				padding: 0,
				background: V.bg,
				color: V.fg,
				border: V.border,
				boxShadow: V.glass ? "var(--glass-highlight)" : "none",
				cursor: disabled ? "not-allowed" : "pointer",
				opacity: disabled ? 0.42 : 1,
				backdropFilter: V.glass ? "var(--glass-filter)" : undefined,
				WebkitBackdropFilter: V.glass ? "var(--glass-filter)" : undefined,
				transition: "background var(--dur-fast) var(--ease-current)",
				...style,
			}}
		>
			{typeof icon === "string" ? <Icon name={icon} size={is} /> : icon}
			{badge != null && badge !== 0 && (
				<span
					style={{
						position: "absolute",
						top: -3,
						right: -3,
						minWidth: 20,
						height: 20,
						padding: "0 5px",
						boxSizing: "border-box",
						borderRadius: 999,
						background: "var(--coral-400)",
						color: "var(--abyss-950)",
						font: "700 11px/20px var(--font-sans)",
						textAlign: "center",
						boxShadow: "0 0 0 2px var(--abyss-900)",
					}}
				>
					{badge}
				</span>
			)}
		</button>
	);
}
