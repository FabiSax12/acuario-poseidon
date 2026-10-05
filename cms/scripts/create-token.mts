// Creates the API token the storefront uses to read the catalogue, limited to
// `find` and `findOne` on products, and prints it once. The same token can be
// created by hand in the admin panel (see the README); this is a shortcut for
// local development.
//
// Usage, from cms/:  pnpm token

import { main } from './strapi-app.mts';

const TOKEN_NAME = 'Storefront (read-only)';

main(async (strapi) => {
  const tokens = strapi.service('admin::api-token');

  if (await tokens.exists({ name: TOKEN_NAME })) {
    console.log(
      `The "${TOKEN_NAME}" token already exists. Copy it from the admin panel ` +
        '(Settings > API Tokens), or delete it there and run this script again.'
    );
    return;
  }

  const token = await tokens.create({
    name: TOKEN_NAME,
    description: 'Read-only access to products for the storefront server functions',
    kind: 'content-api',
    type: 'custom',
    lifespan: null,
    permissions: ['api::product.product.find', 'api::product.product.findOne'],
  });

  console.log(`Created the "${TOKEN_NAME}" token. Add this line to ../.env.local:\n`);
  console.log(`STRAPI_API_TOKEN=${token.accessKey}`);
});
