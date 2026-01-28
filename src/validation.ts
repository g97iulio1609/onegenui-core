import { z } from "zod";
import type { DynamicValue, DataModel, LogicExpression } from "./types";
import { DynamicValueSchema, resolveDynamicValue } from "./types";
import {
  LogicExpressionSchema,
  evaluateLogicExpression,
  type VisibilityContext,
} from "./visibility";

/**
 * Validation check definition
 */
export interface ValidationCheck {
  /** Function name (built-in or from catalog) */
  fn: string;
  /** Additional arguments for the function */
  args?: Record<string, DynamicValue>;
  /** Error message to display if check fails */
  message: string;
  /** Condition for when this check should run */
  when?: LogicExpression;
}

/**
 * Validation configuration for a field
 */
export interface ValidationConfig {
  /** Array of checks to run */
  checks?: ValidationCheck[];
  /** When to run validation */
  validateOn?: "change" | "blur" | "submit";
  /** Condition for when validation is enabled */
  enabled?: LogicExpression;
}

/**
 * Schema for validation check
 */
export const ValidationCheckSchema = z.object({
  fn: z.string(),
  args: z.record(z.string(), DynamicValueSchema).optional(),
  message: z.string(),
  when: LogicExpressionSchema.optional(),
});

/**
 * Schema for validation config
 */
export const ValidationConfigSchema = z.object({
  checks: z.array(ValidationCheckSchema).optional(),
  validateOn: z.enum(["change", "blur", "submit"]).optional(),
  enabled: LogicExpressionSchema.optional(),
});

/**
 * Validation function signature
 */
export type ValidationFunction = (
  value: unknown,
  args?: Record<string, unknown>,
) => boolean;

/**
 * Validation function definition in catalog
 */
export interface ValidationFunctionDefinition {
  /** The validation function */
  validate: ValidationFunction;
  /** Description for AI */
  description?: string;
}

/**
 * Built-in validation functions
 */
