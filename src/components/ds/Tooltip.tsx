import { useState } from "react";

export interface TooltipProps {
	content: React.ReactNode;
	side?: "top" | "bottom";
	children?: React.ReactNode;
	style?: React.CSSProperties;
}

export function Tooltip({
	content,
	side = "top",
	children,
	style,
}: TooltipProps) {
	const [open, setOpen] = useState(false);
	const top = side === "top";
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: wrapper only tracks hover and focus of its child
		<span
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
			onFocus={() => setOpen(true)}
			onBlur={() => setOpen(false)}
			style={{ position: "relative", display: "inline-flex", ...style }}
		>
			{children}
			<span
				role="tooltip"
				// Wraps on narrow screens, where a one-line tip would run off the
				// viewport; a single line again once there is room for it.
				className="w-max max-w-[min(260px,calc(100vw-2*var(--gutter)))] whitespace-normal max-lg:leading-[1.35]! lg:max-w-none lg:whitespace-nowrap"
				style={{
					position: "absolute",
					left: "50%",
					[top ? "bottom" : "top"]: "calc(100% + 10px)",
					transform: `translateX(-50%) translateY(${open ? 0 : top ? 4 : -4}px)`,
					opacity: open ? 1 : 0,
					pointerEvents: "none",
					padding: "8px 12px",
					borderRadius: 10,
					font: "500 13px/1.2 var(--font-sans)",
					color: "var(--text-strong)",
					background: "rgba(6,24,34,.78)",
					border: "1px solid var(--glass-stroke)",
					boxShadow: "var(--shadow-2)",
					backdropFilter: "blur(14px)",
					WebkitBackdropFilter: "blur(14px)",
					transition:
						"opacity var(--dur-fast) var(--ease-current), transform var(--dur-fast) var(--ease-current)",
					zIndex: 20,
				}}
			>
				{content}
			</span>
		</span>
	);
}
