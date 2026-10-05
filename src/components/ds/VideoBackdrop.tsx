import { useEffect, useRef } from "react";

const SCRIMS = {
	full: "var(--scrim-full)",
	bottom: "var(--scrim-bottom)",
	top: "var(--scrim-top)",
	none: "none",
};

export interface VideoBackdropProps {
	src?: string;
	/** Shown until the video loads, or on its own when there is no `src`. */
	poster?: string;
	scrim?: keyof typeof SCRIMS;
	/** Opacity of the flat dark overlay, 0–1. */
	dim?: number;
	/** Blur radius in pixels. */
	blur?: number;
	/** Pin to the viewport instead of the nearest positioned ancestor. */
	fixed?: boolean;
	scale?: number;
	children?: React.ReactNode;
	style?: React.CSSProperties;
}

export function VideoBackdrop({
	src,
	poster,
	scrim = "full",
	dim = 0.15,
	blur = 0,
	fixed = false,
	scale = 1.08,
	children,
	style,
}: VideoBackdropProps) {
	const ref = useRef<HTMLVideoElement>(null);
	// biome-ignore lint/correctness/useExhaustiveDependencies: restart playback whenever the source changes
	useEffect(() => {
		const v = ref.current;
		if (!v) return;
		v.muted = true;
		const p = v.play?.();
		if (p?.catch) p.catch(() => {});
	}, [src]);
	return (
		<div
			aria-hidden="true"
			style={{
				position: fixed ? "fixed" : "absolute",
				inset: 0,
				overflow: "hidden",
				zIndex: 0,
				pointerEvents: "none",
				background:
					"radial-gradient(120% 80% at 50% 0%, var(--abyss-600) 0%, var(--abyss-800) 45%, var(--abyss-950) 100%)",
				...style,
			}}
		>
			{src && (
				<video
					ref={ref}
					src={src}
					poster={poster}
					autoPlay
					muted
					loop
					playsInline
					preload="auto"
					style={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						objectFit: "cover",
						transform: `scale(${scale})`,
						filter: blur ? `blur(${blur}px)` : undefined,
					}}
				/>
			)}
			{!src && poster && (
				<img
					src={poster}
					alt=""
					style={{
						position: "absolute",
						inset: 0,
						width: "100%",
						height: "100%",
						objectFit: "cover",
						transform: `scale(${scale})`,
					}}
				/>
			)}
			{dim > 0 && (
				<div
					style={{
						position: "absolute",
						inset: 0,
						background: `rgba(2,9,13,${dim})`,
					}}
				/>
			)}
			{scrim !== "none" && (
				<div
					style={{ position: "absolute", inset: 0, background: SCRIMS[scrim] }}
				/>
			)}
			{children}
		</div>
	);
}
