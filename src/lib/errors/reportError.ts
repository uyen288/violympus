import { AppError, isAppError } from './AppError';

/**
 * Report an error for logging/monitoring.
 * In development: logs to console.
 * In production: would send to error tracking service.
 *
 * NEVER log tokens, passwords, or PII.
 */
export function reportError(error: unknown, context?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    if (isAppError(error)) {
      console.error(`[AppError] ${error.code}: ${error.messageKey}`, {
        cause: error.cause,
        ...context,
      });
    } else if (error instanceof Error) {
      console.error(`[Error] ${error.message}`, { error, ...context });
    } else {
      console.error('[Unknown Error]', error, context);
    }
  }

  // TODO: Production error tracking (Sentry, etc.)
}

/**
 * Rethrow if not an AppError, or throw a new AppError wrapping the unknown error.
 */
export function ensureAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  return new AppError({
    code: 'UNKNOWN',
    messageKey: 'errors.unknown',
    message: error instanceof Error ? error.message : String(error),
    cause: error,
  });
}
