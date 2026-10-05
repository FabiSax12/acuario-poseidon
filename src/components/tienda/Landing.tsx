import { useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ds/Button";
import { GlassPanel } from "#/components/ds/GlassPanel";
import { HorizontalScroll } from "#/components/ds/HorizontalScroll";
import { Icon, type IconName } from "#/components/ds/Icon";
import { Parallax } from "#/components/ds/Parallax";
import { ProductCard } from "#/components/ds/ProductCard";
import { Reveal } from "#/components/ds/Reveal";
import { VideoBackdrop } from "#/components/ds/VideoBackdrop";
import { categories, imageUrl, products } from "#/data/catalog";
import { PhotoSlot } from "./PhotoSlot";
import { useStore } from "./StoreProvider";

function Hero() {
	const navigate = useNavigate();
	return (
		<section
			data-screen-label="Inicio — hero"
			style={{
				position: "relative",
				minHeight: "100vh",
				display: "flex",
				alignItems: "flex-end",
				overflow: "hidden",
			}}
		>
			<Parallax
				speed={0.4}
				style={{ position: "absolute", inset: "-12% 0 -12% 0" }}
			>
				<VideoBackdrop
					src="/assets/video/coral-reef-school.mp4"
					poster={imageUrl("coral-reef-school")}
					scrim="full"
					dim={0.05}
				/>
			</Parallax>
			<div
				style={{
					position: "relative",
					width: "100%",
					maxWidth: "var(--container-max)",
					margin: "0 auto",
					padding: "0 var(--gutter) 12vh",
					boxSizing: "border-box",
					display: "grid",
					gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)",
					gap: 40,
					alignItems: "end",
				}}
			>
				<Parallax speed={-0.12}>
					<Reveal>
						<div className="pos-overline">
							Acuario Poseidón · Peces · Peceras · Todo para tu acuario
						</div>
					</Reveal>
					<Reveal delay={120}>
						<h1
							style={{
								font: "400 clamp(56px,8vw,112px)/0.98 var(--font-display)",
								letterSpacing: "-.01em",
								margin: "20px 0 24px",
							}}
						>
							El mar,
							<br />
							en tu sala.
						</h1>
					</Reveal>
					<Reveal delay={240}>
						<p
							style={{
								font: "var(--type-body-lg)",
								maxWidth: 520,
								color: "var(--text-body)",
							}}
						>
							Peces de agua dulce y salada, alimento, equipos y peceras hechas a
							tu medida. Te asesoramos para que tu acuario esté sano desde el
							primer día.
						</p>
					</Reveal>
					<Reveal delay={360}>
						<div
							style={{
								display: "flex",
								gap: 12,
								marginTop: 32,
								flexWrap: "wrap",
							}}
						>
							<Button
								size="lg"
								iconRight="arrow-right"
								onClick={() => navigate({ to: "/tienda" })}
							>
								Ver la tienda
							</Button>
							<Button
								size="lg"
								variant="glass"
								iconLeft="ruler"
								onClick={() => navigate({ to: "/peceras-a-medida" })}
							>
								Diseñar mi pecera
							</Button>
						</div>
					</Reveal>
				</Parallax>
				<Parallax
					speed={-0.3}
					style={{ justifySelf: "end", width: "100%", maxWidth: 340 }}
				>
					<Reveal delay={500}>
						<GlassPanel
							padding={12}
							radius={24}
							onClick={() => navigate({ to: "/peceras-a-medida" })}
							style={{ cursor: "pointer" }}
						>
							<div
								style={{
									aspectRatio: "16/10",
									borderRadius: 16,
									background: `url(${imageUrl("tank-marine-flora")}) center/cover`,
								}}
							/>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "14px 8px 6px",
								}}
							>
								<div>
									<div style={{ font: "var(--type-h4)", color: "#fff" }}>
										Pecera a medida
									</div>
									<div
										style={{
											font: "400 14px/1.4 var(--font-sans)",
											color: "var(--text-muted)",
										}}
									>
										Tú eliges medidas y equipo
									</div>
								</div>
								<span style={{ color: "var(--tide-300)" }}>
									<Icon name="arrow-up-right" size={22} />
								</span>
							</div>
						</GlassPanel>
					</Reveal>
				</Parallax>
			</div>
		</section>
	);
}

function Marquee() {
	const words =
		"Peces · Corales · Plantas · Peceras · Alimento · Filtros · Luces · ";
	return (
		<div
			aria-hidden="true"
			style={{
				overflow: "hidden",
				padding: "56px 0 24px",
				whiteSpace: "nowrap",
			}}
		>
			<Parallax axis="x" speed={0.6}>
				<div
					style={{
						font: "400 120px/1 var(--font-display)",
						color: "transparent",
						WebkitTextStroke: "1px rgba(111,230,218,.35)",
						marginLeft: "-30vw",
					}}
				>
					{words + words}
				</div>
			</Parallax>
			<Parallax axis="x" speed={-0.4}>
				<div
					style={{
						font: "400 120px/1 var(--font-display)",
						color: "rgba(255,255,255,.06)",
						marginLeft: "-60vw",
					}}
				>
					{words + words}
				</div>
			</Parallax>
		</div>
	);
}

