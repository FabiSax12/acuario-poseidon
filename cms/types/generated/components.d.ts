import type { Schema, Struct } from '@strapi/strapi';

export interface SharedSpec extends Struct.ComponentSchema {
  collectionName: 'components_shared_specs';
  info: {
    description: 'One short line shown on a product card, e.g. "24\u201327 \u00B0C"';
    displayName: 'Spec';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'shared.spec': SharedSpec;
    }
  }
}
