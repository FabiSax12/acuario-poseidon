import { useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ds/Button";

export interface NotFoundProps {
	title?: string;
	message?: string;
}

// Not part of the design kit: laid out like the other screens so an unknown
// URL or product id still lands inside the storefront shell.
export function NotFound({
	title = "Página no encontrada",
	message = "La página que buscas no existe o cambió de lugar.",
}: NotFoundProps) {
	const navigate = useNavigate();
	return (
		<section
			className="px-[var(--gutter)] pt-[112px] pb-[72px] lg:pt-[130px] lg:pb-[100px]"
			style={{
				maxWidth: "var(--container-max)",
				margin: "0 auto",
			}}
		>
			<div className="pos-overline">Error 404</div>
			<h1
				style={{
					font: "400 var(--fs-display-md)/1.02 var(--font-display)",
					margin: "12px 0 20px",
				}}
			>
				{title}
			</h1>
			<p style={{ font: "var(--type-body-lg)", color: "var(--text-muted)" }}>
				{message}
			</p>
			<div
				style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}
			>
				<Button
					iconRight="arrow-right"
					onClick={() => navigate({ to: "/tienda" })}
				>
					Ver la tienda
				</Button>
				<Button variant="glass" onClick={() => navigate({ to: "/" })}>
					Ir al inicio
				</Button>
			</div>
		</section>
	);
}
