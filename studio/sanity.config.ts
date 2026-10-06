import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

// Read from .env (see .env.example). Only SANITY_STUDIO_ variables reach the
// Studio bundle, and they must be written out in full to be replaced at build
// time.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'SANITY_STUDIO_PROJECT_ID is not set. Copy .env.example to .env and fill it in.'
  );
}

export default defineConfig({
  name: 'default',
  title: 'Acuario Poseidón',
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
