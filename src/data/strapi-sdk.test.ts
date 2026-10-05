import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	getStrapiConfig,
	readFromStrapi,
	STRAPI_UNAVAILABLE,
} from "./strapi-sdk";

const TOKEN = "test-token-value";

beforeEach(() => {
	vi.stubEnv("STRAPI_URL", "http://cms.test:1337");
	vi.stubEnv("STRAPI_API_TOKEN", TOKEN);
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
});

describe("getStrapiConfig", () => {
	it("reads the URL and token from the environment", () => {
		expect(getStrapiConfig()).toEqual({
			url: "http://cms.test:1337",
			token: TOKEN,
		});
	});

	it("strips trailing slashes and surrounding spaces from the URL", () => {
		vi.stubEnv("STRAPI_URL", " http://cms.test:1337// ");
		expect(getStrapiConfig().url).toBe("http://cms.test:1337");
	});

	it.each([
		"STRAPI_URL",
		"STRAPI_API_TOKEN",
	])("throws naming %s when it is empty", (name) => {
		vi.stubEnv(name, "  ");
		expect(() => getStrapiConfig()).toThrow(`${name} is not set`);
	});
});

/** Shaped like the Strapi client's HTTP errors, which carry the request. */
const httpError = () =>
	Object.assign(new Error("Request failed with status code 401"), {
		name: "HTTPAuthorizationError",
		request: { headers: { Authorization: `Bearer ${TOKEN}` } },
	});

describe("readFromStrapi", () => {
	it("passes the config to the read and returns its result", async () => {
		const read = vi.fn(async () => "value");
		await expect(readFromStrapi("test read", read)).resolves.toBe("value");
		expect(read).toHaveBeenCalledWith({
			url: "http://cms.test:1337",
			token: TOKEN,
		});
	});

	it("replaces a failure with the generic error", async () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		const failure = await readFromStrapi("test read", async () => {
			throw httpError();
		}).catch((error: unknown) => error);

		expect(failure).toBeInstanceOf(Error);
		expect(failure).toHaveProperty("message", STRAPI_UNAVAILABLE);
		expect(failure).not.toHaveProperty("request");
		expect(failure).not.toHaveProperty("cause");
	});

	it("logs the label and message as text, never the error or headers", async () => {
		const log = vi.spyOn(console, "error").mockImplementation(() => {});
		await readFromStrapi("test read", async () => {
			throw httpError();
		}).catch(() => {});

		expect(log).toHaveBeenCalledTimes(1);
		const args = log.mock.calls[0];
		expect(args.every((arg) => typeof arg === "string")).toBe(true);
		const line = args.join(" ");
		expect(line).toContain("test read");
		expect(line).toContain("HTTPAuthorizationError");
		expect(line).not.toContain(TOKEN);
		expect(line).not.toContain("Bearer");
	});

	it("sanitises a missing environment variable too", async () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.stubEnv("STRAPI_API_TOKEN", "");
		await expect(readFromStrapi("test read", async () => 1)).rejects.toThrow(
			STRAPI_UNAVAILABLE,
		);
	});
});
