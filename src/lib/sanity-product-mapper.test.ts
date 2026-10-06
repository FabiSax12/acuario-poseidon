import { describe, expect, it } from "vitest";
import type { Product } from "#/data/catalog";
import {
	mapSanityProduct,
	PRODUCT_IMAGE_WIDTH,
	type SanityProduct,
} from "./sanity-product-mapper";

const PROJECT = { projectId: "abc123", dataset: "production" };

const ASSET_REF = "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg";

const doc = (extra: Partial<SanityProduct> = {}): SanityProduct => ({
	_id: "product-payaso",
	name: "Pez payaso",
	slug: "payaso",
	category: "peces",
	price: 24,
	...extra,
});

/** The mapped product, for the tests that expect the document to be accepted. */
const toProduct = (source: SanityProduct): Product => {
	const result = mapSanityProduct(source, PROJECT);
	if (!result.ok) throw new Error(result.reason);
	return result.product;
};

const image = (ref: string = ASSET_REF) => ({
	_type: "image",
	asset: { _type: "reference", _ref: ref },
});

const spec = (text: unknown, key = "k") => ({ _key: key, _type: "spec", text });

describe("mapSanityProduct", () => {
	it("uses the slug as the product id", () => {
		expect(toProduct(doc({ slug: "pez-leon" })).id).toBe("pez-leon");
	});

	it.each([
		["missing", undefined],
		["null", null],
		["blank", "  "],
	])("rejects a document whose slug is %s", (_case, slug) => {
		expect(mapSanityProduct(doc({ slug }), PROJECT)).toEqual({
			ok: false,
			reason: "slug is missing",
		});
	});

	it.each([
		["missing", undefined],
		["blank", " "],
	])("rejects a document whose name is %s", (_case, name) => {
		expect(mapSanityProduct(doc({ name }), PROJECT)).toEqual({
			ok: false,
			reason: "name is missing",
		});
	});

	it.each([
		["peces", "Peces"],
		["alimento", "Alimento"],
		["equipos", "Equipos"],
		["plantas", "Plantas y decoración"],
	] as const)("maps category key %s to the label %s", (key, label) => {
		expect(toProduct(doc({ category: key })).cat).toBe(label);
	});

	it.each([
		["corales", 'unknown category "corales"'],
		// An inherited property name must not pass as a category.
		["toString", 'unknown category "toString"'],
		[undefined, 'unknown category "undefined"'],
	])("rejects a document whose category is %s", (category, reason) => {
		expect(mapSanityProduct(doc({ category }), PROJECT)).toEqual({
			ok: false,
			reason,
		});
	});

	it.each([
		["missing", undefined],
		["null", null],
		["text", "24"],
		["NaN", Number.NaN],
		["Infinity", Number.POSITIVE_INFINITY],
		["negative", -1],
	])("rejects a document whose price is %s", (_case, price) => {
		const broken = doc({ price: price as SanityProduct["price"] });
		expect(mapSanityProduct(broken, PROJECT)).toEqual({
			ok: false,
			reason: "price is not a valid number",
		});
	});

	it("accepts a document without warnings when every field is valid", () => {
		const result = mapSanityProduct(doc({ water: "dulce" }), PROJECT);
		expect(result).toMatchObject({ ok: true, warnings: [] });
	});

	it.each([
		["dulce", "Agua dulce"],
		["salada", "Agua salada"],
	] as const)("maps water key %s to the label %s", (key, label) => {
		expect(toProduct(doc({ water: key })).water).toBe(label);
	});

	it("keeps the product but warns when the water key is unknown", () => {
		const result = mapSanityProduct(doc({ water: "salobre" }), PROJECT);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.product).not.toHaveProperty("water");
		expect(result.warnings).toEqual(['unknown water "salobre"']);
	});

	it("drops a compareAt that is not a valid number and warns", () => {
		const result = mapSanityProduct(
			doc({ compareAt: "antes" as unknown as number }),
			PROJECT,
		);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.product).not.toHaveProperty("compareAt");
		expect(result.warnings).toEqual(["compareAt is not a valid number"]);
	});

	it.each([
		["lower than", 20],
		["equal to", 24],
	])("drops a compareAt that is %s the price and warns", (_case, compareAt) => {
		const result = mapSanityProduct(doc({ price: 24, compareAt }), PROJECT);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.product).not.toHaveProperty("compareAt");
		expect(result.warnings).toEqual([
			"compareAt dropped: it must be greater than price",
		]);
	});

	it("keeps a compareAt that is greater than the price", () => {
		const result = mapSanityProduct(doc({ price: 24, compareAt: 30 }), PROJECT);
		expect(result).toMatchObject({
			ok: true,
			product: { compareAt: 30 },
			warnings: [],
		});
	});

	it("maps subtitle to latin, trimmed, defaulting to an empty string", () => {
		expect(toProduct(doc({ subtitle: " Amphiprion ocellaris " })).latin).toBe(
			"Amphiprion ocellaris",
		);
		expect(toProduct(doc({ subtitle: null })).latin).toBe("");
		expect(toProduct(doc({ subtitle: "   " })).latin).toBe("");
	});

	it("builds a bounded, auto-format image URL on the Sanity CDN", () => {
		const url = new URL(toProduct(doc({ image: image() })).image ?? "");
		expect(url.origin).toBe("https://cdn.sanity.io");
		expect(url.pathname).toBe(
			"/images/abc123/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg",
		);
		expect(url.searchParams.get("w")).toBe(String(PRODUCT_IMAGE_WIDTH));
		expect(url.searchParams.get("fit")).toBe("max");
		expect(url.searchParams.get("auto")).toBe("format");
	});

	it("applies the crop the editor set in the Studio", () => {
		const cropped = {
			...image(),
			crop: {
				_type: "sanity.imageCrop",
				top: 0.1,
				bottom: 0,
				left: 0,
				right: 0,
			},
		};
		const url = new URL(toProduct(doc({ image: cropped })).image ?? "");
		expect(url.searchParams.get("rect")).toBe("0,300,2000,2700");
	});

	it.each([
		["missing", undefined],
		["null", null],
		["an image without an asset", { _type: "image" }],
	])("falls back to the icon when the image is %s", (_case, value) => {
		const result = mapSanityProduct(
			doc({ image: value as SanityProduct["image"], icon: "fish-symbol" }),
			PROJECT,
		);
		expect(result).toMatchObject({ ok: true, warnings: [] });
		if (!result.ok) return;
		expect(result.product).not.toHaveProperty("image");
		expect(result.product.icon).toBe("fish-symbol");
	});

	it("drops an image whose asset reference is malformed and warns", () => {
		const result = mapSanityProduct(
			doc({ image: image("not-an-asset") }),
			PROJECT,
		);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.product).not.toHaveProperty("image");
		expect(result.warnings).toEqual(["image could not be resolved"]);
	});

	it("drops an icon the storefront does not know", () => {
		expect(toProduct(doc({ icon: "unicorn" }))).not.toHaveProperty("icon");
	});

	it("builds the badge when label and tone are both set", () => {
		const product = toProduct(
			doc({ badgeLabel: " Favorito ", badgeTone: "tide" }),
		);
		expect(product.badge).toEqual({ label: "Favorito", tone: "tide" });
	});

	it.each([
		[
			"only the label",
			{ badgeLabel: "Favorito", badgeTone: null },
			"badge dropped: badgeLabel and badgeTone must both be set",
		],
		[
			"only the tone",
			{ badgeLabel: null, badgeTone: "tide" },
			"badge dropped: badgeLabel and badgeTone must both be set",
		],
		[
			"a blank label",
			{ badgeLabel: "  ", badgeTone: "tide" },
			"badge dropped: badgeLabel and badgeTone must both be set",
		],
		[
			"an unknown tone",
			{ badgeLabel: "Favorito", badgeTone: "magenta" },
			'badge dropped: unknown badgeTone "magenta"',
		],
	])("omits the badge with %s and warns", (_case, fields, warning) => {
		const result = mapSanityProduct(doc(fields), PROJECT);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.product).not.toHaveProperty("badge");
		expect(result.warnings).toEqual([warning]);
	});

	it("does not warn when there is no badge at all", () => {
		const result = mapSanityProduct(
			doc({ badgeLabel: "  ", badgeTone: null }),
			PROJECT,
		);
		expect(result).toMatchObject({ ok: true, warnings: [] });
	});

	it("flattens the spec objects into a list of strings", () => {
		const product = toProduct(
			doc({ specs: [spec("24–27 °C", "a"), spec("pH 8.1–8.4", "b")] }),
		);
		expect(product.specs).toEqual(["24–27 °C", "pH 8.1–8.4"]);
	});

	it("trims specs and drops the malformed ones", () => {
		const result = mapSanityProduct(
			doc({
				specs: [
					spec(" 8 cm "),
					spec("   "),
					spec(null),
					spec(42),
					null,
					"suelto",
					{ _key: "x" },
					spec("Lavada"),
				],
			}),
			PROJECT,
		);
		expect(result).toMatchObject({ ok: true, warnings: [] });
		if (!result.ok) return;
		expect(result.product.specs).toEqual(["8 cm", "Lavada"]);
	});

	it("returns an empty specs list when the field is missing", () => {
		expect(toProduct(doc({ specs: null })).specs).toEqual([]);
		expect(toProduct(doc()).specs).toEqual([]);
	});

	it("returns an empty specs list and warns when specs is not a list", () => {
		const result = mapSanityProduct(doc({ specs: "8 cm" }), PROJECT);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.product.specs).toEqual([]);
		expect(result.warnings).toEqual(["specs is not a list"]);
	});

	it("maps inStock to stock and treats an unset value as available", () => {
		expect(toProduct(doc({ inStock: false })).stock).toBe(false);
		expect(toProduct(doc({ inStock: true })).stock).toBe(true);
		expect(toProduct(doc({ inStock: null })).stock).toBe(true);
	});

	it("drops optional fields that are null", () => {
		const product = toProduct(
			doc({
				water: null,
				compareAt: null,
				image: null,
				icon: null,
				badgeLabel: null,
				badgeTone: null,
				specs: null,
				beginner: null,
				temp: null,
				ph: null,
				size: null,
				mates: null,
			}),
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

	it("maps a fully populated document", () => {
		const product = toProduct(
			doc({
				water: "salada",
				subtitle: "Amphiprion ocellaris",
				compareAt: 30,
				image: image(),
				badgeLabel: "Favorito",
				badgeTone: "tide",
				specs: [spec("8 cm")],
				beginner: true,
				inStock: true,
				temp: "24–27 °C",
				ph: "8.1–8.4",
				size: "8 cm",
				mates: "Pacífico — convive en comunidad",
			}),
		);
		expect(product).toEqual({
			id: "payaso",
			cat: "Peces",
			water: "Agua salada",
			name: "Pez payaso",
			latin: "Amphiprion ocellaris",
			price: 24,
			compareAt: 30,
			image: expect.stringContaining("https://cdn.sanity.io/images/abc123/"),
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
