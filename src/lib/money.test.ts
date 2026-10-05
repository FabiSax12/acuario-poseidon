import { describe, expect, it } from "vitest";
import { money } from "./money";

describe("money", () => {
	it("formats whole numbers without decimals", () => {
		expect(money(24)).toBe("$24");
		expect(money(119)).toBe("$119");
		expect(money(0)).toBe("$0");
	});

	it("formats fractional amounts with two decimals and a Spanish decimal comma", () => {
		expect(money(4.5)).toBe("$4,50");
		expect(money(13.5)).toBe("$13,50");
	});

	it("caps fractions at two decimals", () => {
		expect(money(9.999)).toBe("$10,00");
		expect(money(2.346)).toBe("$2,35");
	});

	it("groups thousands the Spanish way", () => {
		expect(money(12345)).toBe("$12.345");
	});
});