export const builtInValidationFunctions: Record<string, ValidationFunction> = {
  /**
   * Check if value is not null, undefined, or empty string
   */
  required: (value: unknown) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  /**
   * Check if value is a valid email address
   */
  email: (value: unknown) => {
    if (typeof value !== "string") return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },

  /**
   * Check minimum string length
   */
  minLength: (value: unknown, args?: Record<string, unknown>) => {
    if (typeof value !== "string") return false;
    const min = args?.min;
    if (typeof min !== "number") return false;
    return value.length >= min;
  },

  /**
   * Check maximum string length
   */
  maxLength: (value: unknown, args?: Record<string, unknown>) => {
    if (typeof value !== "string") return false;
    const max = args?.max;
    if (typeof max !== "number") return false;
    return value.length <= max;
  },

  /**
   * Check if string matches a regex pattern
   */
  pattern: (value: unknown, args?: Record<string, unknown>) => {
    if (typeof value !== "string") return false;
    const pattern = args?.pattern;
    if (typeof pattern !== "string") return false;
    try {
      return new RegExp(pattern).test(value);
    } catch {
      return false;
    }
  },

  /**
   * Check minimum numeric value
   */
  min: (value: unknown, args?: Record<string, unknown>) => {
    if (typeof value !== "number") return false;
    const min = args?.min;
    if (typeof min !== "number") return false;
    return value >= min;
  },

  /**
   * Check maximum numeric value
   */
  max: (value: unknown, args?: Record<string, unknown>) => {
    if (typeof value !== "number") return false;
    const max = args?.max;
    if (typeof max !== "number") return false;
    return value <= max;
  },

  /**
   * Check if value is a number
   */
  numeric: (value: unknown) => {
    if (typeof value === "number") return !isNaN(value);
    if (typeof value === "string") return !isNaN(parseFloat(value));
    return false;
  },

  /**
   * Check if value is a valid URL
   */
  url: (value: unknown) => {
    if (typeof value !== "string") return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if value matches another field
   */
  matches: (value: unknown, args?: Record<string, unknown>) => {
    const other = args?.other;
    return value === other;
  },

  /**
   * Check if value is a valid phone number (international format)
   */
  phone: (value: unknown) => {
    if (typeof value !== "string") return false;
    // Matches international phone formats: +1234567890, (123) 456-7890, etc.
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    return phoneRegex.test(value) && value.replace(/\D/g, "").length >= 7;
  },

  /**
   * Check if value is a valid date string
   */
  date: (value: unknown, args?: Record<string, unknown>) => {
    if (typeof value !== "string") return false;
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;

    // Optional: check format
    const format = args?.format as string | undefined;
    if (format === "iso") {
      return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(value);
    }

    return true;
  },

  /**
   * Check if date is in the future
   */
  futureDate: (value: unknown) => {
    if (typeof value !== "string") return false;
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;
    return date > new Date();
  },

  /**
   * Check if date is in the past
   */
  pastDate: (value: unknown) => {
    if (typeof value !== "string") return false;
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;
    return date < new Date();
  },

  /**
   * Check if value contains only alphanumeric characters
   */
  alphanumeric: (value: unknown) => {
    if (typeof value !== "string") return false;
    return /^[a-zA-Z0-9]+$/.test(value);
  },

  /**
   * Check if array has at least N items
   */
  minItems: (value: unknown, args?: Record<string, unknown>) => {
    if (!Array.isArray(value)) return false;
    const min = args?.min;
    if (typeof min !== "number") return false;
    return value.length >= min;
  },

  /**
   * Check if array has at most N items
   */
  maxItems: (value: unknown, args?: Record<string, unknown>) => {
    if (!Array.isArray(value)) return false;
    const max = args?.max;
    if (typeof max !== "number") return false;
    return value.length <= max;
  },
};

/**
 * Validation result for a single check
 */
export interface ValidationCheckResult {
  fn: string;
  valid: boolean;
  message: string;
}

/**
 * Full validation result for a field
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  checks: ValidationCheckResult[];
}

/**
 * Context for running validation
 */
export interface ValidationContext {
  /** Current value to validate */
  value: unknown;
  /** Full data model for resolving paths */
  dataModel: DataModel;
  /** Custom validation functions from catalog */
  customFunctions?: Record<string, ValidationFunction>;
}

/**
 * Run a single validation check
 */
export function runValidationCheck(
  check: ValidationCheck,
  ctx: ValidationContext,
): ValidationCheckResult {
  const { value, dataModel, customFunctions } = ctx;

  // Check if this validation check should run (when condition)
  if (check.when) {
    const visibilityCtx: VisibilityContext = { dataModel };
    const shouldRun = evaluateLogicExpression(check.when, visibilityCtx);
    if (!shouldRun) {
      return {
        fn: check.fn,
        valid: true, // Skip this check when condition is false
        message: check.message,
      };
    }
  }

  // Resolve args
  const resolvedArgs: Record<string, unknown> = {};
  if (check.args) {
    for (const [key, argValue] of Object.entries(check.args)) {
      resolvedArgs[key] = resolveDynamicValue(argValue, dataModel);
    }
  }

  // Find the validation function
  const fn =
    builtInValidationFunctions[check.fn] ?? customFunctions?.[check.fn];

  if (!fn) {
    console.warn(`Unknown validation function: ${check.fn}`);
    return {
      fn: check.fn,
      valid: true, // Don't fail on unknown functions
      message: check.message,
    };
  }

  const valid = fn(value, resolvedArgs);

  return {
    fn: check.fn,
    valid,
    message: check.message,
  };
}

/**
 * Run all validation checks for a field
 */
export function runValidation(
  config: ValidationConfig,
  ctx: ValidationContext & { authState?: { isSignedIn: boolean } },
): ValidationResult {
  const checks: ValidationCheckResult[] = [];
  const errors: string[] = [];

  // Check if validation is enabled
  if (config.enabled) {
    const enabled = evaluateLogicExpression(config.enabled, {
      dataModel: ctx.dataModel,
      authState: ctx.authState,
    });
    if (!enabled) {
      return { valid: true, errors: [], checks: [] };
    }
  }

  // Run each check
  if (config.checks) {
    for (const check of config.checks) {
      const result = runValidationCheck(check, ctx);
      checks.push(result);
      if (!result.valid) {
        errors.push(result.message);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    checks,
  };
}

/**
 * Helper to create validation checks
 */
export const check = {
  required: (message = "This field is required"): ValidationCheck => ({
    fn: "required",
    message,
  }),

  email: (message = "Invalid email address"): ValidationCheck => ({
    fn: "email",
    message,
  }),

  minLength: (min: number, message?: string): ValidationCheck => ({
    fn: "minLength",
    args: { min },
    message: message ?? `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationCheck => ({
    fn: "maxLength",
    args: { max },
    message: message ?? `Must be at most ${max} characters`,
  }),

  pattern: (pattern: string, message = "Invalid format"): ValidationCheck => ({
    fn: "pattern",
    args: { pattern },
    message,
  }),

  min: (min: number, message?: string): ValidationCheck => ({
    fn: "min",
    args: { min },
    message: message ?? `Must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationCheck => ({
    fn: "max",
    args: { max },
    message: message ?? `Must be at most ${max}`,
  }),

  url: (message = "Invalid URL"): ValidationCheck => ({
    fn: "url",
    message,
  }),

  matches: (
    otherPath: string,
    message = "Fields must match",
  ): ValidationCheck => ({
    fn: "matches",
    args: { other: { path: otherPath } },
    message,
  }),

  phone: (message = "Invalid phone number"): ValidationCheck => ({
    fn: "phone",
    message,
  }),

  date: (message = "Invalid date"): ValidationCheck => ({
    fn: "date",
    message,
  }),

  isoDate: (message = "Must be ISO date format"): ValidationCheck => ({
    fn: "date",
    args: { format: "iso" },
    message,
  }),

  futureDate: (message = "Must be a future date"): ValidationCheck => ({
    fn: "futureDate",
    message,
  }),

  pastDate: (message = "Must be a past date"): ValidationCheck => ({
    fn: "pastDate",
    message,
  }),

  alphanumeric: (
    message = "Must contain only letters and numbers",
  ): ValidationCheck => ({
    fn: "alphanumeric",
    message,
  }),

  minItems: (min: number, message?: string): ValidationCheck => ({
    fn: "minItems",
    args: { min },
    message: message ?? `Must have at least ${min} items`,
  }),

  maxItems: (max: number, message?: string): ValidationCheck => ({
    fn: "maxItems",
    args: { max },
    message: message ?? `Must have at most ${max} items`,
  }),

  /** Create a conditional check (only runs when condition is true) */
  when: (
    condition: LogicExpression,
    check: ValidationCheck,
  ): ValidationCheck => ({
    ...check,
    when: condition,
  }),
};
