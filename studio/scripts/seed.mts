// Loads the demo catalogue into Sanity so the storefront is not empty on first
// run. Safe to run again: every product has a fixed document id derived from
// its slug and is written with createOrReplace, and Sanity stores an image
// once per file content, so nothing is duplicated.
//
// Running it again resets the demo products to the seed values. Products
// created in the Studio are not touched.
//
// Nothing is written unless every photo is on disk: a missing file is
// reported and the script exits with an error.
//
// Usage, from studio/:  pnpm seed

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { seedProducts } from './seed-data.mts';
import { missingImageFiles, toProductDocument } from './seed-document.mts';

/** Pinned, like the storefront's (src/data/sanity-client.ts). */
const API_VERSION = '2025-02-19';

/** The storefront's static imagery doubles as the demo product photos. */
const IMAGE_DIR = path.resolve(import.meta.dirname, '..', '..', 'public', 'assets', 'imagery');

const requireEnv = (name: 'SANITY_STUDIO_PROJECT_ID' | 'SANITY_WRITE_TOKEN') => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not set. Copy .env.example to .env and fill it in.`);
  }
  return value;
};

const projectId = requireEnv('SANITY_STUDIO_PROJECT_ID');
const dataset = process.env.SANITY_STUDIO_DATASET?.trim() || 'production';
const token = requireEnv('SANITY_WRITE_TOKEN');

// Shown before any write, so a wrong target is visible in the output.
console.log(`Seeding project "${projectId}", dataset "${dataset}".`);

const missing = missingImageFiles(seedProducts, (fileName) =>
  fs.existsSync(path.join(IMAGE_DIR, fileName))
);
if (missing.length > 0) {
  for (const fileName of missing) {
    console.error(`  ! image not found: ${path.join(IMAGE_DIR, fileName)}`);
  }
  console.error(`Seed aborted: ${missing.length} image file(s) missing. Nothing was written.`);
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: API_VERSION,
  // Writes always go to the live API; the CDN is for reads.
  useCdn: false,
});

/** Asset id per file name, so a photo shared by two products is sent once. */
const uploaded = new Map<string, string>();

/** Returns the image asset id for `fileName`, uploading it when needed. */
async function uploadImage(fileName: string): Promise<string> {
  const known = uploaded.get(fileName);
  if (known) return known;

  const asset = await client.assets.upload(
    'image',
    fs.createReadStream(path.join(IMAGE_DIR, fileName)),
    { filename: fileName }
  );
  console.log(`  + uploaded ${fileName}`);
  uploaded.set(fileName, asset._id);
  return asset._id;
}

let written = 0;
for (const [index, product] of seedProducts.entries()) {
  const image = product.imageFile ? await uploadImage(product.imageFile) : null;
  await client.createOrReplace(toProductDocument(product, index, image));
  written += 1;
  console.log(`  + wrote ${product.slug}`);
}
console.log(`Seed finished: ${written} products written to "${projectId}" / "${dataset}".`);
