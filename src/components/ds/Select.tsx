import { useId, useState } from "react";
import { Icon } from "./Icon";

const fieldBase = (
	focus: boolean,
	error?: React.ReactNode,
): React.CSSProperties => ({
	width: "100%",
	boxSizing: "border-box",
	height: 48,
	borderRadius: "var(--radius-md)",
	background: "rgba(2,12,18,.38)",
	border: `1px solid ${error ? "var(--urchin-400)" : focus ? "var(--tide-400)" : "var(--glass-stroke)"}`,
	boxShadow: focus
		? "0 0 0 4px rgba(63,211,198,.18)"
		: "var(--glass-highlight)",
	color: "var(--text-strong)",
	font: "400 16px/1 var(--font-sans)",
	outline: "none",
	backdropFilter: "var(--glass-filter)",
	WebkitBackdropFilter: "var(--glass-filter)",
	transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
});
const labelStyle: React.CSSProperties = {
	font: "600 13px/1.2 var(--font-sans)",
	color: "var(--text-body)",
	letterSpacing: ".01em",
};
const hintStyle = (error?: React.ReactNode): React.CSSProperties => ({
	font: "400 13px/1.4 var(--font-sans)",
	color: error ? "var(--urchin-400)" : "var(--text-muted)",
});

export type SelectOption = string | { value: string; label: string };

export interface SelectProps
	extends Omit<
		React.SelectHTMLAttributes<HTMLSelectElement>,
		"style" | "children"
	> {
	label?: React.ReactNode;
	hint?: React.ReactNode;
	/** Error message; replaces the hint. */
	error?: React.ReactNode;
	options?: readonly SelectOption[];
	/** Applied to the wrapping label, not the select. */
	style?: React.CSSProperties;
}

export function Select({
	label,
	hint,
	error,
	options = [],
	value,
	onChange,
	id,
	style,
	...rest
}: SelectProps) {
	const [focus, setFocus] = useState(false);
	const generatedId = useId();
	const fid = id || generatedId;
	return (
		<label
			htmlFor={fid}
			style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}
		>
			{label && <span style={labelStyle}>{label}</span>}
			<span style={{ position: "relative", display: "block" }}>
				<select
					id={fid}
					value={value}
					onChange={onChange}
					onFocus={() => setFocus(true)}
					onBlur={() => setFocus(false)}
					style={{
						...fieldBase(focus, error),
						padding: "0 44px 0 16px",
						appearance: "none",
						WebkitAppearance: "none",
						cursor: "pointer",
					}}
					{...rest}
				>
					{options.map((o) => {
						const v = typeof o === "string" ? o : o.value;
						const l = typeof o === "string" ? o : o.label;
						return (
							<option key={v} value={v} style={{ color: "#04121a" }}>
								{l}
							</option>
						);
					})}
				</select>
				<span
					style={{
						position: "absolute",
						right: 14,
						top: 14,
						color: "var(--text-muted)",
						pointerEvents: "none",
					}}
				>
					<Icon name="chevron-down" size={20} />
				</span>
			</span>
			{(error || hint) && <span style={hintStyle(error)}>{error || hint}</span>}
		</label>
	);
}
