import {
	createImageUrlBuilder,
	type SanityImageSource,
} from "@sanity/image-url";
import type { BadgeTone } from "#/components/ds/Badge";
import type { IconName } from "#/components/ds/Icon";
import type { Product, ProductCategory, WaterType } from "#/data/catalog";

// Sanity stores ASCII keys; the storefront filters and tabs compare the
// Spanish labels (see SHOP_CATEGORIES and WATER_TYPES in src/lib/shop.ts).
const CATEGORY_LABELS: Record<string, ProductCategory> = {
	peces: "Peces",
	alimento: "Alimento",
	equipos: "Equipos",
	plantas: "Plantas y decoración",
};

const WATER_LABELS: Record<string, WaterType> = {
	dulce: "Agua dulce",
	salada: "Agua salada",
};

// Keep in sync with the `icon` and `badgeTone` lists in
// studio/schemaTypes/product.ts.
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

/**
 * Width requested from the Sanity image CDN, in pixels. Wide enough for the
 * product page on a high-density screen; `fit=max` never upscales a smaller
 * original.
 */
export const PRODUCT_IMAGE_WIDTH = 1200;

/** A `product` document as projected by PRODUCTS_QUERY in sanity-products.ts. */
export interface SanityProduct {
	_id: string;
	name?: string | null;
	/** `slug.current`, flattened by the query. */
	slug?: string | null;
	category?: string | null;
	water?: string | null;
	subtitle?: string | null;
	price?: number | null;
	compareAt?: number | null;
	/** The image field as stored: asset reference plus optional crop and hotspot. */
	image?: {
		asset?: { _ref?: string; [key: string]: unknown } | null;
		[key: string]: unknown;
	} | null;
	icon?: string | null;
	badgeLabel?: string | null;
	badgeTone?: string | null;
	/** Expected: a list of `{ text }` objects. Validated by the mapper. */
	specs?: unknown;
	beginner?: boolean | null;
	inStock?: boolean | null;
	temp?: string | null;
	ph?: string | null;
	size?: string | null;
	mates?: string | null;
}

/** The project the image URLs point at. */
export interface SanityProject {
	projectId: string;
	dataset: string;
}

export type SanityProductMapping =
	| { ok: true; product: Product; warnings: string[] }
	| { ok: false; reason: string };

const oneOf = <T extends string>(
	allowed: readonly T[],
	value: string | null | undefined,
): T | undefined => allowed.find((item) => item === value);

const label = <T>(labels: Record<string, T>, key: string | null | undefined) =>
	key != null && Object.hasOwn(labels, key) ? labels[key] : undefined;

const text = (value: unknown) =>
	(typeof value === "string" && value.trim()) || undefined;

/** A price the storefront can show: a finite number, zero or more. */
const toAmount = (value: unknown) =>
	typeof value === "number" && Number.isFinite(value) && value >= 0
		? value
		: undefined;

const specText = (spec: unknown) =>
	typeof spec === "object" && spec !== null && "text" in spec
		? text(spec.text)
		: undefined;

/**
 * Maps a Sanity product document to the storefront's `Product`. Pure, so it
 * can run inside server functions and be unit tested without Sanity.
 *
 * A document the storefront cannot sell (no slug or name, unknown category,
 * no usable price) is rejected with a reason instead of throwing, so the
 * caller can leave it out and keep the rest of the catalogue. `warnings` lists
 * fields that were dropped from an accepted product (a badge needs both its
 * label and a known tone; a previous price must be higher than the price). The
 * caller decides what to log.
 */
export function mapSanityProduct(
	doc: SanityProduct,
	project: SanityProject,
): SanityProductMapping {
	const id = text(doc.slug);
	if (!id) return { ok: false, reason: "slug is missing" };
	const name = text(doc.name);
	if (!name) return { ok: false, reason: "name is missing" };
	const cat = label(CATEGORY_LABELS, doc.category);
	if (!cat) {
		return { ok: false, reason: `unknown category "${doc.category}"` };
	}
	const price = toAmount(doc.price);
	if (price === undefined) {
		return { ok: false, reason: "price is not a valid number" };
	}

	const warnings: string[] = [];
	const product: Product = {
		id,
		cat,
		name,
		latin: text(doc.subtitle) ?? "",
		price,
		specs: [],
		stock: doc.inStock ?? true,
	};

	if (Array.isArray(doc.specs)) {
		product.specs = doc.specs.flatMap((spec) => specText(spec) ?? []);
	} else if (doc.specs != null) {
		warnings.push("specs is not a list");
	}

	if (doc.water) {
		const water = label(WATER_LABELS, doc.water);
		if (water) product.water = water;
		else warnings.push(`unknown water "${doc.water}"`);
	}
	if (doc.compareAt != null) {
		const compareAt = toAmount(doc.compareAt);
		if (compareAt === undefined) {
			warnings.push("compareAt is not a valid number");
		} else if (compareAt > price) {
			product.compareAt = compareAt;
		} else {
			// A previous price that is not higher would be struck through next to
			// a current price that is the same or more expensive.
			warnings.push("compareAt dropped: it must be greater than price");
		}
	}
	if (doc.image?.asset) {
		try {
			// The builder applies the crop and hotspot stored on the image field.
			product.image = createImageUrlBuilder(project)
				.image(doc.image as SanityImageSource)
				.withOptions({ width: PRODUCT_IMAGE_WIDTH, fit: "max", auto: "format" })
				.url();
		} catch {
			warnings.push("image could not be resolved");
		}
	}

	const icon = oneOf(PRODUCT_ICONS, doc.icon);
	if (icon) product.icon = icon;

	const badgeLabel = text(doc.badgeLabel);
	const badgeTone = oneOf(BADGE_TONES, doc.badgeTone);
	if (badgeLabel && badgeTone) {
		product.badge = { label: badgeLabel, tone: badgeTone };
	} else if (badgeLabel && doc.badgeTone) {
		warnings.push(`badge dropped: unknown badgeTone "${doc.badgeTone}"`);
	} else if (badgeLabel || doc.badgeTone) {
		warnings.push("badge dropped: badgeLabel and badgeTone must both be set");
	}

	if (doc.beginner) product.beginner = true;

	const temp = text(doc.temp);
	if (temp) product.temp = temp;
	const ph = text(doc.ph);
	if (ph) product.ph = ph;
	const size = text(doc.size);
	if (size) product.size = size;
	const mates = text(doc.mates);
	if (mates) product.mates = mates;

	return { ok: true, product, warnings };
}
