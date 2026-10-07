export type TabItem<T extends string = string> =
	| T
	| { value: T; label: React.ReactNode; count?: number };

export interface TabsProps<T extends string = string> {
	items?: readonly TabItem<T>[];
	value?: T;
	onChange?: (value: T) => void;
	style?: React.CSSProperties;
}

export function Tabs<T extends string = string>({
	items = [],
	value,
	onChange,
	style,
}: TabsProps<T>) {
	return (
		<div
			role="tablist"
			style={{
				display: "inline-flex",
				gap: 4,
				padding: 4,
				borderRadius: 999,
				background: "var(--glass-tint-1)",
				border: "1px solid var(--glass-stroke)",
				boxShadow: "var(--glass-highlight)",
				backdropFilter: "var(--glass-filter)",
				WebkitBackdropFilter: "var(--glass-filter)",
				maxWidth: "100%",
				overflowX: "auto",
				...style,
			}}
		>
			{items.map((it) => {
				const v = typeof it === "string" ? it : it.value;
				const l = typeof it === "string" ? it : it.label;
				const on = v === value;
				const count = typeof it === "object" ? it.count : undefined;
				return (
					<button
						key={v}
						role="tab"
						aria-selected={on}
						type="button"
						onClick={() => onChange?.(v)}
						className="h-11 shrink-0 lg:not-pointer-coarse:h-10"
						style={{
							padding: "0 18px",
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							border: 0,
							borderRadius: 999,
							cursor: "pointer",
							whiteSpace: "nowrap",
							font: "600 14px/1 var(--font-sans)",
							color: on ? "var(--abyss-950)" : "var(--text-body)",
							background: on ? "var(--tide-300)" : "transparent",
							transition:
								"background var(--dur-base) var(--ease-current), color var(--dur-base)",
						}}
					>
						{l}
						{count != null && (
							<span
								style={{ font: "500 12px/1 var(--font-mono)", opacity: 0.7 }}
							>
								{count}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}
