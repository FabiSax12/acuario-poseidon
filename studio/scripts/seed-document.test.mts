import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { seedProducts } from './seed-data.mts';
import { missingImageFiles, productDocumentId, toProductDocument } from './seed-document.mts';

const payaso = seedProducts[0];
const escamas = seedProducts.find((product) => product.slug === 'escamas')!;

describe('productDocumentId', () => {
  it('derives the document id from the slug', () => {
    assert.equal(productDocumentId('payaso'), 'product-payaso');
  });
});

describe('toProductDocument', () => {
  it('builds a product document with a deterministic id and slug', () => {
    const doc = toProductDocument(payaso, 0, null);
    assert.equal(doc._id, 'product-payaso');
    assert.equal(doc._type, 'product');
    assert.deepEqual(doc.slug, { _type: 'slug', current: 'payaso' });
    assert.equal(doc.name, 'Pez payaso');
    assert.equal(doc.price, 24);
    assert.equal(doc.inStock, true);
  });

  it('turns specs into keyed spec objects', () => {
    assert.deepEqual(toProductDocument(payaso, 0, null).specs, [
      { _key: 'spec-0', _type: 'spec', text: '24–27 °C' },
      { _key: 'spec-1', _type: 'spec', text: 'pH 8.1–8.4' },
      { _key: 'spec-2', _type: 'spec', text: '8 cm' },
    ]);
  });

  it('references the uploaded image asset', () => {
    const doc = toProductDocument(payaso, 0, 'image-abc-2000x3000-jpg');
    assert.deepEqual(doc.image, {
      _type: 'image',
      asset: { _type: 'reference', _ref: 'image-abc-2000x3000-jpg' },
    });
  });

  it('leaves the image out when there is no asset', () => {
    assert.equal('image' in toProductDocument(payaso, 0, null), false);
  });

  it('does not store the local file name', () => {
    const doc = toProductDocument(payaso, 0, 'image-abc-2000x3000-jpg');
    assert.equal('imageFile' in doc, false);
  });

  it('omits the optional fields a product does not have', () => {
    const doc = toProductDocument(escamas, 6, null);
    assert.equal('compareAt' in doc, false);
    assert.equal('temp' in doc, false);
    assert.equal(doc.icon, 'fish-symbol');
  });

  it('gives each product a creation time that follows the catalogue order', () => {
    const times = seedProducts.map((product, index) =>
      toProductDocument(product, index, null)._createdAt
    );
    assert.equal(times[0], '2026-01-01T00:00:00.000Z');
    assert.equal(times[1], '2026-01-01T00:01:00.000Z');
    assert.deepEqual([...times].sort(), times);
    assert.equal(new Set(times).size, seedProducts.length);
  });

  it('is deterministic', () => {
    assert.deepEqual(toProductDocument(payaso, 0, null), toProductDocument(payaso, 0, null));
  });
});

describe('missingImageFiles', () => {
  const products = [
    { ...payaso, imageFile: 'a.jpg' },
    { ...payaso, slug: 'otro', imageFile: 'b.jpg' },
    { ...payaso, slug: 'tercero', imageFile: 'b.jpg' },
    escamas,
  ];

  it('returns nothing when every photo exists', () => {
    assert.deepEqual(missingImageFiles(products, () => true), []);
  });

  it('lists each missing file once, in seed order', () => {
    assert.deepEqual(missingImageFiles(products, () => false), ['a.jpg', 'b.jpg']);
    assert.deepEqual(missingImageFiles(products, (file) => file === 'a.jpg'), ['b.jpg']);
  });

  it('ignores products without a photo', () => {
    assert.deepEqual(missingImageFiles([escamas], () => false), []);
  });
});
