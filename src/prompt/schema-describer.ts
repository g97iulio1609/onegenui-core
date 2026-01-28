/**
 * Schema description utilities for Zod schemas
 * Extracts human-readable descriptions for AI prompt generation
 */

/**
 * Extract a human-readable description of a Zod schema
 * Uses duck typing to handle different Zod versions
 */
export function describeZodSchema(schema: unknown): string {
  const s = schema as Record<string, unknown>;

  // Handle ZodObject - check for 'shape' property
  if (s && typeof s === "object" && "shape" in s && s.shape) {
    const shape = s.shape as Record<string, unknown>;
    const parts: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      parts.push(`${key}: ${describeZodType(value)}`);
    }

    return `{ ${parts.join(", ")} }`;
  }

  return describeZodType(schema);
}

/**
 * Describe a Zod type in a human-readable way
 * Uses duck typing to be compatible with different Zod versions
 */
export function describeZodType(schema: unknown): string {
  if (!schema || typeof schema !== "object") return "unknown";

  const s = schema as Record<string, unknown>;
  const typeName = s._def
    ? (s._def as Record<string, unknown>).typeName
    : undefined;

  // Handle optional - has innerType in _def
  if (typeName === "ZodOptional" && s._def) {
    const def = s._def as Record<string, unknown>;
    return `${describeZodType(def.innerType)}?`;
  }

  // Handle nullable
  if (typeName === "ZodNullable" && s._def) {
    const def = s._def as Record<string, unknown>;
    return `${describeZodType(def.innerType)} | null`;
  }

  // Handle defaults
  if (typeName === "ZodDefault" && s._def) {
    const def = s._def as Record<string, unknown>;
    return describeZodType(def.innerType);
  }

  // Handle primitives
  if (typeName === "ZodString") return "string";
  if (typeName === "ZodNumber") return "number";
  if (typeName === "ZodBoolean") return "boolean";

  // Handle enums
  if (typeName === "ZodEnum" && s._def) {
    const def = s._def as Record<string, unknown>;
    const values = def.values as string[];
    if (Array.isArray(values)) {
      return values.map((v) => `"${v}"`).join(" | ");
    }
  }

  // Handle literals
  if (typeName === "ZodLiteral" && s._def) {
    const def = s._def as Record<string, unknown>;
    const value = def.value;
    return typeof value === "string" ? `"${value}"` : String(value);
  }

  // Handle unions
  if (typeName === "ZodUnion" && s._def) {
    const def = s._def as Record<string, unknown>;
    const options = def.options as unknown[];
    if (Array.isArray(options)) {
      return options.map(describeZodType).join(" | ");
    }
  }

  // Handle arrays
  if (typeName === "ZodArray" && s._def) {
    const def = s._def as Record<string, unknown>;
    const elementType = describeZodType(def.type);
    return `[${elementType}]`;
  }

  // Handle objects (nested)
  if (typeName === "ZodObject" || ("shape" in s && s.shape)) {
    return describeZodSchema(schema);
  }

  return "unknown";
}