function CategoryRail() {
	const navigate = useNavigate();
	return (
		<HorizontalScroll
			header={
				<div style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>
					<div className="pos-overline">Explora</div>
					<h2 style={{ font: "var(--type-h1)", marginTop: 12 }}>
						Todo lo que vive en un acuario.
					</h2>
				</div>
			}
		>
			{categories.map((c, i) => (
				// biome-ignore lint/a11y/noStaticElementInteractions: clickable card kept as in the design (mouse only)
				// biome-ignore lint/a11y/useKeyWithClickEvents: clickable card kept as in the design (mouse only)
				<div
					key={c.name}
					onClick={() => navigate({ to: c.to })}
					style={{
						position: "relative",
						width: "min(440px,78vw)",
						height: "min(52vh,480px)",
						borderRadius: "var(--radius-xl)",
						overflow: "hidden",
						cursor: "pointer",
						flexShrink: 0,
						boxShadow: "var(--shadow-3)",
					}}
				>
					{c.img ? (
						<div
							style={{
								position: "absolute",
								inset: 0,
								background: `url(${imageUrl(c.img)}) center/cover`,
							}}
						/>
					) : (
						<PhotoSlot icon={c.icon} label="Foto pendiente" />
					)}
					<GlassPanel
						padding={20}
						radius={20}
						style={{
							position: "absolute",
							left: 12,
							right: 12,
							bottom: 12,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 12,
						}}
					>
						<div>
							<div
								style={{
									font: "400 12px/1 var(--font-mono)",
									color: "var(--tide-200)",
									marginBottom: 8,
								}}
							>
								0{i + 1}
							</div>
							<div
								style={{ font: "var(--type-h3)", fontSize: 22, color: "#fff" }}
							>
								{c.name}
							</div>
							<div
								style={{
									font: "400 14px/1.4 var(--font-sans)",
									color: "var(--text-muted)",
									marginTop: 4,
								}}
							>
								{c.note}
							</div>
						</div>
						<span
							style={{
								width: 44,
								height: 44,
								borderRadius: "50%",
								display: "grid",
								placeItems: "center",
								background: "var(--pearl-0)",
								color: "var(--abyss-900)",
								flexShrink: 0,
							}}
						>
							<Icon name="arrow-right" size={20} />
						</span>
					</GlassPanel>
				</div>
			))}
		</HorizontalScroll>
	);
}

const TANK_STEPS: [icon: IconName, title: string, description: string][] = [
	[
		"ruler",
		"Medidas",
		"Largo, fondo y alto pensados para tu espacio y tus peces.",
	],
	["box", "Materiales", "Vidrio estándar o extra-claro, con o sin mueble."],
	[
		"lightbulb",
		"Equipamiento",
		"Luz, filtro y calentador elegidos para el volumen exacto.",
	],
];

function CustomTankTeaser() {
	const navigate = useNavigate();
	return (
		<section
			data-screen-label="Inicio — a medida"
			style={{
				maxWidth: "var(--container-max)",
				margin: "0 auto",
				padding: "120px var(--gutter)",
				display: "grid",
				gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
				gap: 64,
				alignItems: "center",
			}}
		>
			<div
				style={{
					position: "relative",
					height: 560,
					borderRadius: "var(--radius-2xl)",
					overflow: "hidden",
					boxShadow: "var(--shadow-4)",
				}}
			>
				<Parallax
					speed={0.25}
					style={{ position: "absolute", inset: "-18% 0" }}
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							background: `url(${imageUrl("tank-marine-flora")}) center/cover`,
						}}
					/>
				</Parallax>
			</div>
			<div>
				<Reveal>
					<div className="pos-overline" style={{ color: "var(--bronze-300)" }}>
						Peceras a medida
					</div>
				</Reveal>
				<Reveal delay={100}>
					<h2 style={{ font: "var(--type-h1)", margin: "14px 0 18px" }}>
						Tu pecera, del tamaño exacto de tu idea.
					</h2>
				</Reveal>
				<Reveal delay={200}>
					<p style={{ font: "var(--type-body-lg)", color: "var(--text-body)" }}>
						La diseñamos contigo y la armamos a mano en el taller.
					</p>
				</Reveal>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 4,
						margin: "32px 0",
					}}
				>
					{TANK_STEPS.map(([ic, t, d], i) => (
						<Reveal key={t} delay={260 + i * 100}>
							<div
								style={{
									display: "flex",
									gap: 16,
									padding: "16px 0",
									borderTop: "1px solid var(--glass-stroke)",
								}}
							>
								<span
									style={{
										width: 44,
										height: 44,
										borderRadius: "50%",
										display: "grid",
										placeItems: "center",
										background: "rgba(217,180,106,.14)",
										color: "var(--bronze-300)",
										flexShrink: 0,
									}}
								>
									<Icon name={ic} size={20} />
								</span>
								<div>
									<div style={{ font: "var(--type-h4)", color: "#fff" }}>
										{t}
									</div>
									<div
										style={{
											font: "400 15px/1.5 var(--font-sans)",
											color: "var(--text-muted)",
										}}
									>
										{d}
									</div>
								</div>
							</div>
						</Reveal>
					))}
				</div>
				<Button
					size="lg"
					variant="pearl"
					iconRight="arrow-right"
					onClick={() => navigate({ to: "/peceras-a-medida" })}
				>
					Empezar mi diseño
				</Button>
			</div>
		</section>
	);
}

