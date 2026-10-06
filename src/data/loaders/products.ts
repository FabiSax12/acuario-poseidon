import { createServerFn } from "@tanstack/react-start";
import { getProductsHandler } from "#/data/products-handler";

// Server function: Sanity is only ever queried from this handler. The browser
// receives plain `Product` objects.
// The response is cached by the CDN and shared between visitors, so it must
// stay independent of who asks: no cookies, session or per-user data.
export const getProducts = createServerFn({ method: "GET" }).handler(() =>
	getProductsHandler(),
);
