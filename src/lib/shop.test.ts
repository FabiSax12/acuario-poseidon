import { describe, expect, it } from "vitest";
import type { Product } from "#/data/catalog";
import { countByCategory, filterProducts, type ShopFilters } from "./shop";

const product = (
	id: string,
	cat: Product["cat"],
	price: number,
	extra: Partial<Product> = {},
): Product => ({
	id,
	cat,
	name: id,
	latin: "",
	price,
	specs: [],
	stock: true,
	...extra,
});

// Order matters: "Relevancia" keeps the catalogue order.
const products: Product[] = [
	product("payaso", "Peces", 24, { water: "Agua salada", beginner: true }),
	product("leon", "Peces", 62, { water: "Agua salada" }),
	product("mariposa", "Peces", 41, { water: "Agua salada", stock: false }),
	product("guppy", "Peces", 4.5, { water: "Agua dulce", beginner: true }),
	product("escamas", "Alimento", 9, { water: "Agua dulce" }),
	product("filtro", "Equipos", 119),
	product("conchas", "Plantas y decoración", 11),
];

const defaults: ShopFilters = {
	category: "Todo",
	water: null,
	beginner: false,
	inStock: false,
	sort: "Relevancia",
};
const ids = (filters: Partial<ShopFilters>) =>
	filterProducts(products, { ...defaults, ...filters }).map((p) => p.id);

describe("filterProducts", () => {
	it("returns the whole catalogue in its original order by default", () => {
		expect(ids({})).toEqual([
			"payaso",
			"leon",
			"mariposa",
			"guppy",
			"escamas",
			"filtro",
			"conchas",
		]);
	});

	it("filters by category", () => {
		expect(ids({ category: "Peces" })).toEqual([
			"payaso",
			"leon",
			"mariposa",
			"guppy",
		]);
		expect(ids({ category: "Equipos" })).toEqual(["filtro"]);
	});

	it("filters by water type, excluding products without one", () => {
		expect(ids({ water: "Agua dulce" })).toEqual(["guppy", "escamas"]);
		expect(ids({ water: "Agua salada" })).toEqual([
			"payaso",
			"leon",
			"mariposa",
		]);
	});

	it("keeps only beginner-friendly products", () => {
		expect(ids({ beginner: true })).toEqual(["payaso", "guppy"]);
	});

	it("keeps only products in stock", () => {
		expect(ids({ inStock: true })).toEqual([
			"payaso",
			"leon",
			"guppy",
			"escamas",
			"filtro",
			"conchas",
		]);
	});

	it("combines filters", () => {
		expect(
			ids({ category: "Peces", water: "Agua salada", inStock: true }),
		).toEqual(["payaso", "leon"]);
	});

	it("sorts by price ascending", () => {
		expect(ids({ sort: "Precio: menor a mayor" })).toEqual([
			"guppy",
			"escamas",
			"conchas",
			"payaso",
			"mariposa",
			"leon",
			"filtro",
		]);
	});

	it("sorts by price descending", () => {
		expect(ids({ category: "Peces", sort: "Precio: mayor a menor" })).toEqual([
			"leon",
			"mariposa",
			"payaso",
			"guppy",
		]);
	});

	it("returns an empty list when nothing matches", () => {
		expect(ids({ category: "Equipos", beginner: true })).toEqual([]);
	});

	it("does not reorder the list it was given", () => {
		const before = products.map((p) => p.id);
		ids({ sort: "Precio: menor a mayor" });
		expect(products.map((p) => p.id)).toEqual(before);
	});
});

describe("countByCategory", () => {
	it("counts every product for 'Todo' and per category otherwise", () => {
		expect(countByCategory(products, "Todo")).toBe(7);
		expect(countByCategory(products, "Peces")).toBe(4);
		expect(countByCategory(products, "Alimento")).toBe(1);
	});
});
