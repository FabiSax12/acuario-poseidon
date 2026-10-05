import { useState } from "react";
import { IconButton } from "./IconButton";
import { Logo } from "./Logo";

export interface NavBarProps<T extends string = string> {
	links?: readonly T[];
	/** The link shown as the current page. */
	active?: T;
	onNavigate?: (link: T) => void;
	cartCount?: number;
	onCart?: () => void;
	/** The search button is only rendered when a handler is given. */
	onSearch?: () => void;
	onLogo?: () => void;
	sticky?: boolean;
	style?: React.CSSProperties;
}

export function NavBar<T extends string = string>({
	links = [],
	active,
	onNavigate,
	cartCount = 0,
	onCart,
	onSearch,
	onLogo,
	sticky = true,
	style,
}: NavBarProps<T>) {
	const [hover, setHover] = useState<T | null>(null);
	return (
		<header
			style={{
				position: sticky ? "sticky" : "relative",
				top: 16,
				zIndex: 50,
				display: "flex",
				justifyContent: "center",
				padding: "0 var(--gutter)",
				...style,
			}}
		>
			<nav
				style={{
					width: "100%",
					maxWidth: "var(--container-max)",
					height: 64,
					display: "flex",
					alignItems: "center",
					gap: 24,
					padding: "0 10px 0 22px",
					boxSizing: "border-box",
					borderRadius: 999,
					background: "rgba(4,18,26,.32)",
					border: "1px solid var(--glass-stroke)",
					boxShadow: "var(--glass-highlight), var(--shadow-3)",
					backdropFilter: "var(--glass-filter-strong)",
					WebkitBackdropFilter: "var(--glass-filter-strong)",
				}}
			>
				<button
					type="button"
					onClick={onLogo}
					aria-label="Inicio"
					style={{
						background: "none",
						border: 0,
						padding: 0,
						cursor: "pointer",
						display: "flex",
					}}
				>
					<Logo size={34} />
				</button>
				<div
					style={{
						flex: 1,
						display: "flex",
						justifyContent: "center",
						gap: 4,
						overflow: "hidden",
					}}
				>
					{links.map((l) => {
						const on = active === l;
						return (
							<button
								key={l}
								type="button"
								onClick={() => onNavigate?.(l)}
								onMouseEnter={() => setHover(l)}
								onMouseLeave={() => setHover(null)}
								style={{
									height: 44,
									padding: "0 16px",
									border: 0,
									borderRadius: 999,
									cursor: "pointer",
									whiteSpace: "nowrap",
									font: "500 15px/1 var(--font-sans)",
									color: on ? "var(--abyss-950)" : "var(--text-strong)",
									background: on
										? "var(--pearl-0)"
										: hover === l
											? "rgba(255,255,255,.1)"
											: "transparent",
									transition: "background var(--dur-fast)",
								}}
							>
								{l}
							</button>
						);
					})}
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					{onSearch && (
						<IconButton
							icon="search"
							label="Buscar"
							variant="ghost"
							onClick={onSearch}
						/>
					)}
					<IconButton
						icon="shopping-bag"
						label="Carrito"
						badge={cartCount}
						onClick={onCart}
					/>
				</div>
			</nav>
		</header>
	);
}
