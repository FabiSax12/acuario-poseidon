import { useEffect, useState } from "react";
import { IconButton } from "./IconButton";

export interface DialogProps {
	open: boolean;
	onClose?: () => void;
	title: string;
	children?: React.ReactNode;
	footer?: React.ReactNode;
	width?: number | string;
	/** "right" turns the dialog into a drawer docked to the right edge. */
	side?: "right";
	style?: React.CSSProperties;
}

export function Dialog({
	open,
	onClose,
	title,
	children,
	footer,
	width = 520,
	side,
	style,
}: DialogProps) {
	const [shown, setShown] = useState(false);
	useEffect(() => {
		if (!open) {
			setShown(false);
			return;
		}
		const t = requestAnimationFrame(() => setShown(true));
		const k = (e: KeyboardEvent) => {
			if (e.key === "Escape" && onClose) onClose();
		};
		window.addEventListener("keydown", k);
		return () => {
			cancelAnimationFrame(t);
			window.removeEventListener("keydown", k);
		};
	}, [open, onClose]);
	if (!open) return null;
	const drawer = side === "right";
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-close; markup kept as in the design system source (fidelity port)
		// biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes the dialog via the window listener above
		<div
			onClick={onClose}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 100,
				display: "flex",
				alignItems: drawer ? "stretch" : "center",
				justifyContent: drawer ? "flex-end" : "center",
				padding: drawer ? 12 : 24,
				background: shown ? "rgba(2,9,13,.5)" : "rgba(2,9,13,0)",
				backdropFilter: shown ? "blur(6px)" : "blur(0px)",
				WebkitBackdropFilter: shown ? "blur(6px)" : "blur(0px)",
				transition: "all var(--dur-base) var(--ease-current)",
			}}
		>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: only stops clicks from reaching the backdrop */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				onClick={(e) => e.stopPropagation()}
				style={{
					width: "100%",
					maxWidth: width,
					maxHeight: "100%",
					display: "flex",
					flexDirection: "column",
					boxSizing: "border-box",
					borderRadius: "var(--radius-panel)",
					background: "rgba(6,24,34,.72)",
					border: "1px solid var(--glass-stroke)",
					boxShadow: "var(--glass-highlight), var(--shadow-4)",
					backdropFilter: "var(--glass-filter-strong)",
					WebkitBackdropFilter: "var(--glass-filter-strong)",
					color: "var(--text-body)",
					opacity: shown ? 1 : 0,
					transform: shown
						? "none"
						: drawer
							? "translateX(40px)"
							: "translateY(12px) scale(.97)",
					transition:
						"opacity var(--dur-base) var(--ease-current), transform var(--dur-slow) var(--ease-current)",
					...style,
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 16,
						padding: "20px 20px 0 28px",
					}}
				>
					<h2
						style={{
							margin: 0,
							font: "var(--type-h2)",
							fontSize: 28,
							color: "var(--text-strong)",
						}}
					>
						{title}
					</h2>
					<IconButton
						icon="x"
						label="Cerrar"
						variant="ghost"
						onClick={onClose}
					/>
				</div>
				<div style={{ padding: "16px 28px 24px", overflowY: "auto", flex: 1 }}>
					{children}
				</div>
				{footer && (
					<div
						style={{
							padding: "18px 28px 24px",
							borderTop: "1px solid var(--glass-stroke)",
							display: "flex",
							gap: 12,
							justifyContent: "flex-end",
						}}
					>
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}
