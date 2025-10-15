// Validation helper functions

import { z, ZodError, ZodSchema } from 'zod';

/**
 * Extended validation result with data
 */
interface ValidateSuccess<T> {
  success: true;
  data: T;
  errors?: never;
}

interface ValidateFailure {
  success: false;
  data?: never;
  errors: Record<string, string[]>;
}

type ValidateResult<T> = ValidateSuccess<T> | ValidateFailure;

/**
 * Validate data against a Zod schema
 */
export function validate<T>(
  schema: ZodSchema<T>,
  data: unknown
): ValidateResult<T> {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return {
        success: false,
        errors,
      };
    }

    return {
      success: false,
      errors: {
        _general: ['Validation failed'],
      },
    };
  }
}

/**
 * Validate data and throw on error
 */
export function validateOrThrow<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  return schema.parse(data);
}

/**
 * Safe parse that returns null on error
 */
export function safeParse<T>(
  schema: ZodSchema<T>,
  data: unknown
): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Check if data is valid without returning errors
 */
export function isValid<T>(
  schema: ZodSchema<T>,
  data: unknown
): boolean {
  return schema.safeParse(data).success;
}

/**
 * Get first error message for a field
 */
export function getFirstError(
  errors: Record<string, string[]> | undefined,
  field: string
): string | undefined {
  return errors?.[field]?.[0];
}

/**
 * Get all error messages for a field
 */
export function getFieldErrors(
  errors: Record<string, string[]> | undefined,
  field: string
): string[] {
  return errors?.[field] || [];
}

/**
 * Check if a field has errors
 */
export function hasFieldError(
  errors: Record<string, string[]> | undefined,
  field: string
): boolean {
  return Boolean(errors?.[field]?.length);
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(
  errors: Record<string, string[]>
): string {
  return Object.entries(errors)
    .map(([field, messages]) => {
      const fieldName = field === '_general' ? 'General' : field;
      return `${fieldName}: ${messages.join(', ')}`;
    })
    .join('\n');
}

/**
 * Create a custom error message map for Zod
 */
export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'string') {
      return { message: 'This field must be text' };
    }
    if (issue.expected === 'number') {
      return { message: 'This field must be a number' };
    }
    if (issue.expected === 'boolean') {
      return { message: 'This field must be true or false' };
    }
  }

  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      return { message: `Must be at least ${issue.minimum} characters` };
    }
    if (issue.type === 'number') {
      return { message: `Must be at least ${issue.minimum}` };
    }
    if (issue.type === 'array') {
      return { message: `Must have at least ${issue.minimum} items` };
    }
  }

  if (issue.code === z.ZodIssueCode.too_big) {
    if (issue.type === 'string') {
      return { message: `Must be at most ${issue.maximum} characters` };
    }
    if (issue.type === 'number') {
      return { message: `Must be at most ${issue.maximum}` };
    }
    if (issue.type === 'array') {
      return { message: `Must have at most ${issue.maximum} items` };
    }
  }

  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === 'email') {
      return { message: 'Invalid email address' };
    }
    if (issue.validation === 'url') {
      return { message: 'Invalid URL' };
    }
    if (issue.validation === 'uuid') {
      return { message: 'Invalid ID format' };
    }
  }

  return { message: ctx.defaultError };
};

/**
 * Partial validation - only validate provided fields
 */
export function validatePartial<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown
): ValidateResult<Partial<z.infer<z.ZodObject<T>>>> {
  const partialSchema = schema.partial();
  return validate(partialSchema, data);
}

/**
 * Validate array of items
 */
export function validateArray<T>(
  schema: ZodSchema<T>,
  data: unknown[]
): ValidateResult<T[]> {
  const arraySchema = z.array(schema);
  return validate(arraySchema, data);
}

/**
 * Validate with custom error messages
 */
export function validateWithMessages<T>(
  schema: ZodSchema<T>,
  data: unknown,
  customMessages?: Record<string, string>
): ValidateResult<T> {
  const result = validate(schema, data);

  if (!result.success && result.errors && customMessages) {
    const updatedErrors: Record<string, string[]> = {};

    Object.entries(result.errors).forEach(([field, messages]) => {
      if (customMessages[field]) {
        updatedErrors[field] = [customMessages[field]];
      } else {
        updatedErrors[field] = messages;
      }
    });

    return {
      ...result,
      errors: updatedErrors,
    };
  }

  return result;
}
