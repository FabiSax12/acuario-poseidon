import * as Sentry from "@sentry/tanstackstart-react";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { getContext } from "./integrations/tanstack-query/root-provider";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const context = getContext();

	const router = createTanStackRouter({
		routeTree,
		context,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	});

	setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

	// The server side is initialized in instrument.server.mjs; keep both in sync.
	const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
	if (!router.isServer && sentryDsn) {
		Sentry.init({
			dsn: sentryDsn,
			// CI sets VITE_SENTRY_ENVIRONMENT to "production" or "preview" at build time.
			environment:
				import.meta.env.VITE_SENTRY_ENVIRONMENT ??
				(import.meta.env.DEV ? "development" : "production"),
			dataCollection: {
				userInfo: false,
				httpBodies: [],
			},
			integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
			tracesSampleRate: 0.1,
		});
	}

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
