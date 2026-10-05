import { Link } from "@tanstack/react-router";
import { Icon, type IconName } from "#/components/ds/Icon";
import { IconButton } from "#/components/ds/IconButton";
import { Logo } from "#/components/ds/Logo";

const linkStyle: React.CSSProperties = {
	color: "var(--text-body)",
	font: "400 15px/1.4 var(--font-sans)",
};

const col = (title: string, items: React.ReactNode[]) => (
	<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
		<div className="pos-overline" style={{ color: "var(--text-faint)" }}>
			{title}
		</div>
		{items}
	</div>
);
const link = (label: string, to: "/tienda" | "/peceras-a-medida") => (
	<Link key={label} to={to} style={linkStyle}>
		{label}
	</Link>
);
// Services without a page yet: the design shows them as links that go nowhere.
const placeholderLink = (label: string) => (
	// biome-ignore lint/a11y/useValidAnchor: inert link until these pages exist, as in the design
	<a key={label} href="#" onClick={(e) => e.preventDefault()} style={linkStyle}>
		{label}
	</a>
);
const info = (icon: IconName, text: string) => (
	<div
		key={text}
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
			style={{
				background: "var(--abyss-950)",
				borderTop: "1px solid var(--glass-stroke)",
				padding: "72px var(--gutter) 40px",
			}}
		>
			<div
				style={{
					maxWidth: "var(--container-max)",
					margin: "0 auto",
					display: "grid",
					gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
					gap: 40,
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
					justifyContent: "space-between",
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
