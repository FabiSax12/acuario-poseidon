import { defineField, defineType } from 'sanity';

/** One short line shown on a product card, e.g. "24–27 °C". */
export const spec = defineType({
  name: 'spec',
  title: 'Característica',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Texto',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'text' } },
});
