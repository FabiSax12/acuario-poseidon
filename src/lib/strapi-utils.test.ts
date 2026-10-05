import { describe, expect, it } from "vitest";
import { getStrapiMedia } from "./strapi-utils";

const BASE = "http://localhost:1337";

describe("getStrapiMedia", () => {
	it.each([null, undefined, ""])("returns an empty string for %s", (url) => {
		expect(getStrapiMedia(url, BASE)).toBe("");
	});

	it("prefixes a relative URL with the base URL", () => {
		expect(getStrapiMedia("/uploads/a.jpg", BASE)).toBe(
			"http://localhost:1337/uploads/a.jpg",
		);
	});

	it("joins with a single slash whatever the two sides carry", () => {
		expect(getStrapiMedia("uploads/a.jpg", BASE)).toBe(
			"http://localhost:1337/uploads/a.jpg",
		);
		expect(getStrapiMedia("/uploads/a.jpg", `${BASE}//`)).toBe(
			"http://localhost:1337/uploads/a.jpg",
		);
	});

	it.each([
		"https://cdn.example.com/a.jpg",
		"http://cdn.example.com/a.jpg",
		"//cdn.example.com/a.jpg",
		"data:image/png;base64,AAAA",
	])("returns the absolute URL %s untouched", (url) => {
		expect(getStrapiMedia(url, BASE)).toBe(url);
	});

	it("keeps a relative URL relative to the origin without a base URL", () => {
		expect(getStrapiMedia("/uploads/a.jpg")).toBe("/uploads/a.jpg");
		expect(getStrapiMedia("uploads/a.jpg")).toBe("/uploads/a.jpg");
	});
});
