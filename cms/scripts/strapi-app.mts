import { createRequire } from 'node:module';
import type { Core } from '@strapi/strapi';

// Strapi's ESM build cannot be loaded by Node directly (it uses directory
// imports such as `lodash/fp`), so load the CommonJS build instead.
const require = createRequire(import.meta.url);
const { compileStrapi, createStrapi } =
  require('@strapi/strapi') as typeof import('@strapi/strapi');

/**
 * Boots the Strapi app without the HTTP server, runs `task`, then shuts down.
 * Must be started from the cms/ directory (the package scripts do that).
 */
export async function withStrapi(task: (strapi: Core.Strapi) => Promise<void>): Promise<void> {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';
  try {
    await task(app);
  } finally {
    await app.destroy();
  }
}

/** Entry point wrapper: reports failures and sets the exit code. */
export function main(task: (strapi: Core.Strapi) => Promise<void>): void {
  withStrapi(task).then(
    () => process.exit(0),
    (error) => {
      console.error(error);
      process.exit(1);
    }
  );
}
