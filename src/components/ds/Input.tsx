import { useId, useState } from "react";
import { Icon, type IconName } from "./Icon";

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

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> {
	label?: React.ReactNode;
	hint?: React.ReactNode;
	/** Error message; replaces the hint and marks the field invalid. */
	error?: React.ReactNode;
	icon?: IconName;
	/** Short unit shown inside the field, on the right. */
	suffix?: React.ReactNode;
	/** Applied to the wrapping label, not the input. */
	style?: React.CSSProperties;
}

export function Input({
	label,
	hint,
	error,
	icon,
	suffix,
	id,
	style,
	...rest
}: InputProps) {
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
				{icon && (
					<span
						style={{
							position: "absolute",
							left: 16,
							top: 14,
							color: focus ? "var(--tide-300)" : "var(--text-muted)",
							pointerEvents: "none",
						}}
					>
						<Icon name={icon} size={20} />
					</span>
				)}
				<input
					id={fid}
					onFocus={() => setFocus(true)}
					onBlur={() => setFocus(false)}
					aria-invalid={!!error || undefined}
					style={{
						...fieldBase(focus, error),
						padding: `0 ${suffix ? 56 : 16}px 0 ${icon ? 46 : 16}px`,
					}}
					{...rest}
				/>
				{suffix && (
					<span
						style={{
							position: "absolute",
							right: 16,
							top: 0,
							height: 48,
							display: "flex",
							alignItems: "center",
							font: "500 13px/1 var(--font-mono)",
							color: "var(--text-muted)",
						}}
					>
						{suffix}
					</span>
				)}
			</span>
			{(error || hint) && <span style={hintStyle(error)}>{error || hint}</span>}
		</label>
	);
}
