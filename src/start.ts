import {
	sentryGlobalFunctionMiddleware,
	sentryGlobalRequestMiddleware,
} from "@sentry/tanstackstart-react";
import { createStart } from "@tanstack/react-start";

// Sentry middleware must stay first in each array so it sees errors thrown by
// any middleware added after it.
export const startInstance = createStart(() => {
	return {
		requestMiddleware: [sentryGlobalRequestMiddleware],
		functionMiddleware: [sentryGlobalFunctionMiddleware],
	};
});
