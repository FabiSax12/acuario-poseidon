import { describe, expect, it } from "vitest";
import type { Product } from "#/data/catalog";
import type { TProduct } from "#/types/strapi";
import { mapProduct } from "./product-mapper";

const MEDIA_BASE = "http://localhost:1337";

const entry = (extra: Partial<TProduct> = {}): TProduct => ({
	id: 1,
	documentId: "doc-1",
	name: "Pez payaso",
	slug: "payaso",
	category: "peces",
	price: 24,
	...extra,
});

/** The mapped product, for the tests that expect the entry to be accepted. */
const toProduct = (source: TProduct, mediaBaseUrl: string): Product => {
	const result = mapProduct(source, mediaBaseUrl);
	if (!result.ok) throw new Error(result.reason);
	return result.product;
};

const image = (url: string) => ({
	id: 7,
	documentId: "img-7",
	alternativeText: null,
	url,
});

describe("toProduct", () => {
	it("uses the slug as the product id", () => {
		expect(toProduct(entry({ slug: "pez-leon" }), MEDIA_BASE).id).toBe(
			"pez-leon",
		);
	});

	it.each([
		["peces", "Peces"],
		["alimento", "Alimento"],
		["equipos", "Equipos"],
		["plantas", "Plantas y decoración"],
	] as const)("maps category key %s to the label %s", (key, label) => {
		expect(toProduct(entry({ category: key }), MEDIA_BASE).cat).toBe(label);
	});

	it("rejects an entry whose category is not a known key", () => {
		const broken = entry({ category: "corales" as TProduct["category"] });
		expect(mapProduct(broken, MEDIA_BASE)).toEqual({
			ok: false,
			reason: 'unknown category "corales"',
		});
	});

	it.each([
		["null", null],
		["a blank string", " "],
		["text", "gratis"],
		["NaN", Number.NaN],
		["Infinity", Number.POSITIVE_INFINITY],
	])("rejects an entry whose price is %s", (_case, price) => {
		const broken = entry({ price: price as unknown as number });
		const result = mapProduct(broken, MEDIA_BASE);
		expect(result.ok).toBe(false);
		expect(result).toHaveProperty(
			"reason",
			expect.stringContaining("price is not a number"),
		);
	});

	it("accepts an entry without warnings when every field is valid", () => {
		const result = mapProduct(entry({ water: "dulce" }), MEDIA_BASE);
		expect(result).toMatchObject({ ok: true, warnings: [] });
	});

	it("keeps the product but warns when the water key is unknown", () => {
		const result = mapProduct(
			entry({ water: "salobre" as TProduct["water"] }),
			MEDIA_BASE,
		);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.product).not.toHaveProperty("water");
		expect(result.warnings).toEqual(['unknown water "salobre"']);
	});

	it("drops a compareAt that is not a number and warns", () => {
		const result = mapProduct(
			entry({ compareAt: "antes" as unknown as number }),
			MEDIA_BASE,
		);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.product).not.toHaveProperty("compareAt");
		expect(result.warnings).toEqual(["compareAt is not a number"]);
	});

	it.each([
		["dulce", "Agua dulce"],
		["salada", "Agua salada"],
	] as const)("maps water key %s to the label %s", (key, label) => {
		expect(toProduct(entry({ water: key }), MEDIA_BASE).water).toBe(label);
	});

	it("maps subtitle to latin and defaults it to an empty string", () => {
		expect(
			toProduct(entry({ subtitle: "Amphiprion ocellaris" }), MEDIA_BASE).latin,
		).toBe("Amphiprion ocellaris");
		expect(toProduct(entry({ subtitle: null }), MEDIA_BASE).latin).toBe("");
	});

	it("trims the subtitle", () => {
		expect(
			toProduct(entry({ subtitle: "  Poecilia reticulata " }), MEDIA_BASE)
				.latin,
		).toBe("Poecilia reticulata");
		expect(toProduct(entry({ subtitle: "   " }), MEDIA_BASE).latin).toBe("");
	});

	it("returns prices as numbers even when Strapi sends decimal strings", () => {
		const product = toProduct(
			entry({
				price: "4.50" as unknown as number,
				compareAt: "6" as unknown as number,
			}),
			MEDIA_BASE,
		);
		expect(product.price).toBe(4.5);
		expect(product.compareAt).toBe(6);
	});

	it("prefixes a relative media URL with the media base URL", () => {
		const product = toProduct(
			entry({ image: image("/uploads/payaso.jpg") }),
			MEDIA_BASE,
		);
		expect(product.image).toBe("http://localhost:1337/uploads/payaso.jpg");
	});

	it("does not double the slash when the media base URL ends with one", () => {
		const product = toProduct(
			entry({ image: image("/uploads/payaso.jpg") }),
			"http://localhost:1337/",
		);
		expect(product.image).toBe("http://localhost:1337/uploads/payaso.jpg");
	});

	it.each([
		"https://cdn.example.com/payaso.jpg",
		"http://cdn.example.com/payaso.jpg",
		"//cdn.example.com/payaso.jpg",
	])("keeps the absolute media URL %s untouched", (url) => {
		expect(toProduct(entry({ image: image(url) }), MEDIA_BASE).image).toBe(url);
	});

	it("falls back to the icon when there is no image", () => {
		const product = toProduct(
			entry({ image: null, icon: "fish-symbol" }),
			MEDIA_BASE,
		);
		expect(product).not.toHaveProperty("image");
		expect(product.icon).toBe("fish-symbol");
	});

	it("drops an icon the storefront does not know", () => {
		const product = toProduct(entry({ icon: "unicorn" }), MEDIA_BASE);
		expect(product).not.toHaveProperty("icon");
	});

	it("builds the badge when label and tone are both set", () => {
		const product = toProduct(
			entry({ badgeLabel: "Favorito", badgeTone: "tide" }),
			MEDIA_BASE,
		);
		expect(product.badge).toEqual({ label: "Favorito", tone: "tide" });
	});

	it.each([
		["only the label", { badgeLabel: "Favorito", badgeTone: null }],
		["only the tone", { badgeLabel: null, badgeTone: "tide" }],
		["a blank label", { badgeLabel: "  ", badgeTone: "tide" }],
		["an unknown tone", { badgeLabel: "Favorito", badgeTone: "magenta" }],
	])("omits the badge with %s", (_case, fields) => {
		expect(toProduct(entry(fields), MEDIA_BASE)).not.toHaveProperty("badge");
	});

	it("flattens the specs component into a list of strings", () => {
		const product = toProduct(
			entry({
				specs: [
					{ id: 1, text: "24–27 °C" },
					{ id: 2, text: "pH 8.1–8.4" },
				],
			}),
			MEDIA_BASE,
		);
		expect(product.specs).toEqual(["24–27 °C", "pH 8.1–8.4"]);
	});

	it("trims specs and drops the ones whose text is null or blank", () => {
		const product = toProduct(
			entry({
				specs: [
					{ id: 1, text: " 8 cm " },
					{ id: 2, text: "   " },
					{ id: 3, text: null as unknown as string },
					{ id: 4, text: "Lavada" },
				],
			}),
			MEDIA_BASE,
		);
		expect(product.specs).toEqual(["8 cm", "Lavada"]);
	});

	it("returns an empty specs list when the component is missing", () => {
		expect(toProduct(entry({ specs: null }), MEDIA_BASE).specs).toEqual([]);
		expect(toProduct(entry(), MEDIA_BASE).specs).toEqual([]);
	});

	it("maps inStock to stock and treats an unset value as available", () => {
		expect(toProduct(entry({ inStock: false }), MEDIA_BASE).stock).toBe(false);
		expect(toProduct(entry({ inStock: true }), MEDIA_BASE).stock).toBe(true);
		expect(toProduct(entry({ inStock: null }), MEDIA_BASE).stock).toBe(true);
	});

	it("drops optional fields that Strapi returns as null", () => {
		const product = toProduct(
			entry({
				water: null,
				compareAt: null,
				image: null,
				icon: null,
				badgeLabel: null,
				badgeTone: null,
				beginner: null,
				temp: null,
				ph: null,
				size: null,
				mates: null,
			}),
			MEDIA_BASE,
		);
		expect(product).toEqual({
			id: "payaso",
			cat: "Peces",
			name: "Pez payaso",
			latin: "",
			price: 24,
			specs: [],
			stock: true,
		});
	});

	it("maps a fully populated entry", () => {
		const product = toProduct(
			entry({
				water: "salada",
				subtitle: "Amphiprion ocellaris",
				compareAt: 30,
				image: image("/uploads/payaso.jpg"),
				badgeLabel: "Favorito",
				badgeTone: "tide",
				specs: [{ id: 1, text: "8 cm" }],
				beginner: true,
				inStock: true,
				temp: "24–27 °C",
				ph: "8.1–8.4",
				size: "8 cm",
				mates: "Pacífico — convive en comunidad",
			}),
			MEDIA_BASE,
		);
		expect(product).toEqual({
			id: "payaso",
			cat: "Peces",
			water: "Agua salada",
			name: "Pez payaso",
			latin: "Amphiprion ocellaris",
			price: 24,
			compareAt: 30,
			image: "http://localhost:1337/uploads/payaso.jpg",
			badge: { label: "Favorito", tone: "tide" },
			specs: ["8 cm"],
			beginner: true,
			stock: true,
			temp: "24–27 °C",
			ph: "8.1–8.4",
			size: "8 cm",
			mates: "Pacífico — convive en comunidad",
		});
	});
});
