/**
 * Stream Validation Pipeline
 *
 * Validates incoming Wire Protocol v3 frames and provides error recovery.
 */
import {
  WireFrameSchema,
  WireEventSchema,
} from "./protocol";
import type { WireFrame } from "./protocol";
import {
  StreamPatchSchema,
  UIElementSchema,
} from "./schemas";
import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from "./types";

// =============================================================================
// Validation Pipeline
// =============================================================================

export class StreamValidationPipeline {
  private componentTypes: Set<string>;

  constructor(registeredComponents?: string[]) {
    this.componentTypes = new Set(registeredComponents ?? []);
  }

  /**
   * Register component types for validation
   */
  registerComponentTypes(types: string[]): void {
    types.forEach((t) => this.componentTypes.add(t));
  }

  /**
   * Validate a complete stream frame
   */
  validateFrame(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const result = WireFrameSchema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        });
      }
      return { valid: false, errors, warnings };
    }

    // Additional semantic validation
    const frame = result.data;

    // Validate sequence is non-negative
    if (frame.sequence < 0) {
      errors.push({
        path: "sequence",
        code: "INVALID_SEQUENCE",
        message: "Sequence must be non-negative",
      });
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate a stream message
   */
  validateMessage(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const result = WireEventSchema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        });
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate a single patch operation
   */
  validatePatch(patch: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const result = StreamPatchSchema.safeParse(patch);

    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        });
      }
      return { valid: false, errors, warnings };
    }

    const p = result.data;

    // Validate path format
    if (!p.path.startsWith("/")) {
      errors.push({
        path: "path",
        code: "INVALID_PATH",
        message: "Path must start with /",
      });
    }

    // Validate value for add/replace
    if ((p.op === "add" || p.op === "replace") && p.value === undefined) {
      errors.push({
        path: "value",
        code: "MISSING_VALUE",
        message: `Value required for ${p.op} operation`,
      });
    }

    // Validate from for move/copy
    if ((p.op === "move" || p.op === "copy") && !p.from) {
      errors.push({
        path: "from",
        code: "MISSING_FROM",
        message: `From path required for ${p.op} operation`,
      });
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Validate a UI element against catalog
   */
  validateElement(element: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const result = UIElementSchema.safeParse(element);

    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        });
      }
      return { valid: false, errors, warnings };
    }

    const el = result.data;

    // Validate component type if catalog is provided
    if (this.componentTypes.size > 0 && !this.componentTypes.has(el.type)) {
      warnings.push({
        path: "type",
        code: "UNKNOWN_COMPONENT",
        message: `Unknown component type: ${el.type}`,
      });
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Parse and validate with auto-fix for recoverable errors
   */
  parseWithRecovery(data: unknown): {
    frame: WireFrame | null;
    validation: ValidationResult;
    recovered: boolean;
  } {
    const validation = this.validateFrame(data);

    if (validation.valid) {
      return {
        frame: data as WireFrame,
        validation,
        recovered: false,
      };
    }

    // Try to recover by fixing common issues
    const fixed = this.tryAutoFix(data);
    if (fixed) {
      const revalidation = this.validateFrame(fixed);
      if (revalidation.valid) {
        revalidation.warnings.push({
          path: "",
          code: "AUTO_FIXED",
          message: "Frame was auto-fixed",
          autoFixed: true,
        });
        return {
          frame: fixed as WireFrame,
          validation: revalidation,
          recovered: true,
        };
      }
    }

    return { frame: null, validation, recovered: false };
  }

  /**
   * Try to auto-fix common issues
   */
  private tryAutoFix(data: unknown): unknown | null {
    if (typeof data !== "object" || data === null) return null;

    const obj = { ...data } as Record<string, unknown>;

    // Fix missing version
    if (!obj.version) {
      obj.version = "3.0";
    }

    // Fix missing timestamp
    if (!obj.timestamp) {
      obj.timestamp = Date.now();
    }

    // Fix missing correlationId
    if (!obj.correlationId) {
      obj.correlationId = crypto.randomUUID();
    }

    // Fix missing sequence
    if (typeof obj.sequence !== "number") {
      obj.sequence = 0;
    }

    return obj;
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createValidationPipeline(
  componentTypes?: string[],
): StreamValidationPipeline {
  return new StreamValidationPipeline(componentTypes);
}
