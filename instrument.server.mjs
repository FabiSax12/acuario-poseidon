import * as Sentry from '@sentry/tanstackstart-react'

const sentryDsn =
  import.meta.env?.VITE_SENTRY_DSN ?? process.env.VITE_SENTRY_DSN

if (!sentryDsn) {
  console.warn('VITE_SENTRY_DSN is not defined. Sentry is not running.')
} else {
  Sentry.init({
    dsn: sentryDsn,
    // CI sets VITE_SENTRY_ENVIRONMENT to "production" or "preview" at build
    // time; VERCEL_ENV covers a build that did not get it.
    environment:
      import.meta.env?.VITE_SENTRY_ENVIRONMENT ??
      process.env.VITE_SENTRY_ENVIRONMENT ??
      process.env.VERCEL_ENV ??
      (import.meta.env?.DEV ? 'development' : 'production'),
    dataCollection: {
      userInfo: false,
      httpBodies: [],
    },
    tracesSampleRate: 0.1,
  })
}
