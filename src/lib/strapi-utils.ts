/**
 * Strapi URL helpers. Pure and free of env access, so they are safe on the
 * server and in the browser.
 *
 * The Strapi URL is a server-only variable (STRAPI_URL), so loaders should
 * make media URLs absolute on the server, the way src/lib/product-mapper.ts
 * does, before the data reaches a component.
 */

const ABSOLUTE_URL = /^(data:|https?:|\/\/)/;

/**
 * Full URL for a media asset. Absolute and data URLs are returned untouched;
 * relative ones are prefixed with `baseUrl`. Without a base they stay relative
 * to the current origin.
 */
export function getStrapiMedia(
	url: string | undefined | null,
	baseUrl = "",
): string {
	if (!url) return "";
	if (ABSOLUTE_URL.test(url)) return url;
	return `${baseUrl.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}
