import { useState } from "react";
import { Icon, type IconName } from "./Icon";

const SIZES = {
	sm: { px: 16, fs: 14, gap: 6, icon: 16 },
	md: { px: 22, fs: 15, gap: 8, icon: 18 },
	lg: { px: 30, fs: 17, gap: 10, icon: 20 },
};
// Height as classes so `sm` can grow to the 44px touch minimum; it only drops
// to its 36px design size on wide screens without a touch pointer.
const HEIGHT = {
	sm: "h-11 lg:not-pointer-coarse:h-9",
	md: "h-11",
	lg: "h-14",
};
const VARIANTS = {
	primary: {
		bg: "var(--tide-400)",
		hover: "var(--tide-300)",
		fg: "var(--abyss-950)",
		border: "transparent",
		shadow: "var(--glow-tide)",
		glass: false,
	},
	glass: {
		bg: "var(--glass-tint-2)",
		hover: "var(--glass-tint-3)",
		fg: "var(--text-strong)",
		border: "var(--glass-stroke)",
		shadow: "var(--glass-highlight)",
		glass: true,
	},
	pearl: {
		bg: "var(--pearl-0)",
		hover: "var(--pearl-100)",
		fg: "var(--abyss-900)",
		border: "transparent",
		shadow: "var(--shadow-2)",
		glass: false,
	},
	coral: {
		bg: "var(--coral-400)",
		hover: "var(--coral-300)",
		fg: "var(--abyss-950)",
		border: "transparent",
		shadow: "var(--glow-coral)",
		glass: false,
	},
	ghost: {
		bg: "transparent",
		hover: "rgba(63,211,198,.12)",
		fg: "var(--tide-300)",
		border: "transparent",
		shadow: "none",
		glass: false,
	},
};

type ButtonIcon = IconName | React.ReactElement;

const ico = (i: ButtonIcon | undefined, s: number) =>
	typeof i === "string" ? <Icon name={i} size={s} /> : i;

export interface ButtonProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "onClick"> {
	variant?: keyof typeof VARIANTS;
	size?: keyof typeof SIZES;
	iconLeft?: ButtonIcon;
	iconRight?: ButtonIcon;
	/** Stretch to the full width of the container. */
	full?: boolean;
	disabled?: boolean;
	/** Renders an anchor instead of a button. */
	href?: string;
	onClick?: React.MouseEventHandler<HTMLElement>;
	type?: "button" | "submit" | "reset";
}

export function Button({
	children,
	variant = "primary",
	size = "md",
	iconLeft,
	iconRight,
	full,
	disabled,
	href,
	onClick,
	type = "button",
	className,
	style,
	...rest
}: ButtonProps) {
	const [hover, setHover] = useState(false);
	const [down, setDown] = useState(false);
	const s = SIZES[size] || SIZES.md;
	const v = VARIANTS[variant] || VARIANTS.primary;
	const height = HEIGHT[size] || HEIGHT.md;
	const Tag: React.ElementType = href ? "a" : "button";
	return (
		<Tag
			href={href}
			type={href ? undefined : type}
			onClick={disabled ? undefined : onClick}
			disabled={href ? undefined : disabled}
			aria-disabled={disabled || undefined}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => {
				setHover(false);
				setDown(false);
			}}
			onMouseDown={() => setDown(true)}
			onMouseUp={() => setDown(false)}
			className={className ? `${height} ${className}` : height}
			style={{
				display: full ? "flex" : "inline-flex",
				width: full ? "100%" : undefined,
				alignItems: "center",
				justifyContent: "center",
				gap: s.gap,
				padding: `0 ${s.px}px`,
				fontFamily: "var(--font-sans)",
				fontWeight: 600,
				fontSize: s.fs,
				letterSpacing: "var(--tracking-ui)",
				lineHeight: 1,
				whiteSpace: "nowrap",
				textDecoration: "none",
				color: v.fg,
				background: hover && !disabled ? v.hover : v.bg,
				border: `1px solid ${v.border}`,
				borderRadius: "var(--radius-pill)",
				boxShadow: v.shadow,
				backdropFilter: v.glass ? "var(--glass-filter)" : undefined,
				WebkitBackdropFilter: v.glass ? "var(--glass-filter)" : undefined,
				cursor: disabled ? "not-allowed" : "pointer",
				opacity: disabled ? 0.42 : 1,
				transform: down && !disabled ? "scale(.97)" : "none",
				transition:
					"background var(--dur-fast) var(--ease-current), transform var(--dur-instant) var(--ease-current), box-shadow var(--dur-fast)",
				...style,
			}}
			{...rest}
		>
			{ico(iconLeft, s.icon)}
			{children}
			{ico(iconRight, s.icon)}
		</Tag>
	);
}
