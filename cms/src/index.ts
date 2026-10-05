import type { Core } from '@strapi/strapi';

const REQUIRED_SECRETS = [
  'APP_KEYS',
  'API_TOKEN_SALT',
  'ADMIN_JWT_SECRET',
  'TRANSFER_TOKEN_SALT',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
];

/** Empty, or still one of the `toBeModified` values older templates shipped. */
const isUnset = (value: string | undefined) =>
  !value || value.split(',').some((part) => part.trim() === '' || /tobemodified/i.test(part));

/**
 * Production must not run on missing or well-known secrets. Only the variable
 * names are reported, never their values.
 */
function assertProductionSecrets() {
  if (process.env.NODE_ENV !== 'production') return;
  const unset = REQUIRED_SECRETS.filter((name) => isUnset(process.env[name]));
  if (unset.length > 0) {
    throw new Error(
      `Refusing to start in production: ${unset.join(', ')} must be set to random values. ` +
        'See the comments in .env.example.'
    );
  }
}

/**
 * The storefront has no customer accounts, so public sign-up stays off. It is
 * enforced on every start, which covers a fresh database and also reverts the
 * setting if it is switched on in the admin panel (Settings > Users &
 * Permissions > Advanced settings). Remove this to allow registration.
 */
async function disablePublicSignUp(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'plugin', name: 'users-permissions', key: 'advanced' });
  const settings = (await store.get()) as { allow_register?: boolean } | null;
  if (settings && settings.allow_register !== false) {
    await store.set({ value: { ...settings, allow_register: false } });
    strapi.log.info('Public sign-up disabled (users-permissions allow_register = false)');
  }
}

export default {
  register() {
    assertProductionSecrets();
  },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await disablePublicSignUp(strapi);
  },
};
