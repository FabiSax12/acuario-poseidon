import { useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "#/components/ds/Button";

// Route error component for the screens that read the catalogue from Strapi.
// Laid out like NotFound so an outage still lands inside the storefront shell.
// The underlying error is not shown to shoppers; it is logged on the server.
export function CatalogError() {
	const router = useRouter();
	const navigate = useNavigate();
	return (
		<section
			role="alert"
			style={{
				maxWidth: "var(--container-max)",
				margin: "0 auto",
				padding: "130px var(--gutter) 100px",
			}}
		>
			<div className="pos-overline">Catálogo no disponible</div>
			<h1
				style={{
					font: "400 var(--fs-display-md)/1.02 var(--font-display)",
					margin: "12px 0 20px",
				}}
			>
				No pudimos cargar el catálogo
			</h1>
			<p style={{ font: "var(--type-body-lg)", color: "var(--text-muted)" }}>
				Tuvimos un problema al consultar los productos. Inténtalo de nuevo en
				unos minutos.
			</p>
			<div
				style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}
			>
				{/* Re-runs the route loader, which fetches the catalogue again. */}
				<Button onClick={() => router.invalidate()}>Reintentar</Button>
				<Button variant="glass" onClick={() => navigate({ to: "/" })}>
					Ir al inicio
				</Button>
			</div>
		</section>
	);
}
