import { useState } from "react";
import { Badge } from "#/components/ds/Badge";
import { Button } from "#/components/ds/Button";
import { Checkbox } from "#/components/ds/Checkbox";
import { GlassPanel } from "#/components/ds/GlassPanel";
import { Radio } from "#/components/ds/Radio";
import { RangeSlider } from "#/components/ds/RangeSlider";
import {
	DEFAULT_TANK_CONFIG,
	extraClearGlassSurcharge,
	type GlassType,
	STAND_PRICES,
	type StandType,
	type TankExtras,
	tankLiters,
	tankPrice,
} from "#/lib/custom-tank";
import { money } from "#/lib/money";
import { useStore } from "./StoreProvider";

// Widest the preview gets, in centimetres: the longest tank plus the depth
// offset of the deepest one (see the RangeSlider limits below).
const TANK_MAX_SPAN = 200 + 80 * 0.5;

// Padding of the option panels: 28px by design, tighter on narrow screens.
const PANEL_PAD = "clamp(20px, 5vw, 28px)";
// Volume and price readouts: 32px by design, smaller on narrow screens.
const STAT_SIZE = "clamp(24px, 6.5vw, 32px)";

const STANDS: [value: StandType, label: string][] = [
	["none", "Sin mueble"],
	["mel", "Melamina"],
	["wood", "Madera"],
];

function TankPreview({
	L,
	W,
	Hh,
	glass,
}: {
	L: number;
	W: number;
	Hh: number;
	glass: GlassType;
}) {
	// Drawn in centimetres and scaled by --tank-unit: 2.2px per cm by design,
	// less when the largest tank (200 + 80/2 cm across) would not fit the
	// enclosing container.
	const w = L;
	const h = Hh;
	const d = W * 0.5;
	const cm = (n: number) => `calc(${n} * var(--tank-unit))`;
	return (
		<div
			style={
				{
					"--tank-unit": `min(2.2px, 100cqw / ${TANK_MAX_SPAN})`,
					position: "relative",
					width: cm(w + d),
					height: cm(h + d),
					transition: "all var(--dur-slow) var(--ease-current)",
				} as React.CSSProperties
			}
		>
			<div
				style={{
					position: "absolute",
					left: cm(d),
					top: 0,
					width: cm(w),
					height: cm(h),
					border: "1.5px solid rgba(214,251,247,.35)",
					borderRadius: 4,
					background: "rgba(63,211,198,.05)",
					transition: "all var(--dur-slow) var(--ease-current)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: 0,
					top: cm(d),
					width: cm(w),
					height: cm(h),
					borderRadius: 4,
					overflow: "hidden",
					border: `1.5px solid ${glass === "extra" ? "rgba(255,255,255,.75)" : "rgba(166,242,234,.55)"}`,
					background:
						"linear-gradient(180deg, rgba(111,230,218,.10) 0%, rgba(63,211,198,.28) 18%, rgba(19,140,132,.45) 100%)",
					boxShadow: "inset 0 1px 0 rgba(255,255,255,.4), var(--shadow-3)",
					backdropFilter: "blur(6px)",
					WebkitBackdropFilter: "blur(6px)",
					transition: "all var(--dur-slow) var(--ease-current)",
				}}
			>
				<div
					style={{
						position: "absolute",
						left: 0,
						right: 0,
						top: "16%",
						height: 1,
						background: "rgba(255,255,255,.45)",
					}}
				/>
			</div>
			{/* One user unit is one centimetre, so the edges scale with the boxes. */}
			<svg
				aria-hidden="true"
				viewBox="0 0 1 1"
				style={{
					position: "absolute",
					left: cm(d),
					top: 0,
					width: cm(1),
					height: cm(1),
					overflow: "visible",
				}}
			>
				<line
					x1="0"
					y1="0"
					x2={-d}
					y2={d}
					stroke="rgba(214,251,247,.35)"
					strokeWidth="1.5"
					vectorEffect="non-scaling-stroke"
				/>
				<line
					x1={w}
					y1="0"
					x2={w - d}
					y2={d}
					stroke="rgba(214,251,247,.35)"
					strokeWidth="1.5"
					vectorEffect="non-scaling-stroke"
				/>
				<line
					x1={w}
					y1={h}
					x2={w - d}
					y2={h + d}
					stroke="rgba(214,251,247,.35)"
					strokeWidth="1.5"
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
		</div>
	);
}

