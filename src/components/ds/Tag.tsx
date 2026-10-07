import { useState } from "react";
import { Icon, type IconName } from "./Icon";

export interface TagProps {
	children?: React.ReactNode;
	selected?: boolean;
	/** Makes the tag a toggle button (mouse and keyboard). */
	onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
	/** Adds a remove button inside the tag. */
	onRemove?: (event: React.MouseEvent) => void;
	icon?: IconName;
	style?: React.CSSProperties;
}

export function Tag({
	children,
	selected,
	onClick,
	onRemove,
	icon,
	style,
}: TagProps) {
	const [hover, setHover] = useState(false);
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: gets role="button" and key handling when clickable; markup kept as in the design system source (fidelity port)
		// biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-pressed is only set together with role="button"
		<span
			role={onClick ? "button" : undefined}
			tabIndex={onClick ? 0 : undefined}
			aria-pressed={onClick ? !!selected : undefined}
			onClick={onClick}
			onKeyDown={(e) => {
				if (onClick && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault();
					onClick(e);
				}
			}}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className="h-11 lg:not-pointer-coarse:h-10"
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 8,
				padding: onRemove ? "0 8px 0 16px" : "0 16px",
				boxSizing: "border-box",
				borderRadius: "var(--radius-pill)",
				font: "500 14px/1 var(--font-sans)",
				cursor: onClick ? "pointer" : "default",
				userSelect: "none",
				whiteSpace: "nowrap",
				color: selected ? "var(--abyss-950)" : "var(--text-strong)",
				background: selected
					? "var(--tide-300)"
					: hover
						? "var(--glass-tint-3)"
						: "var(--glass-tint-2)",
				border: `1px solid ${selected ? "transparent" : "var(--glass-stroke)"}`,
				backdropFilter: "var(--glass-filter)",
				WebkitBackdropFilter: "var(--glass-filter)",
				transition:
					"background var(--dur-fast) var(--ease-current), color var(--dur-fast)",
				...style,
			}}
		>
			{icon && <Icon name={icon} size={16} />}
			{children}
			{onRemove && (
				<button
					type="button"
					aria-label="Quitar"
					onClick={(e) => {
						e.stopPropagation();
						onRemove(e);
					}}
					style={{
						width: 26,
						height: 26,
						borderRadius: "50%",
						border: 0,
						padding: 0,
						display: "grid",
						placeItems: "center",
						background: "rgba(255,255,255,.12)",
						color: "inherit",
						cursor: "pointer",
					}}
				>
					<Icon name="x" size={14} />
				</button>
			)}
		</span>
	);
}
