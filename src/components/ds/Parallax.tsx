import { useEffect, useRef } from "react";

export interface ParallaxProps {
	/** Fraction of the scroll distance to travel; negative moves against it. */
	speed?: number;
	axis?: "x" | "y";
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export function Parallax({
	speed = 0.3,
	axis = "y",
	children,
	className,
	style,
}: ParallaxProps) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
		let raf = 0;
		const update = () => {
			raf = 0;
			const r = el.parentElement
				? el.parentElement.getBoundingClientRect()
				: el.getBoundingClientRect();
			const vh = window.innerHeight;
			const center = r.top + r.height / 2 - vh / 2;
			const d = -center * speed;
			el.style.transform =
				axis === "x" ? `translate3d(${d}px,0,0)` : `translate3d(0,${d}px,0)`;
		};
		const on = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		update();
		document.addEventListener("scroll", on, { capture: true, passive: true });
		window.addEventListener("resize", on);
		return () => {
			document.removeEventListener("scroll", on, { capture: true });
			window.removeEventListener("resize", on);
			cancelAnimationFrame(raf);
		};
	}, [speed, axis]);
	return (
		<div
			ref={ref}
			className={className}
			style={{ willChange: "transform", ...style }}
		>
			{children}
		</div>
	);
}
