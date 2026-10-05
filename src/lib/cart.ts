import type { Product } from "#/data/catalog";

export interface CartLine {
	product: Product;
	qty: number;
}

export const addToCart = (
	cart: CartLine[],
	product: Product,
	qty = 1,
): CartLine[] =>
	cart.some((line) => line.product.id === product.id)
		? cart.map((line) =>
				line.product.id === product.id
					? { ...line, qty: line.qty + qty }
					: line,
			)
		: [...cart, { product, qty }];

export const setLineQuantity = (
	cart: CartLine[],
	productId: string,
	qty: number,
): CartLine[] =>
	cart.map((line) => (line.product.id === productId ? { ...line, qty } : line));

export const removeFromCart = (
	cart: CartLine[],
	productId: string,
): CartLine[] => cart.filter((line) => line.product.id !== productId);

export const cartItemCount = (cart: CartLine[]) =>
	cart.reduce((sum, line) => sum + line.qty, 0);

export const cartSubtotal = (cart: CartLine[]) =>
	cart.reduce((sum, line) => sum + line.product.price * line.qty, 0);
