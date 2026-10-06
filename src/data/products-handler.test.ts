import { afterEach, describe, expect, it, vi } from "vitest";
import type { Product } from "#/data/catalog";
import { CATALOG_CACHE_CONTROL, NO_STORE } from "#/lib/cache-headers";
import { getProductsHandler } from "./products-handler";

const { fetchProducts, setResponseHeaders } = vi.hoisted(() => ({
	fetchProducts: vi.fn(),
	setResponseHeaders: vi.fn(),
}));

vi.mock("#/data/sanity-products", () => ({ fetchProducts }));
vi.mock("@tanstack/react-start/server", () => ({ setResponseHeaders }));

const product = (id: string): Product => ({
	id,
	cat: "Peces",
	name: id,
	latin: "",
	price: 10,
	specs: [],
	stock: true,
});

/** The Cache-Control values sent, one per `setResponseHeaders` call. */
const sentCacheControl = () =>
	setResponseHeaders.mock.calls.map(([headers]) =>
		(headers as Headers).get("Cache-Control"),
	);

afterEach(() => {
	fetchProducts.mockReset();
	setResponseHeaders.mockReset();
});

describe("getProductsHandler", () => {
	it("returns the products and sends the catalogue policy", async () => {
		const products = [product("payaso"), product("guppy")];
		fetchProducts.mockResolvedValueOnce(products);

		await expect(getProductsHandler()).resolves.toBe(products);
		expect(sentCacheControl()).toEqual([CATALOG_CACHE_CONTROL]);
	});

	it("sends no-store for an empty catalogue", async () => {
		fetchProducts.mockResolvedValueOnce([]);

		await expect(getProductsHandler()).resolves.toEqual([]);
		expect(sentCacheControl()).toEqual([NO_STORE]);
	});

	it("sends no-store and rethrows when the read fails", async () => {
		const failure = new Error("The catalogue is temporarily unavailable");
		fetchProducts.mockRejectedValueOnce(failure);

		await expect(getProductsHandler()).rejects.toBe(failure);
		expect(sentCacheControl()).toEqual([NO_STORE]);
	});
});
