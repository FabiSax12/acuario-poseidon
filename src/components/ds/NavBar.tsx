import { useEffect, useId, useRef, useState } from "react";
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

function focusToggle(header: HTMLElement | null) {
	header?.querySelector<HTMLButtonElement>("[aria-controls]")?.focus();
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
	// Below lg the link row does not fit, so it moves into a menu panel.
	const [menuOpen, setMenuOpen] = useState(false);
	const menuId = useId();
	const header = useRef<HTMLElement>(null);
	useEffect(() => {
		if (!menuOpen) return;
		const el = header.current;
		const close = () => setMenuOpen(false);
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			close();
			focusToggle(el);
		};
		const onPointer = (e: PointerEvent) => {
			if (!el?.contains(e.target as Node)) close();
		};
		// Tabbing out of the panel. A null relatedTarget is ignored: Safari
		// reports it when a button is clicked, which would close the panel
		// before the click lands.
		const onFocusOut = (e: FocusEvent) => {
			const next = e.relatedTarget as Node | null;
			if (next && !el?.contains(next)) close();
		};
		// The panel only exists below lg; without this it would come back open
		// after widening the window and narrowing it again.
		const wide = window.matchMedia("(min-width: 1024px)");
		window.addEventListener("keydown", onKey);
		window.addEventListener("popstate", close);
		document.addEventListener("pointerdown", onPointer);
		el?.addEventListener("focusout", onFocusOut);
		wide.addEventListener("change", close);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("popstate", close);
			document.removeEventListener("pointerdown", onPointer);
			el?.removeEventListener("focusout", onFocusOut);
			wide.removeEventListener("change", close);
		};
	}, [menuOpen]);
	return (
		<header
			ref={header}
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
				className="gap-3 pr-2.5 pl-4 lg:gap-6 lg:pl-[22px]"
				style={{
					width: "100%",
					maxWidth: "var(--container-max)",
					height: 64,
					display: "flex",
					alignItems: "center",
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
					onClick={() => {
						setMenuOpen(false);
						onLogo?.();
					}}
					aria-label="Inicio"
					style={{
						background: "none",
						border: 0,
						padding: 0,
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						minHeight: 44,
					}}
				>
					<Logo size={34} />
				</button>
				<div
					className="hidden lg:flex"
					style={{
						flex: 1,
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
				<div className="ml-auto lg:ml-0" style={{ display: "flex", gap: 8 }}>
					{onSearch && (
						<span className="hidden lg:contents">
							<IconButton
								icon="search"
								label="Buscar"
								variant="ghost"
								onClick={onSearch}
							/>
						</span>
					)}
					<IconButton
						icon="shopping-bag"
						label="Carrito"
						badge={cartCount}
						onClick={() => {
							setMenuOpen(false);
							onCart?.();
						}}
					/>
					<span className="contents lg:hidden">
						<IconButton
							icon={menuOpen ? "x" : "menu"}
							label={menuOpen ? "Cerrar menú" : "Abrir menú"}
							aria-expanded={menuOpen}
							aria-controls={menuId}
							onClick={() => setMenuOpen(!menuOpen)}
						/>
					</span>
				</div>
			</nav>
			{/* A sibling of the pill, not a child: a backdrop-filter nested inside
			    another one has nothing left to blur. */}
			<nav
				id={menuId}
				aria-label="Menú"
				className={menuOpen ? "flex lg:hidden" : "hidden"}
				style={{
					position: "absolute",
					top: "calc(100% + 8px)",
					left: "var(--gutter)",
					right: "var(--gutter)",
					flexDirection: "column",
					gap: 4,
					padding: 8,
					maxHeight: "calc(100dvh - 120px)",
					overflowY: "auto",
					borderRadius: "var(--radius-lg)",
					background: "rgba(6,24,34,.72)",
					border: "1px solid var(--glass-stroke)",
					boxShadow: "var(--glass-highlight), var(--shadow-4)",
					backdropFilter: "var(--glass-filter-strong)",
					WebkitBackdropFilter: "var(--glass-filter-strong)",
				}}
			>
				{links.map((l) => {
					const on = active === l;
					return (
						<button
							key={l}
							type="button"
							aria-current={on ? "page" : undefined}
							onClick={() => {
								// The panel is about to be hidden; keep focus in the bar.
								focusToggle(header.current);
								setMenuOpen(false);
								onNavigate?.(l);
							}}
							style={{
								height: 48,
								padding: "0 16px",
								border: 0,
								borderRadius: "var(--radius-md)",
								cursor: "pointer",
								textAlign: "left",
								font: "500 16px/1 var(--font-sans)",
								color: on ? "var(--abyss-950)" : "var(--text-strong)",
								background: on ? "var(--pearl-0)" : "transparent",
							}}
						>
							{l}
						</button>
					);
				})}
			</nav>
		</header>
	);
}
