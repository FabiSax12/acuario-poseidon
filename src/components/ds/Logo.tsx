import { LOGO_MARK_URI } from "./logoData";

const TONES = {
	white: "var(--pearl-0)",
	abyss: "var(--abyss-900)",
	aqua: "var(--tide-300)",
	bronze: "var(--bronze-400)",
};

export interface LogoProps {
	variant?: "horizontal" | "stacked" | "mark";
	/** A named tone, or any CSS colour. */
	tone?: keyof typeof TONES | (string & {});
	/** Height of the mark in pixels; the wordmark scales with it. */
	size?: number;
	style?: React.CSSProperties;
}

export function Logo({
	variant = "horizontal",
	tone = "white",
	size = 40,
	style,
}: LogoProps) {
	const c = tone in TONES ? TONES[tone as keyof typeof TONES] : tone;
	const mask: React.CSSProperties = {
		WebkitMaskImage: `url(${LOGO_MARK_URI})`,
		maskImage: `url(${LOGO_MARK_URI})`,
		WebkitMaskSize: "contain",
		maskSize: "contain",
		WebkitMaskRepeat: "no-repeat",
		maskRepeat: "no-repeat",
		WebkitMaskPosition: "center",
		maskPosition: "center",
	};
	const mark = (
		<span
			aria-hidden="true"
			style={{
				display: "block",
				width: size * 0.667,
				height: size,
				flexShrink: 0,
				background: c,
				...mask,
			}}
		/>
	);
	if (variant === "mark")
		return (
			<span
				role="img"
				aria-label="Acuario Poseidón"
				style={{ display: "inline-flex", ...style }}
			>
				{mark}
			</span>
		);
	const stacked = variant === "stacked";
	const word = stacked ? size * 0.36 : size * 0.5;
	return (
		<span
			role="img"
			aria-label="Acuario Poseidón"
			style={{
				display: "inline-flex",
				flexDirection: stacked ? "column" : "row",
				alignItems: "center",
				gap: stacked ? size * 0.16 : size * 0.26,
				color: c,
				...style,
			}}
		>
			{mark}
			<span
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: stacked ? "center" : "flex-start",
					lineHeight: 1,
				}}
			>
				<span
					style={{
						fontFamily: "var(--font-sans)",
						fontWeight: 600,
						fontSize: word * 0.36,
						letterSpacing: "0.46em",
						textTransform: "uppercase",
						opacity: 0.78,
						marginBottom: word * 0.16,
						paddingLeft: stacked ? "0.46em" : 0,
					}}
				>
					Acuario
				</span>
				<span
					style={{
						fontFamily: "var(--font-display)",
						fontSize: word,
						letterSpacing: "0.08em",
						whiteSpace: "nowrap",
					}}
				>
					POSEIDÓN
				</span>
			</span>
		</span>
	);
}
