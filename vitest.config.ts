import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

// Kept separate from vite.config.ts so unit tests do not boot the
// TanStack Start / Nitro plugins.
export default defineConfig({
	resolve: {
		alias: {
			"#": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
		// The Strapi backend is a separate project with its own tooling.
		exclude: [...configDefaults.exclude, "cms/**"],
	},
});
