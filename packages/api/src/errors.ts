import type { ErrorResponse } from '@repo/types'

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }

  toJSON(): ErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    }
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string, errors: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 400, errors)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

/**
 * Insufficient resources error (e.g., not enough gold)
 */
export class InsufficientResourcesError extends AppError {
  constructor(resource: string) {
    super(`Insufficient ${resource}`, 'INSUFFICIENT_RESOURCES', 400)
    this.name = 'InsufficientResourcesError'
    Object.setPrototypeOf(this, InsufficientResourcesError.prototype)
  }
}

/**
 * Conflict error (e.g., duplicate username)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
    this.name = 'ConflictError'
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

/**
 * Wraps Supabase errors into application errors
 */
export function handleSupabaseError(error: any): never {
  // Handle Supabase auth errors
  if (error.status === 401 || error.message?.includes('JWT')) {
    throw new AuthenticationError(error.message || 'Authentication failed')
  }

  // Handle not found errors
  if (error.code === 'PGRST116' || error.status === 404) {
    throw new NotFoundError('Resource')
  }

  // Handle unique constraint violations
  if (error.code === '23505') {
    throw new ConflictError('Resource already exists')
  }

  // Handle foreign key violations
  if (error.code === '23503') {
    throw new NotFoundError('Related resource')
  }

  // Handle check constraint violations
  if (error.code === '23514') {
    throw new ValidationError('Invalid data', {
      constraint: [error.message || 'Check constraint violation'],
    })
  }

  // Generic error
  throw new AppError(
    error.message || 'An unexpected error occurred',
    error.code || 'UNKNOWN_ERROR',
    error.status || 500
  )
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
