import { describe, expect, it } from "vitest";
import { parseArticleKey, parseArticleListInput } from "./article-input";

describe("parseArticleListInput", () => {
	it.each([undefined, null, {}])("returns no filters for %s", (input) => {
		expect(parseArticleListInput(input)).toEqual({});
	});

	it("keeps a valid page, category and query, trimmed", () => {
		expect(
			parseArticleListInput({ page: 2, category: " guias ", query: " ph " }),
		).toEqual({ page: 2, category: "guias", query: "ph" });
	});

	it("drops blank strings", () => {
		expect(parseArticleListInput({ category: " ", query: "" })).toEqual({});
	});

	it.each([
		["a string input", "page=1"],
		["an array input", [1]],
		["an object as query", { query: { $ne: null } }],
		["an object as category", { category: { slug: { $ne: "x" } } }],
		["an array as query", { query: ["a"] }],
		["a query over 100 characters", { query: "a".repeat(101) }],
		["a category over 100 characters", { category: "a".repeat(101) }],
		["a string page", { page: "2" }],
		["a fractional page", { page: 1.5 }],
		["page zero", { page: 0 }],
		["a page over 1000", { page: 1001 }],
		["a NaN page", { page: Number.NaN }],
	])("rejects %s", (_case, input) => {
		expect(() => parseArticleListInput(input)).toThrow(/^Invalid /);
	});
});

describe("parseArticleKey", () => {
	it("returns the trimmed key", () => {
		expect(parseArticleKey(" cuidado-del-agua ", "slug")).toBe(
			"cuidado-del-agua",
		);
	});

	it.each([
		["an object", { $ne: null }],
		["a number", 7],
		["an empty string", ""],
		["a blank string", "  "],
		["a string over 200 characters", "a".repeat(201)],
		["undefined", undefined],
	])("rejects %s", (_case, value) => {
		expect(() => parseArticleKey(value, "slug")).toThrow("Invalid slug");
	});
});
