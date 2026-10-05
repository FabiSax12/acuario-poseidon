import type { Product, ProductCategory, WaterType } from "#/data/catalog";

export const SHOP_CATEGORIES = [
	"Todo",
	"Peces",
	"Alimento",
	"Equipos",
	"Plantas y decoración",
] as const satisfies readonly ("Todo" | ProductCategory)[];

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export const WATER_TYPES = [
	"Agua dulce",
	"Agua salada",
] as const satisfies readonly WaterType[];

export const SORT_OPTIONS = [
	"Relevancia",
	"Precio: menor a mayor",
	"Precio: mayor a menor",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export interface ShopFilters {
	category: ShopCategory;
	water: WaterType | null;
	beginner: boolean;
	inStock: boolean;
	sort: SortOption;
}

export const filterProducts = (
	products: Product[],
	{ category, water, beginner, inStock, sort }: ShopFilters,
): Product[] => {
	const items = products.filter(
		(p) =>
			(category === "Todo" || p.cat === category) &&
			(!water || p.water === water) &&
			(!beginner || p.beginner) &&
			(!inStock || p.stock),
	);
	if (sort === "Precio: menor a mayor")
		return items.sort((a, b) => a.price - b.price);
	if (sort === "Precio: mayor a menor")
		return items.sort((a, b) => b.price - a.price);
	return items;
};

export const countByCategory = (products: Product[], category: ShopCategory) =>
	category === "Todo"
		? products.length
		: products.filter((p) => p.cat === category).length;
