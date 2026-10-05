import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TProduct } from "#/types/strapi";
import { fetchProducts } from "./strapi-products";
import { STRAPI_UNAVAILABLE } from "./strapi-sdk";

const { find, collection, strapi } = vi.hoisted(() => {
	const find = vi.fn();
	const collection = vi.fn(() => ({ find }));
	const strapi = vi.fn(() => ({ collection }));
	return { find, collection, strapi };
});

vi.mock("@strapi/client", () => ({ strapi }));

const TOKEN = "test-token-value";

const entry = (slug: string, extra: Partial<TProduct> = {}): TProduct => ({
	id: 1,
	documentId: `doc-${slug}`,
	name: slug,
	slug,
	category: "peces",
	price: 10,
	...extra,
});

const page = (data: TProduct[], pageNumber = 1, pageCount = 1) => ({
	data,
	meta: {
		pagination: { page: pageNumber, pageSize: 100, pageCount, total: 0 },
	},
});

beforeEach(() => {
	vi.stubEnv("STRAPI_URL", "http://cms.test:1337/");
	vi.stubEnv("STRAPI_API_TOKEN", TOKEN);
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
	find.mockReset();
	collection.mockClear();
	strapi.mockClear();
});

describe("fetchProducts", () => {
	it("reads the products collection with the configured URL and token", async () => {
		find.mockResolvedValueOnce(page([entry("payaso")]));
		await fetchProducts();

		expect(strapi).toHaveBeenCalledWith({
			baseURL: "http://cms.test:1337/api",
			auth: TOKEN,
		});
		expect(collection).toHaveBeenCalledWith("products");
		expect(find).toHaveBeenCalledWith({
			sort: ["createdAt:asc", "id:asc"],
			populate: ["image", "specs"],
			pagination: { page: 1, pageSize: 100 },
		});
	});

	it("maps entries and makes media URLs absolute", async () => {
		find.mockResolvedValueOnce(
			page([
				entry("payaso", {
					image: {
						id: 1,
						documentId: "img",
						alternativeText: null,
						url: "/uploads/payaso.jpg",
					},
				}),
			]),
		);
		const [product] = await fetchProducts();
		expect(product).toMatchObject({
			id: "payaso",
			cat: "Peces",
			image: "http://cms.test:1337/uploads/payaso.jpg",
		});
	});

	it("follows pagination until the last page, keeping the order", async () => {
		find
			.mockResolvedValueOnce(page([entry("a"), entry("b")], 1, 3))
			.mockResolvedValueOnce(page([entry("c")], 2, 3))
			.mockResolvedValueOnce(page([entry("d")], 3, 3));

		const products = await fetchProducts();

		expect(products.map((product) => product.id)).toEqual(["a", "b", "c", "d"]);
		expect(find.mock.calls.map(([params]) => params.pagination.page)).toEqual([
			1, 2, 3,
		]);
	});

	it("returns an empty catalogue when Strapi has no products", async () => {
		find.mockResolvedValueOnce({ data: [] });
		await expect(fetchProducts()).resolves.toEqual([]);
		expect(find).toHaveBeenCalledTimes(1);
	});

	it("drops entries that cannot be mapped and logs slug and reason", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		find.mockResolvedValueOnce(
			page([
				entry("payaso"),
				entry("coral", { category: "corales" as TProduct["category"] }),
				entry("gratis", { price: null as unknown as number }),
				entry("guppy"),
			]),
		);

		const products = await fetchProducts();

		expect(products.map((product) => product.id)).toEqual(["payaso", "guppy"]);
		const lines = warn.mock.calls.map((args) => args.join(" "));
		expect(lines).toEqual([
			expect.stringMatching(/"coral" skipped: unknown category "corales"/),
			expect.stringMatching(/"gratis" skipped: price is not a number/),
		]);
	});

	it("keeps an entry with an unknown water key and logs it", async () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		find.mockResolvedValueOnce(
			page([entry("molly", { water: "salobre" as TProduct["water"] })]),
		);

		const products = await fetchProducts();

		expect(products).toHaveLength(1);
		expect(products[0]).not.toHaveProperty("water");
		expect(warn.mock.calls.map((args) => args.join(" "))).toEqual([
			expect.stringMatching(/"molly": unknown water "salobre"/),
		]);
	});

	it("turns a Strapi failure into the generic error", async () => {
		const log = vi.spyOn(console, "error").mockImplementation(() => {});
		find.mockRejectedValueOnce(
			Object.assign(new Error("Request failed with status code 401"), {
				request: { headers: { Authorization: `Bearer ${TOKEN}` } },
			}),
		);

		await expect(fetchProducts()).rejects.toThrow(STRAPI_UNAVAILABLE);
		expect(log.mock.calls.flat().join(" ")).not.toContain(TOKEN);
	});
});
