import { describe, expect, it } from "vitest";
import {
	CATALOG_CACHE_CONTROL,
	catalogCacheHeaders,
	catalogRouteHeaders,
	NO_STORE,
	noStoreHeaders,
} from "./cache-headers";

const POLICY = "public, max-age=0, s-maxage=300, stale-while-revalidate=300";

describe("catalogCacheHeaders", () => {
	it("caches a catalogue with products on the CDN for five minutes, plus five stale", () => {
		expect(CATALOG_CACHE_CONTROL).toBe(POLICY);
		expect(catalogCacheHeaders(12)).toEqual({ "Cache-Control": POLICY });
		expect(catalogCacheHeaders(1)).toEqual({ "Cache-Control": POLICY });
	});

	it("never caches an empty catalogue", () => {
		expect(catalogCacheHeaders(0)).toEqual({ "Cache-Control": "no-store" });
	});

	it("returns a new object on every call", () => {
		expect(catalogCacheHeaders(1)).not.toBe(catalogCacheHeaders(1));
	});
});

describe("noStoreHeaders", () => {
	it("keeps the response out of every cache", () => {
		expect(NO_STORE).toBe("no-store");
		expect(noStoreHeaders()).toEqual({ "Cache-Control": "no-store" });
	});
});

describe("catalogRouteHeaders", () => {
	it("applies the catalogue policy to a page that loaded products", () => {
		expect(
			catalogRouteHeaders({
				match: { status: "success" },
				loaderData: { productCount: 12 },
			}),
		).toEqual({ "Cache-Control": POLICY });
	});

	it("keeps a page that loaded an empty catalogue out of every cache", () => {
		expect(
			catalogRouteHeaders({
				match: { status: "success" },
				loaderData: { productCount: 0 },
			}),
		).toEqual(noStoreHeaders());
	});

	it("does not cache when the loader data is missing", () => {
		expect(catalogRouteHeaders({ match: { status: "success" } })).toEqual(
			noStoreHeaders(),
		);
	});

	it.each([
		"notFound",
		"error",
		"pending",
	] as const)("keeps a page whose match is %s out of every cache", (status) => {
		expect(
			catalogRouteHeaders({
				match: { status },
				loaderData: { productCount: 12 },
			}),
		).toEqual(noStoreHeaders());
	});
});
