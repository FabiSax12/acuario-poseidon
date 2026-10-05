export type GlassType = "std" | "extra";
export type StandType = "none" | "mel" | "wood";

export interface TankExtras {
	led: boolean;
	filter: boolean;
	heater: boolean;
}

/** Dimensions in centimetres. */
export interface TankDimensions {
	length: number;
	width: number;
	height: number;
}

export interface TankConfig extends TankDimensions {
	glass: GlassType;
	stand: StandType;
	extras: TankExtras;
}

export const DEFAULT_TANK_CONFIG: TankConfig = {
	length: 100,
	width: 40,
	height: 50,
	glass: "std",
	stand: "none",
	extras: { led: true, filter: true, heater: false },
};

export const STAND_PRICES: Record<StandType, number> = {
	none: 0,
	mel: 140,
	wood: 260,
};

export const EXTRA_PRICES: Record<keyof TankExtras, number> = {
	led: 65,
	filter: 90,
	heater: 25,
};

const PRICE_PER_LITER = 1.1;
const EXTRA_CLEAR_PER_LITER = 0.45;

export const tankLiters = ({ length, width, height }: TankDimensions) =>
	Math.round((length * width * height) / 1000);

/** The surcharge quoted next to the extra-clear glass option. */
export const extraClearGlassSurcharge = (liters: number) =>
	Math.round(liters * EXTRA_CLEAR_PER_LITER);

export const tankPrice = (config: TankConfig) => {
	const liters = tankLiters(config);
	return Math.round(
		liters * PRICE_PER_LITER +
			(config.glass === "extra" ? liters * EXTRA_CLEAR_PER_LITER : 0) +
			STAND_PRICES[config.stand] +
			(config.extras.led ? EXTRA_PRICES.led : 0) +
			(config.extras.filter ? EXTRA_PRICES.filter : 0) +
			(config.extras.heater ? EXTRA_PRICES.heater : 0),
	);
};
