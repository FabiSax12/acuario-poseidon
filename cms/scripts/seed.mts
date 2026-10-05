// Loads the demo catalogue into Strapi so the storefront is not empty on first
// run. Safe to run again: products are matched by slug and images by file
// name, and anything that already exists is left untouched (staff edits win).
// The one exception: a product that has no photo gets the seed photo once its
// file is available, so a photo that was missing on the first run is retried.
//
// Usage, from cms/:  pnpm seed

import fs from 'node:fs';
import path from 'node:path';
import type { Core } from '@strapi/strapi';
import { type SeedProduct, seedProducts } from './seed-data.mts';
import { main } from './strapi-app.mts';

const PRODUCT_UID = 'api::product.product';
const FILE_UID = 'plugin::upload.file';

/** The storefront's static imagery doubles as the demo product photos. */
const IMAGE_DIR = path.resolve(import.meta.dirname, '..', '..', 'public', 'assets', 'imagery');

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/** Returns the media library id for `fileName`, uploading it when needed. */
async function findOrUploadImage(strapi: Core.Strapi, fileName: string): Promise<number | null> {
  const existing = await strapi.db.query(FILE_UID).findOne({ where: { name: fileName } });
  if (existing) return existing.id;

  const filepath = path.join(IMAGE_DIR, fileName);
  if (!fs.existsSync(filepath)) {
    console.warn(`  ! image not found, skipped: ${filepath}`);
    return null;
  }

  const [uploaded] = await strapi
    .plugin('upload')
    .service('upload')
    .upload({
      files: {
        filepath,
        originalFilename: fileName,
        size: fs.statSync(filepath).size,
        mimetype: MIME_TYPES[path.extname(fileName).toLowerCase()] ?? 'application/octet-stream',
      },
      data: { fileInfo: { name: fileName, alternativeText: null, caption: null } },
    });
  console.log(`  + uploaded ${fileName}`);
  return uploaded.id;
}

async function createProduct(strapi: Core.Strapi, product: SeedProduct): Promise<void> {
  const { imageFile, specs, ...fields } = product;
  const image = imageFile ? await findOrUploadImage(strapi, imageFile) : null;
  await strapi.documents(PRODUCT_UID).create({
    data: {
      ...fields,
      specs: specs.map((text) => ({ text })),
      ...(image ? { image } : {}),
    },
  });
}

/**
 * Attaches the seed photo to an existing product that has none. Returns false
 * when there is nothing to attach. No other field is touched.
 */
async function attachMissingImage(
  strapi: Core.Strapi,
  existing: { documentId: string; image?: unknown },
  product: SeedProduct
): Promise<boolean> {
  if (existing.image || !product.imageFile) return false;
  const image = await findOrUploadImage(strapi, product.imageFile);
  if (!image) return false;
  await strapi.documents(PRODUCT_UID).update({ documentId: existing.documentId, data: { image } });
  return true;
}

main(async (strapi) => {
  let created = 0;
  let skipped = 0;
  let attached = 0;
  // Sequential on purpose: the storefront lists products oldest first, so the
  // creation order is the catalogue order.
  for (const product of seedProducts) {
    const existing = await strapi
      .documents(PRODUCT_UID)
      .findFirst({ filters: { slug: product.slug }, populate: ['image'] });
    if (existing) {
      if (await attachMissingImage(strapi, existing, product)) {
        attached += 1;
        console.log(`  + attached photo to ${product.slug}`);
      } else {
        skipped += 1;
      }
      continue;
    }
    await createProduct(strapi, product);
    created += 1;
    console.log(`  + created ${product.slug}`);
  }
  console.log(
    `Seed finished: ${created} created, ${attached} photos attached, ${skipped} already present.`
  );
});
