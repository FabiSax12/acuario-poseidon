export interface RangeSliderProps {
	label?: string;
	value?: number;
	min?: number;
	max?: number;
	step?: number;
	/** Appended to the value readout, e.g. "cm". */
	unit?: string;
	onChange?: (value: number) => void;
	/** Overrides the value readout entirely. */
	format?: (value: number) => React.ReactNode;
	style?: React.CSSProperties;
}

export function RangeSlider({
	label,
	value = 0,
	min = 0,
	max = 100,
	step = 1,
	unit,
	onChange,
	format,
	style,
}: RangeSliderProps) {
	const pct = ((value - min) / (max - min)) * 100;
	const shown = format ? format(value) : value + (unit ? ` ${unit}` : "");
	return (
		<div
			style={{ display: "flex", flexDirection: "column", gap: 10, ...style }}
		>
			{label && (
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "baseline",
					}}
				>
					<span
						style={{
							font: "600 13px/1.2 var(--font-sans)",
							color: "var(--text-body)",
						}}
					>
						{label}
					</span>
					<span
						style={{
							font: "500 15px/1 var(--font-mono)",
							color: "var(--tide-300)",
						}}
					>
						{shown}
					</span>
				</div>
			)}
			<div style={{ position: "relative", height: 28 }}>
				<div
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						top: 12,
						height: 4,
						borderRadius: 4,
						background: "rgba(255,255,255,.14)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: 0,
						width: `${pct}%`,
						top: 12,
						height: 4,
						borderRadius: 4,
						background:
							"linear-gradient(90deg,var(--tide-600),var(--tide-300))",
					}}
				/>
				<div
					style={{
						position: "absolute",
						left: `calc(${pct}% - 14px)`,
						top: 0,
						width: 28,
						height: 28,
						borderRadius: "50%",
						background: "var(--pearl-0)",
						boxShadow: "0 0 0 6px rgba(63,211,198,.22), var(--shadow-2)",
						pointerEvents: "none",
					}}
				/>
				<input
					type="range"
					aria-label={label}
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={(e) => onChange?.(Number(e.target.value))}
					style={{
						position: "absolute",
						inset: "-8px 0",
						width: "100%",
						height: 44,
						margin: 0,
						opacity: 0,
						cursor: "pointer",
					}}
				/>
			</div>
		</div>
	);
}
