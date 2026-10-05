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
	const s = 2.2;
	const w = L * s;
	const h = Hh * s;
	const d = W * s * 0.5;
	return (
		<div
			style={{
				position: "relative",
				width: w + d,
				height: h + d,
				transition: "all var(--dur-slow) var(--ease-current)",
			}}
		>
			<div
				style={{
					position: "absolute",
					left: d,
					top: 0,
					width: w,
					height: h,
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
					top: d,
					width: w,
					height: h,
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
			<svg
				aria-hidden="true"
				style={{
					position: "absolute",
					left: d,
					top: 0,
					width: 1,
					height: 1,
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
				/>
				<line
					x1={w}
					y1="0"
					x2={w - d}
					y2={d}
					stroke="rgba(214,251,247,.35)"
					strokeWidth="1.5"
				/>
				<line
					x1={w}
					y1={h}
					x2={w - d}
					y2={h + d}
					stroke="rgba(214,251,247,.35)"
					strokeWidth="1.5"
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
			style={{
				maxWidth: "var(--container-max)",
				margin: "0 auto",
				padding: "130px var(--gutter) 100px",
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
				style={{
					display: "grid",
					gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)",
					gap: 28,
					alignItems: "start",
				}}
			>
				<GlassPanel
					padding={32}
					glow="bronze"
					style={{
						position: "sticky",
						top: 100,
						minHeight: 520,
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							display: "flex",
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
						style={{
							flex: 1,
							display: "grid",
							placeItems: "center",
							padding: "24px 0",
							minHeight: 340,
						}}
					>
						<TankPreview L={L} W={W} Hh={Hh} glass={glass} />
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
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
								style={{ font: "500 32px/1.2 var(--font-mono)", color: "#fff" }}
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
									font: "500 32px/1.2 var(--font-mono)",
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
						padding={28}
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
						padding={28}
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
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3,1fr)",
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
					<GlassPanel intensity="smoked" padding={28}>
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
