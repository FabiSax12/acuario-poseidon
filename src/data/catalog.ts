import type { BadgeTone } from "#/components/ds/Badge";
import type { IconName } from "#/components/ds/Icon";

// Demo catalogue carried over from the design kit: names and prices are
// illustrative, not real stock.

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
	img?: ImageName;
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

export const products: Product[] = [
	{
		id: "payaso",
		cat: "Peces",
		water: "Agua salada",
		name: "Pez payaso",
		latin: "Amphiprion ocellaris",
		price: 24,
		img: "tropical-aquarium",
		badge: { label: "Favorito", tone: "tide" },
		specs: ["24–27 °C", "pH 8.1–8.4", "8 cm"],
		beginner: true,
		stock: true,
		temp: "24–27 °C",
		ph: "8.1–8.4",
		size: "8 cm",
		mates: "Pacífico — convive en comunidad",
	},
	{
		id: "cirujano",
		cat: "Peces",
		water: "Agua salada",
		name: "Pez cirujano azul",
		latin: "Paracanthurus hepatus",
		price: 38,
		compareAt: 45,
		img: "tropical-aquarium",
		badge: { label: "-15%", tone: "coral" },
		specs: ["24–26 °C", "pH 8.1–8.4", "25 cm"],
		stock: true,
		temp: "24–26 °C",
		ph: "8.1–8.4",
		size: "25 cm",
		mates: "Necesita acuario grande (300 L+)",
	},
	{
		id: "leon",
		cat: "Peces",
		water: "Agua salada",
		name: "Pez león",
		latin: "Pterois volitans",
		price: 62,
		img: "lionfish-reef",
		badge: { label: "Experto", tone: "bronze" },
		specs: ["23–27 °C", "pH 8.1–8.4", "35 cm"],
		stock: true,
		temp: "23–27 °C",
		ph: "8.1–8.4",
		size: "35 cm",
		mates: "Depredador — solo con peces grandes",
	},
	{
		id: "mariposa",
		cat: "Peces",
		water: "Agua salada",
		name: "Pez mariposa",
		latin: "Chaetodon sp.",
		price: 41,
		img: "coral-reef-school",
		specs: ["24–27 °C", "pH 8.1–8.4", "15 cm"],
		stock: false,
		temp: "24–27 °C",
		ph: "8.1–8.4",
		size: "15 cm",
		mates: "Pacífico — puede picar corales",
	},
	{
		id: "pacu",
		cat: "Peces",
		water: "Agua dulce",
		name: "Pacú",
		latin: "Piaractus brachypomus",
		price: 29,
		img: "freshwater-moss-tank",
		specs: ["24–28 °C", "pH 6.5–7.5", "40 cm+"],
		stock: true,
		temp: "24–28 °C",
		ph: "6.5–7.5",
		size: "40 cm+",
		mates: "Crece mucho — acuario de 500 L+",
	},
	{
		id: "guppy",
		cat: "Peces",
		water: "Agua dulce",
		name: "Guppy",
		latin: "Poecilia reticulata",
		price: 4.5,
		img: "tank-marine-flora",
		badge: { label: "Principiantes", tone: "kelp" },
		specs: ["22–28 °C", "pH 7.0–8.0", "4 cm"],
		beginner: true,
		stock: true,
		temp: "22–28 °C",
		ph: "7.0–8.0",
		size: "4 cm",
		mates: "Pacífico — ideal para empezar",
	},
	{
		id: "escamas",
		cat: "Alimento",
		water: "Agua dulce",
		name: "Escamas tropicales",
		latin: "100 g",
		price: 9,
		icon: "fish-symbol",
		specs: ["Uso diario"],
		stock: true,
	},
	{
		id: "pellets",
		cat: "Alimento",
		water: "Agua salada",
		name: "Pellets marinos",
		latin: "120 g",
		price: 12,
		icon: "fish-symbol",
		specs: ["Hunde lento"],
		stock: true,
	},
	{
		id: "filtro",
		cat: "Equipos",
		name: "Filtro externo",
		latin: "Hasta 300 L",
		price: 119,
		icon: "waves",
		badge: { label: "Nuevo", tone: "tide" },
		specs: ["1200 L/h"],
		stock: true,
	},
	{
		id: "calentador",
		cat: "Equipos",
		name: "Calentador sumergible",
		latin: "100 W",
		price: 27,
		icon: "thermometer",
		specs: ["20–32 °C"],
		stock: true,
	},
	{
		id: "test",
		cat: "Equipos",
		name: "Kit de test de agua",
		latin: "pH · NO₂ · NO₃ · NH₃",
		price: 34,
		icon: "flask-conical",
		specs: ["5 parámetros"],
		stock: true,
	},
	{
		id: "conchas",
		cat: "Plantas y decoración",
		name: "Conchas y grava de colores",
		latin: "Bolsa 2 kg",
		price: 11,
		img: "colorful-aquarium-small-fish",
		specs: ["Lavada"],
		stock: true,
	},
];

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

export const findProduct = (id: string) => products.find((p) => p.id === id);
