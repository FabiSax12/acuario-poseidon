// Input validation for the article server functions. Server function inputs
// come from the network, so nothing but short plain strings and a bounded page
// number may reach the Strapi query.

const MAX_FILTER_LENGTH = 100;
const MAX_KEY_LENGTH = 200;
const MAX_PAGE = 1000;

export interface ArticleListInput {
	page?: number;
	category?: string;
	query?: string;
}

const optionalText = (value: unknown, label: string): string | undefined => {
	if (value == null) return undefined;
	if (typeof value !== "string" || value.length > MAX_FILTER_LENGTH) {
		throw new Error(`Invalid ${label}`);
	}
	return value.trim() || undefined;
};

export function parseArticleListInput(input: unknown): ArticleListInput {
	if (input == null) return {};
	if (typeof input !== "object" || Array.isArray(input)) {
		throw new Error("Invalid article filters");
	}
	const { page, category, query } = input as Record<string, unknown>;
	const result: ArticleListInput = {};

	if (page != null) {
		if (
			typeof page !== "number" ||
			!Number.isInteger(page) ||
			page < 1 ||
			page > MAX_PAGE
		) {
			throw new Error("Invalid page");
		}
		result.page = page;
	}
	const cleanCategory = optionalText(category, "category");
	if (cleanCategory) result.category = cleanCategory;
	const cleanQuery = optionalText(query, "query");
	if (cleanQuery) result.query = cleanQuery;
	return result;
}

/** A required slug or documentId. `label` names it in the error. */
export function parseArticleKey(value: unknown, label: string): string {
	const key = typeof value === "string" ? value.trim() : "";
	if (!key || key.length > MAX_KEY_LENGTH) throw new Error(`Invalid ${label}`);
	return key;
}
