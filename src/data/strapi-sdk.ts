// Server-only: importing this module from client code fails the build, which
// keeps the Strapi URL and API token out of the browser bundle.
import "@tanstack/react-start/server-only";
import { strapi } from "@strapi/client";

export interface StrapiConfig {
	/** Strapi base URL, without `/api` and without a trailing slash. */
	url: string;
	token: string;
}

const requireEnv = (name: "STRAPI_URL" | "STRAPI_API_TOKEN") => {
	const value = process.env[name]?.trim();
	if (!value) {
		throw new Error(
			`${name} is not set. Copy .env.example to .env.local and fill it in.`,
		);
	}
	return value;
};

/**
 * Read per call, never at module scope, so the values come from the runtime
 * environment and are not inlined at build time.
 */
export function getStrapiConfig(): StrapiConfig {
	return {
		url: requireEnv("STRAPI_URL").replace(/\/+$/, ""),
		token: requireEnv("STRAPI_API_TOKEN"),
	};
}

/** Strapi client for the REST API, authenticated with the read-only token. */
export function getStrapiClient(config: StrapiConfig = getStrapiConfig()) {
	return strapi({ baseURL: `${config.url}/api`, auth: config.token });
}

/** Shown to callers instead of the underlying failure. */
export const STRAPI_UNAVAILABLE = "The catalogue is temporarily unavailable";

const describe = (error: unknown) => {
	if (!(error instanceof Error)) return String(error);
	// A failed fetch keeps the reason (e.g. ECONNREFUSED) on `cause`.
	const cause = error.cause as { code?: string; message?: string } | undefined;
	const reason = cause?.code || cause?.message;
	return `${error.name}: ${error.message}${reason ? ` (${reason})` : ""}`;
};

/**
 * Runs a Strapi read. Server function errors are serialised to the browser,
 * so a failure is logged here and replaced with a generic error: internal
 * URLs, env var names and Strapi's messages stay on the server. Only the name
 * and message are logged, because the client's HTTP errors carry the request,
 * including its Authorization header.
 */
export async function readFromStrapi<T>(
	label: string,
	read: (config: StrapiConfig) => Promise<T>,
): Promise<T> {
	try {
		return await read(getStrapiConfig());
	} catch (error) {
		console.error(`[strapi] ${label} failed: ${describe(error)}`);
		throw new Error(STRAPI_UNAVAILABLE);
	}
}
