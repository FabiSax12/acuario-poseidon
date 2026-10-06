import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	DEFAULT_API_VERSION,
	getSanityClient,
	getSanityConfig,
	readFromSanity,
	SANITY_UNAVAILABLE,
} from "./sanity-client";

const { createClient } = vi.hoisted(() => ({
	createClient: vi.fn(() => ({})),
}));

vi.mock("@sanity/client", () => ({ createClient }));

beforeEach(() => {
	vi.stubEnv("SANITY_PROJECT_ID", "abc123");
	vi.stubEnv("SANITY_DATASET", "production");
	vi.stubEnv("SANITY_API_VERSION", "");
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.restoreAllMocks();
	createClient.mockClear();
});

describe("getSanityConfig", () => {
	it("reads the project and dataset and pins the default API version", () => {
		expect(getSanityConfig()).toEqual({
			projectId: "abc123",
			dataset: "production",
			apiVersion: DEFAULT_API_VERSION,
		});
		expect(DEFAULT_API_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it("uses SANITY_API_VERSION when it is set", () => {
		vi.stubEnv("SANITY_API_VERSION", " 2026-01-01 ");
		expect(getSanityConfig().apiVersion).toBe("2026-01-01");
	});

	it("trims surrounding spaces", () => {
		vi.stubEnv("SANITY_PROJECT_ID", " abc123 ");
		vi.stubEnv("SANITY_DATASET", " staging ");
		expect(getSanityConfig()).toMatchObject({
			projectId: "abc123",
			dataset: "staging",
		});
	});

	it.each([
		"SANITY_PROJECT_ID",
		"SANITY_DATASET",
	])("throws naming %s when it is empty", (name) => {
		vi.stubEnv(name, "  ");
		expect(() => getSanityConfig()).toThrow(`${name} is not set`);
	});
});

describe("getSanityClient", () => {
	it("creates a tokenless client that reads published content from the CDN", () => {
		getSanityClient();
		expect(createClient).toHaveBeenCalledWith({
			projectId: "abc123",
			dataset: "production",
			apiVersion: DEFAULT_API_VERSION,
			useCdn: true,
			perspective: "published",
		});
	});
});

/** Shaped like the Sanity client's HTTP errors, which carry the response. */
const httpError = () =>
	Object.assign(new Error("Dataset not found"), {
		name: "ClientError",
		statusCode: 404,
		response: { body: { secret: "response-body-value" } },
	});

describe("readFromSanity", () => {
	it("passes the config to the read and returns its result", async () => {
		const read = vi.fn(async () => "value");
		await expect(readFromSanity("test read", read)).resolves.toBe("value");
		expect(read).toHaveBeenCalledWith({
			projectId: "abc123",
			dataset: "production",
			apiVersion: DEFAULT_API_VERSION,
		});
	});

	it("replaces a failure with the generic error", async () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		const failure = await readFromSanity("test read", async () => {
			throw httpError();
		}).catch((error: unknown) => error);

		expect(failure).toBeInstanceOf(Error);
		expect(failure).toHaveProperty("message", SANITY_UNAVAILABLE);
		expect(failure).not.toHaveProperty("response");
		expect(failure).not.toHaveProperty("cause");
	});

	it("logs the label and message as text, never the error object", async () => {
		const log = vi.spyOn(console, "error").mockImplementation(() => {});
		await readFromSanity("test read", async () => {
			throw httpError();
		}).catch(() => {});

		expect(log).toHaveBeenCalledTimes(1);
		const args = log.mock.calls[0];
		expect(args.every((arg) => typeof arg === "string")).toBe(true);
		const line = args.join(" ");
		expect(line).toContain("[sanity] test read failed");
		expect(line).toContain("ClientError: Dataset not found");
		expect(line).not.toContain("response-body-value");
	});

	it("logs the reason a failed request keeps on its cause", async () => {
		const log = vi.spyOn(console, "error").mockImplementation(() => {});
		await readFromSanity("test read", async () => {
			throw new TypeError("fetch failed", { cause: { code: "ENOTFOUND" } });
		}).catch(() => {});
		expect(log.mock.calls[0].join(" ")).toContain(
			"TypeError: fetch failed (ENOTFOUND)",
		);
	});

	it("sanitises a missing environment variable too", async () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.stubEnv("SANITY_PROJECT_ID", "");
		await expect(readFromSanity("test read", async () => 1)).rejects.toThrow(
			SANITY_UNAVAILABLE,
		);
	});
});
