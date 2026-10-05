import { useEffect, useRef, useState } from "react";

export interface RevealProps {
	children?: React.ReactNode;
	/** Transition delay in milliseconds. */
	delay?: number;
	/** Initial vertical offset in pixels. */
	y?: number;
	as?: React.ElementType;
	style?: React.CSSProperties;
}

export function Reveal({
	children,
	delay = 0,
	y = 28,
	as = "div",
	style,
}: RevealProps) {
	const ref = useRef<HTMLElement>(null);
	const [vis, setVis] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (!("IntersectionObserver" in window)) {
			setVis(true);
			return;
		}
		const io = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setVis(true);
					io.disconnect();
				}
			},
			{ threshold: 0.15 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);
	const Tag = as;
	return (
		<Tag
			ref={ref}
			style={{
				opacity: vis ? 1 : 0,
				transform: vis ? "none" : `translateY(${y}px)`,
				filter: vis ? "none" : "blur(6px)",
				transition: `opacity var(--dur-drift) var(--ease-current) ${delay}ms, transform var(--dur-drift) var(--ease-current) ${delay}ms, filter var(--dur-slow) var(--ease-current) ${delay}ms`,
				...style,
			}}
		>
			{children}
		</Tag>
	);
}
