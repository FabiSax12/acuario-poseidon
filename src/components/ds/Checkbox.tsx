import { useState } from "react";
import { Icon } from "./Icon";

export interface CheckboxProps {
	label: React.ReactNode;
	description?: React.ReactNode;
	/** Controlled state; leave undefined to let the component manage it. */
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	style?: React.CSSProperties;
}

export function Checkbox({
	label,
	description,
	checked,
	defaultChecked,
	onChange,
	disabled,
	style,
}: CheckboxProps) {
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
				display: "flex",
				gap: 12,
				alignItems: "flex-start",
				cursor: disabled ? "not-allowed" : "pointer",
				opacity: disabled ? 0.45 : 1,
				minHeight: 44,
				padding: "11px 0",
				boxSizing: "border-box",
				...style,
			}}
		>
			<input
				type="checkbox"
				checked={on}
				onChange={toggle}
				disabled={disabled}
				style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
			/>
			<span
				aria-hidden="true"
				style={{
					width: 22,
					height: 22,
					flexShrink: 0,
					borderRadius: "var(--radius-xs)",
					display: "grid",
					placeItems: "center",
					boxSizing: "border-box",
					background: on ? "var(--tide-400)" : "rgba(2,12,18,.38)",
					border: `1.5px solid ${on ? "var(--tide-400)" : "var(--glass-stroke-strong)"}`,
					color: "var(--abyss-950)",
					transition: "background var(--dur-fast) var(--ease-current)",
				}}
			>
				{on && <Icon name="check" size={15} strokeWidth={3} />}
			</span>
			<span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
		</label>
	);
}
