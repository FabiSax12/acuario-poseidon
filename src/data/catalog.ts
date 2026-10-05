import type { BadgeTone } from "#/components/ds/Badge";
import type { IconName } from "#/components/ds/Icon";

// Storefront domain types plus the static imagery used for navigation and art
// direction. Products come from Strapi (see src/data/loaders/products.ts and
// src/lib/product-mapper.ts); the demo set lives in cms/scripts/seed-data.mts.

export type ProductCategory =
	| "Peces"
	| "Alimento"
	| "Equipos"
	| "Plantas y decoración";

export type WaterType = "Agua dulce" | "Agua salada";

export type ImageName =
	| "colorful-aquarium-small-fish"
	| "coral-reef-school"
	| "freshwater-moss-tank"
	| "lionfish-reef"
	| "tank-marine-flora"
	| "tropical-aquarium";

export interface ProductBadge {
	label: string;
	tone: BadgeTone;
}

export interface Product {
	id: string;
	cat: ProductCategory;
	water?: WaterType;
	name: string;
	/** Latin name for fish; pack size or capacity for everything else. */
	latin: string;
	price: number;
	compareAt?: number;
	/** Absolute URL of the product photo. */
	image?: string;
	/** Shown in a photo placeholder when there is no image yet. */
	icon?: IconName;
	badge?: ProductBadge;
	specs: string[];
	beginner?: boolean;
	stock: boolean;
	temp?: string;
	ph?: string;
	size?: string;
	mates?: string;
}

export interface Category {
	name: string;
	note: string;
	img?: ImageName;
	icon?: IconName;
	to: "/tienda" | "/peceras-a-medida";
}

export const imageUrl = (name: ImageName) => `/assets/imagery/${name}.jpg`;

export const categories: Category[] = [
	{
		name: "Agua dulce",
		note: "Guppys, tetras, cíclidos, pacús",
		img: "freshwater-moss-tank",
		to: "/tienda",
	},
	{
		name: "Agua salada",
		note: "Payasos, cirujanos, peces león",
		img: "tropical-aquarium",
		to: "/tienda",
	},
	{
		name: "Peceras a medida",
		note: "Diseñadas y armadas a mano",
		img: "tank-marine-flora",
		to: "/peceras-a-medida",
	},
	{
		name: "Alimento",
		note: "Escamas, pellets, congelado",
		icon: "fish-symbol",
		to: "/tienda",
	},
	{
		name: "Equipos",
		note: "Filtros, calentadores, luces, tests",
		icon: "wrench",
		to: "/tienda",
	},
	{
		name: "Plantas y decoración",
		note: "Grava, conchas, rocas, musgo",
		img: "colorful-aquarium-small-fish",
		to: "/tienda",
	},
];
