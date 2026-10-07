import { Icon } from "./Icon";

const TONES = {
	success: ["circle-check", "var(--kelp-400)"],
	info: ["info", "var(--tide-300)"],
	warning: ["triangle-alert", "var(--sun-400)"],
	danger: ["triangle-alert", "var(--urchin-400)"],
} as const;

export type ToastTone = keyof typeof TONES;

export interface ToastProps {
	tone?: ToastTone;
	title: string;
	message?: string;
	/** Label of the inline action button. */
	action?: string;
	onAction?: () => void;
	onClose?: () => void;
	style?: React.CSSProperties;
}

export function Toast({
	tone = "success",
	title,
	message,
	action,
	onAction,
	onClose,
	style,
}: ToastProps) {
	const [icon, color] = TONES[tone] || TONES.info;
	return (
		// biome-ignore lint/a11y/useSemanticElements: markup kept as in the design system source (fidelity port)
		<div
			role="status"
			style={{
				display: "flex",
				alignItems: "flex-start",
				gap: 12,
				width: 360,
				maxWidth: "100%",
				overflowWrap: "anywhere",
				boxSizing: "border-box",
				padding: "14px 12px 14px 16px",
				borderRadius: "var(--radius-lg)",
				background: "rgba(6,24,34,.66)",
				border: "1px solid var(--glass-stroke)",
				boxShadow: "var(--glass-highlight), var(--shadow-3)",
				backdropFilter: "var(--glass-filter-strong)",
				WebkitBackdropFilter: "var(--glass-filter-strong)",
				...style,
			}}
		>
			<span style={{ color, marginTop: 1 }}>
				<Icon name={icon} size={20} />
			</span>
			<div
				style={{
					flex: 1,
					minWidth: 0,
					display: "flex",
					flexDirection: "column",
					gap: 3,
				}}
			>
				<span
					style={{
						font: "600 15px/1.3 var(--font-sans)",
						color: "var(--text-strong)",
					}}
				>
					{title}
				</span>
				{message && (
					<span
						style={{
							font: "400 14px/1.4 var(--font-sans)",
							color: "var(--text-muted)",
						}}
					>
						{message}
					</span>
				)}
				{action && (
					<button
						type="button"
						onClick={onAction}
						className="min-h-11 lg:not-pointer-coarse:min-h-0"
						style={{
							alignSelf: "flex-start",
							marginTop: 6,
							padding: 0,
							border: 0,
							background: "none",
							font: "600 14px/1 var(--font-sans)",
							color: "var(--tide-300)",
							cursor: "pointer",
						}}
					>
						{action}
					</button>
				)}
			</div>
			{onClose && (
				<button
					type="button"
					aria-label="Cerrar"
					onClick={onClose}
					className="size-11 shrink-0 lg:not-pointer-coarse:size-8"
					style={{
						display: "grid",
						placeItems: "center",
						border: 0,
						borderRadius: "50%",
						background: "transparent",
						color: "var(--text-muted)",
						cursor: "pointer",
					}}
				>
					<Icon name="x" size={16} />
				</button>
			)}
		</div>
	);
}
