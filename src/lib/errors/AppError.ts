export type ErrorCode =
  | 'AUTH_EXPIRED'
  | 'AUTH_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'NETWORK'
  | 'ROOM_FULL'
  | 'ROOM_NOT_FOUND'
  | 'MATCH_ALREADY_STARTED'
  | 'ALREADY_JOINED'
  | 'STALE_STATE'
  | 'ATTEMPT_EXPIRED'
  | 'ATTEMPT_NOT_FOUND'
  | 'DUPLICATE_ANSWER'
  | 'QUESTION_NOT_IN_EXAM'
  | 'INVALID_ANSWER_PAYLOAD'
  | 'INSUFFICIENT_PLAYERS'
  | 'NOT_HOST'
  | 'IMPORT_ERROR'
  | 'RATE_LIMITED'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly messageKey: string;
  readonly cause?: unknown;

  constructor(params: {
    code: ErrorCode;
    messageKey: string;
    message?: string;
    cause?: unknown;
  }) {
    super(params.message ?? params.messageKey);
    this.name = 'AppError';
    this.code = params.code;
    this.messageKey = params.messageKey;
    this.cause = params.cause;
  }

  static fromSupabaseError(error: { code?: string; message?: string }): AppError {
    const mapping: Record<string, { code: ErrorCode; messageKey: string }> = {
      PGRST301: { code: 'AUTH_REQUIRED', messageKey: 'errors.auth_required' },
      '42501': { code: 'FORBIDDEN', messageKey: 'errors.forbidden' },
      '23505': { code: 'DUPLICATE_ANSWER', messageKey: 'errors.duplicate' },
    };

    const match = error.code ? mapping[error.code] : undefined;

    return new AppError({
      code: match?.code ?? 'UNKNOWN',
      messageKey: match?.messageKey ?? 'errors.unknown',
      message: error.message,
      cause: error,
    });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function mapSupabaseAuthError(error: { message?: string; status?: number; code?: string }): AppError {
  if (error.message?.includes('Invalid login credentials')) {
    return new AppError({
      code: 'AUTH_REQUIRED',
      messageKey: 'auth.invalidCredentials',
      message: error.message,
      cause: error,
    });
  }
  if (error.message?.includes('User already registered')) {
    return new AppError({
      code: 'VALIDATION',
      messageKey: 'auth.userAlreadyExists',
      message: error.message,
      cause: error,
    });
  }
  return new AppError({
    code: 'UNKNOWN',
    messageKey: 'errors.unknown',
    message: error.message,
    cause: error,
  });
}