export function CustomTank() {
	const { showToast } = useStore();
	const [L, setL] = useState(DEFAULT_TANK_CONFIG.length);
	const [W, setW] = useState(DEFAULT_TANK_CONFIG.width);
	const [Hh, setH] = useState(DEFAULT_TANK_CONFIG.height);
	const [glass, setGlass] = useState<GlassType>(DEFAULT_TANK_CONFIG.glass);
	const [stand, setStand] = useState<StandType>(DEFAULT_TANK_CONFIG.stand);
	const [extras, setExtras] = useState<TankExtras>(DEFAULT_TANK_CONFIG.extras);
	const config = { length: L, width: W, height: Hh, glass, stand, extras };
	const liters = tankLiters(config);
	const price = tankPrice(config);
	const tog = (k: keyof TankExtras) => (v: boolean) =>
		setExtras({ ...extras, [k]: v });
	return (
		<section
			data-screen-label="Peceras a medida"
			className="px-[var(--gutter)] pt-[112px] pb-[72px] lg:pt-[130px] lg:pb-[100px]"
			style={{
				maxWidth: "var(--container-max)",
				margin: "0 auto",
			}}
		>
			<div className="pos-overline" style={{ color: "var(--bronze-300)" }}>
				Peceras a medida
			</div>
			<h1
				style={{
					font: "400 var(--fs-display-md)/1.02 var(--font-display)",
					margin: "12px 0 36px",
				}}
			>
				Diseña tu pecera
			</h1>
			<div
				className="grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
				style={{
					display: "grid",
					gap: 28,
					alignItems: "start",
				}}
			>
				{/* The preview follows the scroll only beside the controls; stacked
				    above them it would cover the form. `!` because GlassPanel sets
				    its position inline. */}
				<GlassPanel
					padding="clamp(20px, 5vw, 32px)"
					glow="bronze"
					className="lg:sticky! lg:top-[100px] lg:min-h-[520px]"
					style={{
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: 8,
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Badge tone="bronze" icon="sparkles">
							A medida
						</Badge>
						<span
							style={{
								font: "400 14px/1 var(--font-mono)",
								color: "var(--text-muted)",
							}}
						>
							{L} × {W} × {Hh} cm
						</span>
					</div>
					<div
						className="min-h-[200px] lg:min-h-[340px]"
						style={{
							flex: 1,
							display: "grid",
							placeItems: "center",
							padding: "24px 0",
							containerType: "inline-size",
						}}
					>
						<TankPreview L={L} W={W} Hh={Hh} glass={glass} />
					</div>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							justifyContent: "space-between",
							gap: 16,
							paddingTop: 20,
							borderTop: "1px solid var(--glass-stroke)",
						}}
					>
						<div>
							<div
								style={{
									font: "600 11px/1 var(--font-sans)",
									letterSpacing: ".12em",
									textTransform: "uppercase",
									color: "var(--text-faint)",
								}}
							>
								Volumen
							</div>
							<div
								style={{
									font: `500 ${STAT_SIZE}/1.2 var(--font-mono)`,
									color: "#fff",
								}}
							>
								{liters} L
							</div>
						</div>
						<div style={{ textAlign: "right" }}>
							<div
								style={{
									font: "600 11px/1 var(--font-sans)",
									letterSpacing: ".12em",
									textTransform: "uppercase",
									color: "var(--text-faint)",
								}}
							>
								Precio estimado
							</div>
							<div
								style={{
									font: `500 ${STAT_SIZE}/1.2 var(--font-mono)`,
									color: "var(--bronze-300)",
								}}
							>
								{money(price)}
							</div>
						</div>
					</div>
				</GlassPanel>
				<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
					<GlassPanel
						intensity="smoked"
						padding={PANEL_PAD}
						style={{ display: "flex", flexDirection: "column", gap: 22 }}
					>
						<h3 style={{ font: "var(--type-h4)" }}>1 · Medidas</h3>
						<RangeSlider
							label="Largo"
							value={L}
							min={40}
							max={200}
							step={5}
							unit="cm"
							onChange={setL}
						/>
						<RangeSlider
							label="Fondo"
							value={W}
							min={25}
							max={80}
							step={5}
							unit="cm"
							onChange={setW}
						/>
						<RangeSlider
							label="Alto"
							value={Hh}
							min={30}
							max={80}
							step={5}
							unit="cm"
							onChange={setH}
						/>
					</GlassPanel>
					<GlassPanel
						intensity="smoked"
						padding={PANEL_PAD}
						style={{ display: "flex", flexDirection: "column", gap: 10 }}
					>
						<h3 style={{ font: "var(--type-h4)", marginBottom: 6 }}>
							2 · Vidrio y mueble
						</h3>
						<Radio<GlassType>
							variant="card"
							name="glass"
							value="std"
							checked={glass === "std"}
							onChange={setGlass}
							label="Vidrio estándar"
							aside="Incluido"
						/>
						<Radio<GlassType>
							variant="card"
							name="glass"
							value="extra"
							checked={glass === "extra"}
							onChange={setGlass}
							label="Vidrio extra-claro"
							description="Sin tono verde, máxima transparencia"
							aside={`+${money(extraClearGlassSurcharge(liters))}`}
						/>
						{/* Three across only where each card has room for its label. */}
						<div
							className="grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
							style={{
								display: "grid",
								gap: 10,
								marginTop: 6,
							}}
						>
							{STANDS.map(([v, l]) => (
								<Radio
									key={v}
									variant="card"
									name="stand"
									value={v}
									checked={stand === v}
									onChange={setStand}
									label={l}
									description={
										STAND_PRICES[v] ? `+${money(STAND_PRICES[v])}` : "Incluido"
									}
								/>
							))}
						</div>
					</GlassPanel>
					<GlassPanel intensity="smoked" padding={PANEL_PAD}>
						<h3 style={{ font: "var(--type-h4)", marginBottom: 6 }}>
							3 · Equipamiento
						</h3>
						<Checkbox
							label="Tapa con iluminación LED"
							description="+$65 · con temporizador"
							checked={extras.led}
							onChange={tog("led")}
						/>
						<Checkbox
							label="Filtro dimensionado al volumen"
							description="+$90"
							checked={extras.filter}
							onChange={tog("filter")}
						/>
						<Checkbox
							label="Calentador"
							description="+$25 · para peces tropicales"
							checked={extras.heater}
							onChange={tog("heater")}
						/>
					</GlassPanel>
					<Button
						size="lg"
						variant="primary"
						iconRight="arrow-right"
						full
						onClick={() =>
							showToast({
								tone: "success",
								title: "Solicitud enviada",
								message: "Te escribimos para confirmar medidas y precio final.",
							})
						}
					>
						Pedir cotización
					</Button>
				</div>
			</div>
		</section>
	);
}
