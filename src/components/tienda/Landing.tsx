import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/ds/Button";
import { GlassPanel } from "#/components/ds/GlassPanel";
import { HorizontalScroll } from "#/components/ds/HorizontalScroll";
import { Icon, type IconName } from "#/components/ds/Icon";
import { Parallax } from "#/components/ds/Parallax";
import { ProductCard } from "#/components/ds/ProductCard";
import { Reveal } from "#/components/ds/Reveal";
import { VideoBackdrop } from "#/components/ds/VideoBackdrop";
import { categories, imageUrl } from "#/data/catalog";
import { productsQueryOptions } from "#/data/queries/products";
import { PhotoSlot } from "./PhotoSlot";
import { useStore } from "./StoreProvider";

// The shop's WhatsApp, the same number the footer lists.
const WHATSAPP_URL = "https://wa.me/50685802511";
// The shop's Google Maps listing.
const MAPS_URL = "https://maps.app.goo.gl/tpzBEzGY44NVvhkQ8";
const WAZE_URL =
	"https://ul.waze.com/ul?place=ChIJNetuAgBjoI8Rcm5Y5IXpcwo&ll=10.38961820%2C-84.33832080&navigate=yes";

function Hero() {
	const navigate = useNavigate();
	return (
		<section
			data-screen-label="Inicio — hero"
			// svh: the hero must fit under mobile browser chrome.
			className="min-h-svh"
			style={{
				position: "relative",
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
				// The top padding keeps the copy clear of the fixed nav when the
				// stacked hero is taller than the screen.
				className="grid-cols-1 gap-10 px-[var(--gutter)] pt-[120px] pb-[12svh] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:pt-0"
				style={{
					position: "relative",
					width: "100%",
					maxWidth: "var(--container-max)",
					margin: "0 auto",
					boxSizing: "border-box",
					display: "grid",
					alignItems: "end",
				}}
			>
				<Parallax speed={-0.12}>
					<Reveal>
						{/* Wraps on narrow screens, where the overline's line-height of 1
						    is too tight; `!` because .pos-overline is unlayered. */}
						<div className="pos-overline max-lg:leading-[1.5]!">
							Acuario Poseidón · Peces · Peceras · Todo para tu acuario
						</div>
					</Reveal>
					<Reveal delay={120}>
						<h1
							style={{
								// 14vw only takes over below 400px, so the longest line still fits.
								font: "400 min(14vw, clamp(56px,8vw,112px))/0.98 var(--font-display)",
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
				{/* Desktop only: stacked under the copy it would drift over it, and
				    the second button above already leads to the same page. */}
				<Parallax
					speed={-0.3}
					className="hidden lg:block"
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

// 120px by design, reached at 1024px; scales down with narrower screens.
const MARQUEE_SIZE = "clamp(64px, 11.72vw, 120px)";

function Marquee() {
	const words =
		"Peces · Corales · Plantas · Peceras · Alimento · Filtros · Luces · ";
	return (
		<div
			aria-hidden="true"
			className="pt-8 pb-4 lg:pt-14 lg:pb-6"
			style={{
				overflow: "hidden",
				whiteSpace: "nowrap",
			}}
		>
			<Parallax axis="x" speed={0.6}>
				<div
					style={{
						font: `400 ${MARQUEE_SIZE}/1 var(--font-display)`,
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
						font: `400 ${MARQUEE_SIZE}/1 var(--font-display)`,
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
						height: "min(52svh,480px)",
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
			className="grid-cols-1 gap-10 px-[var(--gutter)] py-[72px] lg:grid-cols-2 lg:gap-16 lg:py-[120px]"
			style={{
				maxWidth: "var(--container-max)",
				margin: "0 auto",
				display: "grid",
				alignItems: "center",
			}}
		>
			<div
				className="h-[300px] sm:h-[420px] lg:h-[560px]"
				style={{
					position: "relative",
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
	const { data: products } = useSuspenseQuery(productsQueryOptions());
	const items = products.filter((p) => p.cat === "Peces").slice(0, 4);
	return (
		<section
			data-screen-label="Inicio — destacados"
			className="px-[var(--gutter)] pt-10 pb-[72px] lg:pb-[120px]"
			style={{
				maxWidth: "var(--container-max)",
				margin: "0 auto",
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
							image={p.image}
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
							style={{ height: "100%", boxSizing: "border-box" }}
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
			className="px-[var(--gutter)] py-20 lg:py-[140px]"
			style={{
				position: "relative",
				overflow: "hidden",
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
				className="grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
				style={{
					position: "relative",
					maxWidth: "var(--container-max)",
					margin: "0 auto",
					display: "grid",
					gap: 32,
					alignItems: "center",
				}}
			>
				<Reveal>
					<GlassPanel intensity="smoked" padding="clamp(24px, 6vw, 48px)">
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
							<Button
								iconLeft="message-circle"
								href={WHATSAPP_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								Escríbenos
							</Button>
							<Button
								variant="glass"
								iconLeft="map-pin"
								href={WAZE_URL}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Cómo llegar con Waze"
							>
								Waze
							</Button>
							<Button
								variant="glass"
								iconLeft="map-pin"
								href={MAPS_URL}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Cómo llegar con Google Maps"
							>
								Google Maps
							</Button>
						</div>
					</GlassPanel>
				</Reveal>
				<Reveal delay={150}>
					<div
						className="aspect-[4/3] lg:aspect-[4/5]"
						style={{
							position: "relative",
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
