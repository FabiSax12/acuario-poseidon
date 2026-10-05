import { describe, expect, it } from "vitest";
import {
	DEFAULT_TANK_CONFIG,
	extraClearGlassSurcharge,
	type TankConfig,
	tankLiters,
	tankPrice,
} from "./custom-tank";

describe("default configuration", () => {
	it("is 100 × 40 × 50 cm, standard glass, no stand, LED lid and filter", () => {
		expect(DEFAULT_TANK_CONFIG).toEqual({
			length: 100,
			width: 40,
			height: 50,
			glass: "std",
			stand: "none",
			extras: { led: true, filter: true, heater: false },
		});
	});

	it("holds 200 litres", () => {
		expect(tankLiters(DEFAULT_TANK_CONFIG)).toBe(200);
	});

	it("is estimated at 375", () => {
		// 200 L * 1.1 + LED 65 + filter 90
		expect(tankPrice(DEFAULT_TANK_CONFIG)).toBe(375);
	});
});

describe("fully loaded configuration", () => {
	const loaded: TankConfig = {
		length: 120,
		width: 50,
		height: 60,
		glass: "extra",
		stand: "wood",
		extras: { led: true, filter: true, heater: true },
	};

	it("holds 360 litres", () => {
		expect(tankLiters(loaded)).toBe(360);
	});

	it("adds extra-clear glass, the stand and every extra", () => {
		// 360 * 1.1 = 396, glass 360 * 0.45 = 162, wood 260, 65 + 90 + 25
		expect(tankPrice(loaded)).toBe(998);
	});

	it("charges the default size 750 with the same options", () => {
		// 220 + 90 + 260 + 180
		expect(tankPrice({ ...loaded, length: 100, width: 40, height: 50 })).toBe(
			750,
		);
	});
});

describe("rounding and options", () => {
	it("rounds litres to the nearest whole litre", () => {
		// 45 * 25 * 30 / 1000 = 33.75
		expect(tankLiters({ length: 45, width: 25, height: 30 })).toBe(34);
	});

	it("prices from the rounded litres and rounds the total", () => {
		// 34 * 1.1 = 37.4, + 140 melamine stand = 177.4
		expect(
			tankPrice({
				length: 45,
				width: 25,
				height: 30,
				glass: "std",
				stand: "mel",
				extras: { led: false, filter: false, heater: false },
			}),
		).toBe(177);
	});

	it("quotes the extra-clear surcharge as 45% of the litres, rounded", () => {
		expect(extraClearGlassSurcharge(200)).toBe(90);
		expect(extraClearGlassSurcharge(34)).toBe(15);
	});
});
