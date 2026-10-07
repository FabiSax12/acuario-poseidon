import { Icon } from "./Icon";

export interface QuantityStepperProps {
	value?: number;
	min?: number;
	max?: number;
	onChange?: (value: number) => void;
	size?: "sm" | "md";
	style?: React.CSSProperties;
}

export function QuantityStepper({
	value = 1,
	min = 1,
	max = 99,
	onChange,
	size = "md",
	style,
}: QuantityStepperProps) {
	// `sm` keeps the 44px touch minimum and only shrinks to its 36px design
	// size on wide screens without a touch pointer.
	const sm = size === "sm";
	const height = sm ? "h-11 lg:not-pointer-coarse:h-9" : "h-11";
	const square = sm ? "size-11 lg:not-pointer-coarse:size-9" : "size-11";
	const set = (n: number) => onChange?.(Math.max(min, Math.min(max, n)));
	const btn = (dis: boolean): React.CSSProperties => ({
		border: 0,
		padding: 0,
		borderRadius: "50%",
		display: "grid",
		placeItems: "center",
		background: "transparent",
		color: dis ? "var(--text-faint)" : "var(--text-strong)",
		cursor: dis ? "not-allowed" : "pointer",
	});
	return (
		<span
			className={height}
			style={{
				display: "inline-flex",
				alignItems: "center",
				borderRadius: 999,
				background: "var(--glass-tint-2)",
				border: "1px solid var(--glass-stroke)",
				boxShadow: "var(--glass-highlight)",
				backdropFilter: "var(--glass-filter)",
				WebkitBackdropFilter: "var(--glass-filter)",
				...style,
			}}
		>
			<button
				type="button"
				aria-label="Quitar uno"
				disabled={value <= min}
				onClick={() => set(value - 1)}
				className={square}
				style={btn(value <= min)}
			>
				<Icon name="minus" size={16} />
			</button>
			<span
				aria-live="polite"
				style={{
					minWidth: 28,
					textAlign: "center",
					font: "500 15px/1 var(--font-mono)",
					color: "var(--text-strong)",
				}}
			>
				{value}
			</span>
			<button
				type="button"
				aria-label="Añadir uno"
				disabled={value >= max}
				onClick={() => set(value + 1)}
				className={square}
				style={btn(value >= max)}
			>
				<Icon name="plus" size={16} />
			</button>
		</span>
	);
}
