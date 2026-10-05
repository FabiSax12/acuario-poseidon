import { describe, expect, it } from "vitest";
import type { Product } from "#/data/catalog";
import {
	addToCart,
	type CartLine,
	cartItemCount,
	cartSubtotal,
	removeFromCart,
	setLineQuantity,
} from "./cart";

const clownfish: Product = {
	id: "payaso",
	cat: "Peces",
	water: "Agua salada",
	name: "Pez payaso",
	latin: "Amphiprion ocellaris",
	price: 24,
	specs: [],
	stock: true,
};
const guppy: Product = {
	id: "guppy",
	cat: "Peces",
	water: "Agua dulce",
	name: "Guppy",
	latin: "Poecilia reticulata",
	price: 4.5,
	specs: [],
	stock: true,
};

describe("addToCart", () => {
	it("appends a new line with quantity 1 by default", () => {
		expect(addToCart([], clownfish)).toEqual([{ product: clownfish, qty: 1 }]);
	});

	it("appends a new line after the existing ones with the given quantity", () => {
		const cart: CartLine[] = [{ product: clownfish, qty: 2 }];
		expect(addToCart(cart, guppy, 3)).toEqual([
			{ product: clownfish, qty: 2 },
			{ product: guppy, qty: 3 },
		]);
	});

	it("merges the quantity into an existing line instead of duplicating it", () => {
		const cart: CartLine[] = [
			{ product: clownfish, qty: 2 },
			{ product: guppy, qty: 1 },
		];
		expect(addToCart(cart, clownfish, 3)).toEqual([
			{ product: clownfish, qty: 5 },
			{ product: guppy, qty: 1 },
		]);
	});

	it("does not mutate the cart it was given", () => {
		const cart: CartLine[] = [{ product: clownfish, qty: 2 }];
		addToCart(cart, clownfish);
		addToCart(cart, guppy);
		expect(cart).toEqual([{ product: clownfish, qty: 2 }]);
	});
});

describe("setLineQuantity", () => {
	it("replaces the quantity of the matching line only", () => {
		const cart: CartLine[] = [
			{ product: clownfish, qty: 2 },
			{ product: guppy, qty: 1 },
		];
		expect(setLineQuantity(cart, "guppy", 7)).toEqual([
			{ product: clownfish, qty: 2 },
			{ product: guppy, qty: 7 },
		]);
	});

	it("leaves the cart unchanged for an unknown product id", () => {
		const cart: CartLine[] = [{ product: clownfish, qty: 2 }];
		expect(setLineQuantity(cart, "missing", 9)).toEqual(cart);
	});
});

describe("removeFromCart", () => {
	it("drops the matching line and keeps the rest", () => {
		const cart: CartLine[] = [
			{ product: clownfish, qty: 2 },
			{ product: guppy, qty: 1 },
		];
		expect(removeFromCart(cart, "payaso")).toEqual([
			{ product: guppy, qty: 1 },
		]);
	});
});

describe("cart totals", () => {
	const cart: CartLine[] = [
		{ product: clownfish, qty: 2 },
		{ product: guppy, qty: 3 },
	];

	it("counts items across lines", () => {
		expect(cartItemCount(cart)).toBe(5);
		expect(cartItemCount([])).toBe(0);
	});

	it("sums price times quantity", () => {
		// 24 * 2 + 4.5 * 3
		expect(cartSubtotal(cart)).toBe(61.5);
		expect(cartSubtotal([])).toBe(0);
	});
});
