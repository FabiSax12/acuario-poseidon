import type { BadgeTone } from "#/components/ds/Badge";
import type { IconName } from "#/components/ds/Icon";
import type { Product, ProductCategory, WaterType } from "#/data/catalog";
import { getStrapiMedia } from "#/lib/strapi-utils";
import type { TProduct, TProductCategory, TProductWater } from "#/types/strapi";

// Strapi stores ASCII enum keys; the storefront filters and tabs compare the
// Spanish labels (see SHOP_CATEGORIES and WATER_TYPES in src/lib/shop.ts).
const CATEGORY_LABELS: Record<TProductCategory, ProductCategory> = {
	peces: "Peces",
	alimento: "Alimento",
	equipos: "Equipos",
	plantas: "Plantas y decoración",
};

const WATER_LABELS: Record<TProductWater, WaterType> = {
	dulce: "Agua dulce",
	salada: "Agua salada",
};

// Keep in sync with the `icon` and `badgeTone` enumerations in
// cms/src/api/product/content-types/product/schema.json.
const PRODUCT_ICONS = [
	"fish-symbol",
	"waves",
	"thermometer",
	"flask-conical",
	"leaf",
	"wrench",
	"box",
] as const satisfies readonly IconName[];

const BADGE_TONES = [
	"tide",
	"coral",
	"bronze",
	"kelp",
	"neutral",
] as const satisfies readonly BadgeTone[];

const oneOf = <T extends string>(
	allowed: readonly T[],
	value: string | null | undefined,
): T | undefined => allowed.find((item) => item === value);

const text = (value: string | null | undefined) => value?.trim() || undefined;

/** Strapi sends decimals as numbers, or as strings on some databases. */
const toNumber = (value: unknown): number | undefined => {
	if (typeof value === "number")
		return Number.isFinite(value) ? value : undefined;
	if (typeof value !== "string" || value.trim() === "") return undefined;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : undefined;
};

export type ProductMapping =
	| { ok: true; product: Product; warnings: string[] }
	| { ok: false; reason: string };

/**
 * Maps a Strapi product entry to the storefront's `Product`. Pure, so it can
 * run inside server functions and be unit tested without Strapi.
 *
 * An entry the storefront cannot sell (unknown category, no usable price) is
 * rejected with a reason instead of throwing, so the caller can leave it out
 * and keep the rest of the catalogue. `warnings` lists fields that were
 * dropped from an accepted product. The caller decides what to log.
 *
 * `mediaBaseUrl` is prepended to relative media URLs (the local upload
 * provider returns `/uploads/...`); absolute URLs from a CDN provider are kept.
 */
export function mapProduct(
	entry: TProduct,
	mediaBaseUrl: string,
): ProductMapping {
	const cat = CATEGORY_LABELS[entry.category];
	if (!cat) {
		return { ok: false, reason: `unknown category "${entry.category}"` };
	}
	const price = toNumber(entry.price);
	if (price === undefined) {
		return { ok: false, reason: "price is not a number" };
	}

	const warnings: string[] = [];
	const product: Product = {
		id: entry.slug,
		cat,
		name: entry.name,
		latin: text(entry.subtitle) ?? "",
		price,
		specs: (entry.specs ?? []).flatMap((spec) => text(spec.text) ?? []),
		stock: entry.inStock ?? true,
	};

	if (entry.water) {
		const water = WATER_LABELS[entry.water];
		if (water) product.water = water;
		else warnings.push(`unknown water "${entry.water}"`);
	}
	if (entry.compareAt != null) {
		const compareAt = toNumber(entry.compareAt);
		if (compareAt !== undefined) product.compareAt = compareAt;
		else warnings.push("compareAt is not a number");
	}
	if (entry.image?.url) {
		product.image = getStrapiMedia(entry.image.url, mediaBaseUrl);
	}

	const icon = oneOf(PRODUCT_ICONS, entry.icon);
	if (icon) product.icon = icon;

	const badgeLabel = text(entry.badgeLabel);
	const badgeTone = oneOf(BADGE_TONES, entry.badgeTone);
	if (badgeLabel && badgeTone) {
		product.badge = { label: badgeLabel, tone: badgeTone };
	}

	if (entry.beginner) product.beginner = true;

	const temp = text(entry.temp);
	if (temp) product.temp = temp;
	const ph = text(entry.ph);
	if (ph) product.ph = ph;
	const size = text(entry.size);
	if (size) product.size = size;
	const mates = text(entry.mates);
	if (mates) product.mates = mates;

	return { ok: true, product, warnings };
}
