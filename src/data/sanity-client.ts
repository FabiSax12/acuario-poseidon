// Server-only: importing this module from client code fails the build, which
// keeps the Sanity client and its configuration out of the browser bundle.
import "@tanstack/react-start/server-only";
import { createClient } from "@sanity/client";

export interface SanityConfig {
	projectId: string;
	dataset: string;
	/** Dated API version (YYYY-MM-DD). Pinned so query behaviour never drifts. */
	apiVersion: string;
}

/**
 * Used when SANITY_API_VERSION is not set. From 2025-02-19 on, queries return
 * published documents only by default.
 */
export const DEFAULT_API_VERSION = "2025-02-19";

const requireEnv = (name: "SANITY_PROJECT_ID" | "SANITY_DATASET") => {
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
export function getSanityConfig(): SanityConfig {
	return {
		projectId: requireEnv("SANITY_PROJECT_ID"),
		dataset: requireEnv("SANITY_DATASET"),
		apiVersion: process.env.SANITY_API_VERSION?.trim() || DEFAULT_API_VERSION,
	};
}

/**
 * Sanity client for read queries. The dataset is public, so there is no
 * token: the storefront can only read published documents, through Sanity's
 * API CDN.
 */
export function getSanityClient(config: SanityConfig = getSanityConfig()) {
	return createClient({ ...config, useCdn: true, perspective: "published" });
}

/** Shown to callers instead of the underlying failure. */
export const SANITY_UNAVAILABLE = "The catalogue is temporarily unavailable";

const describe = (error: unknown) => {
	if (!(error instanceof Error)) return String(error);
	// A failed fetch keeps the reason (e.g. ENOTFOUND) on `cause`.
	const cause = error.cause as { code?: string; message?: string } | undefined;
	const reason = cause?.code || cause?.message;
	return `${error.name}: ${error.message}${reason ? ` (${reason})` : ""}`;
};

/**
 * Runs a Sanity read. Server function errors are serialised to the browser,
 * so a failure is logged here and replaced with a generic error: env var
 * names and Sanity's messages stay on the server. Only the name and message
 * are logged, because the client's HTTP errors carry the whole response.
 */
export async function readFromSanity<T>(
	label: string,
	read: (config: SanityConfig) => Promise<T>,
): Promise<T> {
	try {
		return await read(getSanityConfig());
	} catch (error) {
		console.error(`[sanity] ${label} failed: ${describe(error)}`);
		throw new Error(SANITY_UNAVAILABLE);
	}
}
