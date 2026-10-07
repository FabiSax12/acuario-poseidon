import { Link } from "@tanstack/react-router";
import { Icon, type IconName } from "#/components/ds/Icon";
import { IconButton } from "#/components/ds/IconButton";
import { Logo } from "#/components/ds/Logo";

const linkStyle: React.CSSProperties = {
	color: "var(--text-body)",
	font: "400 15px/1.4 var(--font-sans)",
};

const col = (title: string, items: React.ReactNode[]) => (
	<div
		className="gap-1 lg:not-pointer-coarse:gap-3"
		style={{ display: "flex", flexDirection: "column" }}
	>
		<div className="pos-overline" style={{ color: "var(--text-faint)" }}>
			{title}
		</div>
		{items}
	</div>
);
// Links and contact rows keep a 44px touch height; it collapses to the text
// height on wide screens without a touch pointer.
const ROW = "flex items-center min-h-11 lg:not-pointer-coarse:min-h-0";
const link = (label: string, to: "/tienda" | "/peceras-a-medida") => (
	<Link key={label} to={to} className={ROW} style={linkStyle}>
		{label}
	</Link>
);
// Services without a page yet: the design shows them as links that go nowhere.
const placeholderLink = (label: string) => (
	// biome-ignore lint/a11y/useValidAnchor: inert link until these pages exist, as in the design
	<a
		key={label}
		href="#"
		onClick={(e) => e.preventDefault()}
		className={ROW}
		style={linkStyle}
	>
		{label}
	</a>
);
const info = (icon: IconName, text: string) => (
	<div
		key={text}
		className={ROW}
		style={{
			display: "flex",
			gap: 10,
			alignItems: "center",
			color: "var(--text-body)",
			font: "400 15px/1.4 var(--font-sans)",
		}}
	>
		<span style={{ color: "var(--tide-300)" }}>
			<Icon name={icon} size={18} />
		</span>
		{text}
	</div>
);

export function Footer() {
	return (
		<footer
			id="contacto"
			className="px-[var(--gutter)] pt-14 pb-[max(40px,env(safe-area-inset-bottom))] lg:pt-[72px]"
			style={{
				background: "var(--abyss-950)",
				borderTop: "1px solid var(--glass-stroke)",
			}}
		>
			<div
				className="grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10"
				style={{
					maxWidth: "var(--container-max)",
					margin: "0 auto",
					display: "grid",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 20,
						alignItems: "flex-start",
					}}
				>
					<Logo variant="stacked" size={96} />
					<p
						style={{
							font: "400 14px/1.5 var(--font-sans)",
							color: "var(--text-muted)",
							maxWidth: 260,
						}}
					>
						Peces, peceras a medida y todo para tu acuario.
					</p>
				</div>
				{col("Tienda", [
					link("Peces", "/tienda"),
					link("Alimento", "/tienda"),
					link("Equipos", "/tienda"),
					link("Plantas y decoración", "/tienda"),
				])}
				{col("Servicios", [
					link("Peceras a medida", "/peceras-a-medida"),
					placeholderLink("Asesoría"),
					placeholderLink("Mantenimiento"),
				])}
				{col("Contacto", [
					info("map-pin", "[Dirección de la tienda]"),
					info("clock", "[Horario de atención]"),
					info("phone", "[Teléfono]"),
					<div key="s" style={{ display: "flex", gap: 8, marginTop: 6 }}>
						<IconButton icon="instagram" label="Instagram" size="sm" />
						<IconButton icon="facebook" label="Facebook" size="sm" />
					</div>,
				])}
			</div>
			<div
				style={{
					maxWidth: "var(--container-max)",
					margin: "56px auto 0",
					paddingTop: 24,
					borderTop: "1px solid var(--glass-stroke)",
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "space-between",
					gap: 8,
					font: "400 13px/1 var(--font-sans)",
					color: "var(--text-faint)",
				}}
			>
				<span>© Acuario Poseidón</span>
				<span>Videos: Mixkit</span>
			</div>
		</footer>
	);
}
