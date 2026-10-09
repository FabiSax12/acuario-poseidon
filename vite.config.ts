import babel from "@rolldown/plugin-babel";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

const config = defineConfig(({ mode }) => {
	// Empty prefix so SENTRY_AUTH_TOKEN (not VITE_-prefixed) is loaded too.
	const env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

	return {
		resolve: { tsconfigPaths: true },
		// The Sanity Studio in studio/ is a separate project; its build output must
		// not trigger reloads here.
		server: { watch: { ignored: ["**/studio/**"] } },
		// With a token the Sentry plugin emits hidden source maps, uploads them
		// and deletes them. Without one nothing would delete them, so they are
		// not generated and never reach the public assets.
		build: env.SENTRY_AUTH_TOKEN ? undefined : { sourcemap: false },
		plugins: [
			devtools(),
			nitro(),
			tailwindcss(),
			tanstackStart(),
			viteReact(),
			babel({ presets: [reactCompilerPreset()] }),
			// Must stay last. Without SENTRY_AUTH_TOKEN the build still succeeds; it
			// only skips the source map upload.
			sentryTanstackStart({
				org: env.VITE_SENTRY_ORG,
				project: env.VITE_SENTRY_PROJECT,
				authToken: env.SENTRY_AUTH_TOKEN,
			}),
		],
	};
});

export default config;
