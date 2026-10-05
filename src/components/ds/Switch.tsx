import { useState } from "react";

export interface SwitchProps {
	label?: React.ReactNode;
	/** Controlled state; leave undefined to let the component manage it. */
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	style?: React.CSSProperties;
}

export function Switch({
	label,
	checked,
	defaultChecked,
	onChange,
	disabled,
	style,
}: SwitchProps) {
	const [inner, setInner] = useState(!!defaultChecked);
	const on = checked ?? inner;
	const toggle = () => {
		if (disabled) return;
		if (checked === undefined) setInner(!on);
		onChange?.(!on);
	};
	return (
		<label
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 12,
				minHeight: 44,
				cursor: disabled ? "not-allowed" : "pointer",
				opacity: disabled ? 0.45 : 1,
				...style,
			}}
		>
			<button
				type="button"
				role="switch"
				aria-checked={on}
				onClick={toggle}
				disabled={disabled}
				style={{
					position: "relative",
					width: 48,
					height: 28,
					flexShrink: 0,
					borderRadius: 999,
					padding: 0,
					cursor: "inherit",
					boxSizing: "border-box",
					background: on ? "var(--tide-400)" : "rgba(255,255,255,.14)",
					border: `1px solid ${on ? "transparent" : "var(--glass-stroke)"}`,
					transition: "background var(--dur-base) var(--ease-current)",
				}}
			>
				<span
					style={{
						position: "absolute",
						top: 3,
						left: 3,
						width: 20,
						height: 20,
						borderRadius: "50%",
						background: on ? "var(--abyss-950)" : "var(--pearl-0)",
						boxShadow: "var(--shadow-1)",
						transform: on ? "translateX(20px)" : "none",
						transition:
							"transform var(--dur-base) var(--ease-buoy), background var(--dur-base)",
					}}
				/>
			</button>
			{label && (
				<span
					style={{
						font: "500 15px/1.3 var(--font-sans)",
						color: "var(--text-strong)",
					}}
				>
					{label}
				</span>
			)}
		</label>
	);
}
