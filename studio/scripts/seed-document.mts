// Pure half of the seed: turns a seed product into the Sanity document that
// scripts/seed.mts writes. Kept free of I/O so it can be tested with
// `pnpm test`.

import type { SeedProduct } from './seed-data.mts';

/**
 * The storefront lists products oldest first. Sanity accepts a `_createdAt`
 * on creation, so each product gets a fixed one, a minute apart, in the order
 * of the seed list. Products created later in the Studio sort after them.
 */
const FIRST_CREATED_AT = Date.UTC(2026, 0, 1);
const MINUTE = 60_000;

/**
 * Photos the seed needs that are not on disk: each file name once, in seed
 * order. `exists` receives the file name, so this stays free of I/O.
 */
export function missingImageFiles(
  products: readonly SeedProduct[],
  exists: (fileName: string) => boolean
): string[] {
  const names = products.flatMap((product) => product.imageFile ?? []);
  return [...new Set(names)].filter((fileName) => !exists(fileName));
}

/** Deterministic, so running the seed again replaces instead of duplicating. */
export const productDocumentId = (slug: string) => `product-${slug}`;

export function toProductDocument(
  product: SeedProduct,
  index: number,
  imageAssetId: string | null
) {
  const { slug, imageFile: _imageFile, specs, ...fields } = product;
  return {
    _id: productDocumentId(slug),
    _type: 'product' as const,
    _createdAt: new Date(FIRST_CREATED_AT + index * MINUTE).toISOString(),
    ...fields,
    slug: { _type: 'slug' as const, current: slug },
    specs: specs.map((text, position) => ({
      _key: `spec-${position}`,
      _type: 'spec' as const,
      text,
    })),
    ...(imageAssetId
      ? {
          image: {
            _type: 'image' as const,
            asset: { _type: 'reference' as const, _ref: imageAssetId },
          },
        }
      : {}),
  };
}
