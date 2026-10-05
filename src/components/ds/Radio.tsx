import { useState } from "react";

export interface RadioProps<T extends string = string> {
	label: React.ReactNode;
	description?: React.ReactNode;
	checked?: boolean;
	/** Called with this radio's value when it is picked. */
	onChange?: (value: T) => void;
	name: string;
	value: T;
	disabled?: boolean;
	variant?: "plain" | "card";
	/** Right-aligned note, e.g. a price. */
	aside?: React.ReactNode;
	style?: React.CSSProperties;
}

export function Radio<T extends string = string>({
	label,
	description,
	checked,
	onChange,
	name,
	value,
	disabled,
	variant = "plain",
	aside,
	style,
}: RadioProps<T>) {
	const card = variant === "card";
	const [hover, setHover] = useState(false);
	return (
		<label
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			style={{
				display: "flex",
				gap: 12,
				alignItems: card ? "center" : "flex-start",
				cursor: disabled ? "not-allowed" : "pointer",
				opacity: disabled ? 0.45 : 1,
				minHeight: 44,
				boxSizing: "border-box",
				...(card
					? {
							padding: "16px 18px",
							borderRadius: "var(--radius-md)",
							background: checked
								? "rgba(63,211,198,.12)"
								: hover
									? "var(--glass-tint-3)"
									: "var(--glass-tint-1)",
							border: `1px solid ${checked ? "var(--tide-400)" : "var(--glass-stroke)"}`,
							backdropFilter: "var(--glass-filter)",
							WebkitBackdropFilter: "var(--glass-filter)",
							transition:
								"background var(--dur-fast), border-color var(--dur-fast)",
						}
					: { padding: "11px 0" }),
				...style,
			}}
		>
			<input
				type="radio"
				name={name}
				value={value}
				checked={!!checked}
				onChange={() => onChange?.(value)}
				disabled={disabled}
				style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
			/>
			<span
				aria-hidden="true"
				style={{
					width: 22,
					height: 22,
					flexShrink: 0,
					borderRadius: "50%",
					boxSizing: "border-box",
					display: "grid",
					placeItems: "center",
					border: `1.5px solid ${checked ? "var(--tide-400)" : "var(--glass-stroke-strong)"}`,
					background: "rgba(2,12,18,.38)",
				}}
			>
				<span
					style={{
						width: 10,
						height: 10,
						borderRadius: "50%",
						background: "var(--tide-400)",
						transform: checked ? "scale(1)" : "scale(0)",
						transition: "transform var(--dur-fast) var(--ease-buoy)",
					}}
				/>
			</span>
			<span
				style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
			>
				<span
					style={{
						font: "500 15px/22px var(--font-sans)",
						color: "var(--text-strong)",
					}}
				>
					{label}
				</span>
				{description && (
					<span
						style={{
							font: "400 13px/1.4 var(--font-sans)",
							color: "var(--text-muted)",
						}}
					>
						{description}
					</span>
				)}
			</span>
			{aside && (
				<span
					style={{
						font: "500 14px/1 var(--font-mono)",
						color: "var(--text-body)",
					}}
				>
					{aside}
				</span>
			)}
		</label>
	);
}
