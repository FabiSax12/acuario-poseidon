import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SanityProduct } from "#/lib/sanity-product-mapper";
import {
	SANITY_MAX_RETRIES,
	SANITY_TIMEOUT_MS,
	SANITY_UNAVAILABLE,
} from "./sanity-client";
import { fetchProducts, PRODUCTS_QUERY } from "./sanity-products";

const { fetch, createClient } = vi.hoisted(() => {
	const fetch = vi.fn();
	const createClient = vi.fn(() => ({ fetch }));
	return { fetch, createClient };
});

vi.mock("@sanity/client", () => ({ createClient }));

const doc = (
	slug: string,
	extra: Partial<SanityProduct> = {},
): SanityProduct => ({
	_id: `product-${slug}`,
	name: slug,
	slug,
	category: "peces",
	price: 10,
	...extra,
});

beforeEach(() => {
	vi.stubEnv("SANITY_PROJECT_ID", "abc123");
	vi.stubEnv("SANITY_DATASET", "production");
	vi.stubEnv("SANITY_API_VERSION", "2026-01-01");
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
	fetch.mockReset();
	createClient.mockClear();
});

describe("PRODUCTS_QUERY", () => {
	it("reads every product, oldest first, with its slug, image and specs", () => {
		expect(PRODUCTS_QUERY).toContain('*[_type == "product"]');
		expect(PRODUCTS_QUERY).toContain("order(_createdAt asc, _id asc)");
		expect(PRODUCTS_QUERY).toContain('"slug": slug.current');
		expect(PRODUCTS_QUERY).toMatch(/\bimage\b/);
		expect(PRODUCTS_QUERY).toMatch(/\bspecs\b/);
	});
});

describe("fetchProducts", () => {
	it("runs the one catalogue query with the configured project", async () => {
		fetch.mockResolvedValueOnce([doc("payaso")]);
		await fetchProducts();

		expect(createClient).toHaveBeenCalledWith({
			projectId: "abc123",
			dataset: "production",
			apiVersion: "2026-01-01",
			useCdn: true,
			perspective: "published",
			timeout: SANITY_TIMEOUT_MS,
			maxRetries: SANITY_MAX_RETRIES,
		});
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith(PRODUCTS_QUERY);
	});

	it("maps documents, keeping the order, and builds image URLs", async () => {
		fetch.mockResolvedValueOnce([
			doc("payaso", {
				image: {
					_type: "image",
					asset: {
						_type: "reference",
						_ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg",
					},
				},
			}),
			doc("guppy"),
		]);

		const products = await fetchProducts();

		expect(products.map((product) => product.id)).toEqual(["payaso", "guppy"]);
		expect(products[0]).toMatchObject({
			cat: "Peces",
			image: expect.stringContaining(
				"https://cdn.sanity.io/images/abc123/production/",
			),
		});
	});

	it("returns an empty catalogue when the dataset has no products", async () => {
		fetch.mockResolvedValueOnce([]);
		await expect(fetchProducts()).resolves.toEqual([]);
	});

	it("drops documents that cannot be mapped and logs slug and reason", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		fetch.mockResolvedValueOnce([
			doc("payaso"),
			doc("coral", { category: "corales" }),
			doc("gratis", { price: null }),
			doc("guppy"),
		]);

		const products = await fetchProducts();

		expect(products.map((product) => product.id)).toEqual(["payaso", "guppy"]);
		const lines = warn.mock.calls.map((args) => args.join(" "));
		expect(lines).toEqual([
			'[sanity] product "coral" skipped: unknown category "corales"',
			'[sanity] product "gratis" skipped: price is not a valid number',
		]);
	});

	it("logs a document without a slug by its document id", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		fetch.mockResolvedValueOnce([{ ...doc("payaso"), slug: null }]);

		await expect(fetchProducts()).resolves.toEqual([]);
		expect(warn.mock.calls.map((args) => args.join(" "))).toEqual([
			'[sanity] product "product-payaso" skipped: slug is missing',
		]);
	});

	it("keeps the first of two documents with the same slug and logs the rest", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		fetch.mockResolvedValueOnce([
			doc("payaso", { name: "Primero" }),
			doc("guppy"),
			{ ...doc("payaso", { name: "Segundo" }), _id: "abc" },
			{ ...doc(" payaso ", { name: "Tercero" }), _id: "def" },
		]);

		const products = await fetchProducts();

		expect(products.map((product) => product.id)).toEqual(["payaso", "guppy"]);
		expect(products[0].name).toBe("Primero");
		expect(warn.mock.calls.map((args) => args.join(" "))).toEqual([
			'[sanity] product "payaso" skipped: duplicate slug (document "abc")',
			'[sanity] product "payaso" skipped: duplicate slug (document "def")',
		]);
	});

	it("keeps a document with an unknown water key and logs it", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		fetch.mockResolvedValueOnce([doc("molly", { water: "salobre" })]);

		const products = await fetchProducts();

		expect(products).toHaveLength(1);
		expect(products[0]).not.toHaveProperty("water");
		expect(warn.mock.calls.map((args) => args.join(" "))).toEqual([
			'[sanity] product "molly": unknown water "salobre"',
		]);
	});

	it("turns a response that is not a list into the generic error", async () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		fetch.mockResolvedValueOnce({ error: "unexpected" });
		await expect(fetchProducts()).rejects.toThrow(SANITY_UNAVAILABLE);
	});

	it("turns a Sanity failure into the generic error", async () => {
		const log = vi.spyOn(console, "error").mockImplementation(() => {});
		fetch.mockRejectedValueOnce(new Error("Request failed"));

		await expect(fetchProducts()).rejects.toThrow(SANITY_UNAVAILABLE);
		expect(log.mock.calls.flat().join(" ")).toContain(
			"[sanity] products list failed",
		);
	});
});
