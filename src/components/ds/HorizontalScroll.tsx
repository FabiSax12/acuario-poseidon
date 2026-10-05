import { useEffect, useRef, useState } from "react";

export interface HorizontalScrollProps {
	children?: React.ReactNode;
	/** Rendered above the track, inside the pinned viewport. */
	header?: React.ReactNode;
	gap?: number;
	padding?: number | string;
	/** Height of the pinned viewport (CSS length). */
	height?: string;
	style?: React.CSSProperties;
}

export function HorizontalScroll({
	children,
	header,
	gap = 24,
	padding = "var(--gutter)",
	height = "100vh",
	style,
}: HorizontalScrollProps) {
	const outer = useRef<HTMLElement>(null);
	const track = useRef<HTMLDivElement>(null);
	const [dist, setDist] = useState(0);
	const [x, setX] = useState(0);
	useEffect(() => {
		const measure = () => {
			if (track.current?.parentElement)
				setDist(
					Math.max(
						0,
						track.current.scrollWidth - track.current.parentElement.clientWidth,
					),
				);
		};
		measure();
		const ro = new ResizeObserver(measure);
		if (track.current) ro.observe(track.current);
		let raf = 0;
		const on = () => {
			if (raf) return;
			raf = requestAnimationFrame(() => {
				raf = 0;
				const el = outer.current;
				if (!el) return;
				const r = el.getBoundingClientRect();
				const total = r.height - window.innerHeight;
				const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
				setX(p);
			});
		};
		on();
		document.addEventListener("scroll", on, { capture: true, passive: true });
		window.addEventListener("resize", on);
		return () => {
			ro.disconnect();
			document.removeEventListener("scroll", on, { capture: true });
			window.removeEventListener("resize", on);
			cancelAnimationFrame(raf);
		};
	}, []);
	const pad = typeof padding === "number" ? `${padding}px` : padding;
	return (
		<section
			ref={outer}
			style={{
				position: "relative",
				height: `calc(${height} + ${dist}px)`,
				...style,
			}}
		>
			<div
				style={{
					position: "sticky",
					top: 0,
					height,
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					gap: 32,
				}}
			>
				{header && <div style={{ padding: `0 ${pad}` }}>{header}</div>}
				<div style={{ overflow: "visible" }}>
					<div
						ref={track}
						style={{
							display: "flex",
							gap,
							padding: `0 ${pad}`,
							width: "max-content",
							transform: `translate3d(${-x * dist}px,0,0)`,
							willChange: "transform",
						}}
					>
						{children}
					</div>
				</div>
				<div
					aria-hidden="true"
					style={{
						margin: `0 ${pad}`,
						height: 2,
						borderRadius: 2,
						background: "rgba(255,255,255,.12)",
						overflow: "hidden",
					}}
				>
					<div
						style={{
							width: `${x * 100}%`,
							height: "100%",
							background: "var(--tide-300)",
						}}
					/>
				</div>
			</div>
		</section>
	);
}
