import { defineArrayMember, defineField, defineType } from 'sanity';

// The storefront maps these keys to its own labels and components. Keep the
// values in sync with src/lib/sanity-product-mapper.ts in the storefront: a
// product with a category it does not know is left out of the shop.
const CATEGORIES = [
  { title: 'Peces', value: 'peces' },
  { title: 'Alimento', value: 'alimento' },
  { title: 'Equipos', value: 'equipos' },
  { title: 'Plantas y decoración', value: 'plantas' },
];

const WATER_TYPES = [
  { title: 'Agua dulce', value: 'dulce' },
  { title: 'Agua salada', value: 'salada' },
];

const ICONS = [
  { title: 'Pez', value: 'fish-symbol' },
  { title: 'Olas', value: 'waves' },
  { title: 'Termómetro', value: 'thermometer' },
  { title: 'Matraz', value: 'flask-conical' },
  { title: 'Hoja', value: 'leaf' },
  { title: 'Llave', value: 'wrench' },
  { title: 'Caja', value: 'box' },
];

const BADGE_TONES = [
  { title: 'Azul (tide)', value: 'tide' },
  { title: 'Coral', value: 'coral' },
  { title: 'Bronce', value: 'bronze' },
  { title: 'Verde (kelp)', value: 'kelp' },
  { title: 'Neutro', value: 'neutral' },
];

/** The slug is the product URL (/tienda/<slug>) and its id in the cart. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const product = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Dirección del producto en la tienda: /tienda/<slug>.',
      type: 'slug',
      // Uniqueness across products is checked by the slug type itself.
      options: { source: 'name', maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return true;
          return (
            SLUG_PATTERN.test(slug.current) ||
            'Solo minúsculas, números y guiones (por ejemplo: pez-payaso).'
          );
        }),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: { list: CATEGORIES, layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'water',
      title: 'Tipo de agua',
      type: 'string',
      options: { list: WATER_TYPES, layout: 'radio' },
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo',
      description: 'Nombre científico en peces; presentación o capacidad en lo demás.',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Precio',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'compareAt',
      title: 'Precio anterior',
      description: 'Se muestra tachado junto al precio.',
      type: 'number',
      // The storefront drops a previous price that is not higher than the price.
      validation: (rule) =>
        rule.min(0).custom((compareAt, context) => {
          const price = context.document?.price;
          if (typeof compareAt !== 'number' || typeof price !== 'number') return true;
          return compareAt > price || 'El precio anterior debe ser mayor que el precio.';
        }),
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      description: 'Sin foto, la tienda muestra el ícono.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'icon',
      title: 'Ícono',
      type: 'string',
      options: { list: ICONS },
    }),
    defineField({
      name: 'badgeLabel',
      title: 'Etiqueta',
      description: 'Solo se muestra si también se elige un color.',
      type: 'string',
      validation: (rule) =>
        rule.custom((label, context) =>
          Boolean(label?.trim()) === Boolean(context.document?.badgeTone) ||
          'La etiqueta necesita texto y color.'
        ),
    }),
    defineField({
      name: 'badgeTone',
      title: 'Color de la etiqueta',
      type: 'string',
      options: { list: BADGE_TONES },
    }),
    defineField({
      name: 'specs',
      title: 'Características',
      description: 'Líneas cortas que se muestran en la tarjeta del producto.',
      type: 'array',
      of: [defineArrayMember({ type: 'spec' })],
    }),
    defineField({
      name: 'beginner',
      title: 'Apto para principiantes',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'En existencia',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'temp', title: 'Temperatura', type: 'string' }),
    defineField({ name: 'ph', title: 'pH', type: 'string' }),
    defineField({ name: 'size', title: 'Tamaño', type: 'string' }),
    defineField({ name: 'mates', title: 'Compatibilidad', type: 'string' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'subtitle', media: 'image' },
  },
});
