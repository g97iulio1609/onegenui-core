/**
 * Streaming Schemas - Zod schemas for UI element structure
 *
 * Wire Protocol v3 schemas are in protocol.ts.
 * This file contains reusable element/patch schemas.
 */
import { z } from "zod";

// =============================================================================
// Metadata Schema
// =============================================================================

export const UIElementMetaSchema = z.object({
  turnId: z
    .string()
    .optional()
    .describe("Backward-compatible turn identifier"),
  createdTurnId: z
    .string()
    .optional()
    .describe("Unique ID for the AI turn that created this"),
  lastModifiedTurnId: z
    .string()
    .optional()
    .describe("Unique ID for the AI turn that last modified this"),
  sequence: z
    .number()
    .int()
    .nonnegative()
    .describe("Sequence number within turn"),
  createdAt: z.number().describe("Unix timestamp of creation"),
  updatedAt: z.number().optional().describe("Unix timestamp of last update"),
});

// =============================================================================
// Patch Schema (JSON Patch RFC 6902)
// =============================================================================

export const StreamPatchSchema = z.object({
  op: z.enum(["add", "replace", "remove", "move", "copy", "test"]),
  path: z.string().regex(/^\//, "Path must start with /"),
  value: z.unknown().optional(),
  from: z.string().optional(),
});

// =============================================================================
// UI Element Schema (Strict version)
// =============================================================================

// Define the base schema without recursion first
const UIElementBaseSchema = z.object({
  key: z.string().describe("Unique element key (REQUIRED)"),
  type: z.string().describe("Component type from catalog (REQUIRED)"),
  props: z
    .record(z.string(), z.unknown())
    .describe("Component props (REQUIRED)"),
  parentKey: z.string().optional(),
  layout: z
    .object({
      grid: z
        .object({
          column: z.number().optional(),
          row: z.number().optional(),
          columnSpan: z.number().optional(),
          rowSpan: z.number().optional(),
        })
        .optional(),
      size: z
        .object({
          width: z.union([z.number(), z.string()]).optional(),
          height: z.union([z.number(), z.string()]).optional(),
          minWidth: z.union([z.number(), z.string()]).optional(),
          maxWidth: z.union([z.number(), z.string()]).optional(),
          minHeight: z.union([z.number(), z.string()]).optional(),
          maxHeight: z.union([z.number(), z.string()]).optional(),
        })
        .optional(),
      resizable: z.boolean().optional(),
    })
    .optional(),
  visible: z.boolean().optional(),
  locked: z.boolean().optional(),
  _meta: UIElementMetaSchema.optional(),
});

// Type for recursive schema
type UIElementInput = z.input<typeof UIElementBaseSchema> & {
  children?: UIElementInput[];
};

// Export the recursive schema with explicit typing
export const UIElementSchema: z.ZodType<UIElementInput> =
  UIElementBaseSchema.extend({
    children: z.lazy(() => z.array(UIElementSchema)).optional(),
  });