function FeaturedFish() {
	const navigate = useNavigate();
	const { add } = useStore();
	const items = products.filter((p) => p.cat === "Peces").slice(0, 4);
	return (
		<section
			data-screen-label="Inicio — destacados"
			style={{
				maxWidth: "var(--container-max)",
				margin: "0 auto",
				padding: "40px var(--gutter) 120px",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "end",
					justifyContent: "space-between",
					gap: 24,
					marginBottom: 32,
					flexWrap: "wrap",
				}}
			>
				<Reveal>
					<div className="pos-overline">Recién llegados</div>
					<h2 style={{ font: "var(--type-h1)", marginTop: 12 }}>
						Peces de la semana
					</h2>
				</Reveal>
				<Button
					variant="glass"
					iconRight="arrow-right"
					onClick={() => navigate({ to: "/tienda" })}
				>
					Ver todos
				</Button>
			</div>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
					gap: 20,
				}}
			>
				{items.map((p, i) => (
					<Reveal key={p.id} delay={i * 90}>
						<ProductCard
							image={p.img && imageUrl(p.img)}
							name={p.name}
							subtitle={p.latin}
							price={p.price}
							compareAt={p.compareAt}
							badge={p.badge}
							specs={p.specs}
							onAdd={() => add(p)}
							onClick={() =>
								navigate({
									to: "/tienda/$productId",
									params: { productId: p.id },
								})
							}
							style={{ height: "100%" }}
						/>
					</Reveal>
				))}
			</div>
		</section>
	);
}

function OwnerBand() {
	return (
		<section
			data-screen-label="Inicio — quién te atiende"
			style={{
				position: "relative",
				overflow: "hidden",
				padding: "140px var(--gutter)",
			}}
		>
			<Parallax speed={0.3} style={{ position: "absolute", inset: "-15% 0" }}>
				<VideoBackdrop
					src="/assets/video/colorful-aquarium-small-fish.mp4"
					poster={imageUrl("colorful-aquarium-small-fish")}
					blur={10}
					dim={0.35}
					scrim="none"
				/>
			</Parallax>
			<div
				style={{
					position: "relative",
					maxWidth: "var(--container-max)",
					margin: "0 auto",
					display: "grid",
					gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)",
					gap: 32,
					alignItems: "center",
				}}
			>
				<Reveal>
					<GlassPanel intensity="smoked" padding={48}>
						<div className="pos-overline">Quién te atiende</div>
						<h2 style={{ font: "var(--type-h1)", margin: "14px 0 20px" }}>
							Un acuario de barrio, atendido por su dueño.
						</h2>
						<p style={{ font: "var(--type-body-lg)" }}>
							Acuario Poseidón es un negocio de una sola persona. Quien te
							contesta el mensaje es el mismo que elige cada pez, revisa cada
							pecera y te explica, sin prisa, lo que necesita tu acuario.
						</p>
						<div
							style={{
								display: "flex",
								gap: 12,
								marginTop: 28,
								flexWrap: "wrap",
							}}
						>
							<Button iconLeft="message-circle">Escríbenos</Button>
							<Button variant="glass" iconLeft="map-pin">
								Cómo llegar
							</Button>
						</div>
					</GlassPanel>
				</Reveal>
				<Reveal delay={150}>
					<div
						style={{
							position: "relative",
							aspectRatio: "4/5",
							borderRadius: "var(--radius-2xl)",
							overflow: "hidden",
							border: "1px solid var(--glass-stroke)",
						}}
					>
						<PhotoSlot icon="user" label="Foto del dueño en la tienda" />
					</div>
				</Reveal>
			</div>
		</section>
	);
}

export function Landing() {
	return (
		<>
			<Hero />
			<Marquee />
			<CategoryRail />
			<CustomTankTeaser />
			<FeaturedFish />
			<OwnerBand />
		</>
	);
}
