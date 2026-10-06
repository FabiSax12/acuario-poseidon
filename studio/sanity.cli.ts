import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Both are optional. Without them `sanity deploy` asks for the hostname and
  // prints the app id to save in .env.
  studioHost: process.env.SANITY_STUDIO_HOSTNAME || undefined,
  deployment: {
    appId: process.env.SANITY_STUDIO_APP_ID || undefined,
    autoUpdates: true,
  },
});
