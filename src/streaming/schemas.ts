/**
 * Streaming Schemas - Zod schemas for structured streaming output
 */
import { z } from "zod";

// =============================================================================
// Metadata Schema
// =============================================================================

export const UIElementMetaSchema = z.object({
  turnId: z.string().describe("Unique ID for the AI turn that created this"),
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
// Message Type Schemas (Discriminated Union)
// =============================================================================

export const PatchMessageSchema = z.object({
  type: z.literal("patch"),
  patches: z.array(StreamPatchSchema),
  targetPath: z.string().optional(),
});

export const ChatMessageSchema = z.object({
  type: z.literal("message"),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  id: z.string().optional(),
});

export const QuestionMessageSchema = z.object({
  type: z.literal("question"),
  questionId: z.string(),
  prompt: z.string(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  inputType: z
    .enum(["text", "select", "multiselect", "number", "date"])
    .optional(),
  required: z.boolean().optional(),
});

export const SuggestionMessageSchema = z.object({
  type: z.literal("suggestion"),
  suggestions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      action: z.string().optional(),
    }),
  ),
});

export const ToolProgressMessageSchema = z.object({
  type: z.literal("tool-progress"),
  toolId: z.string(),
  toolName: z.string(),
  status: z.enum(["pending", "running", "complete", "error"]),
  progress: z.number().min(0).max(100).optional(),
  message: z.string().optional(),
  result: z.unknown().optional(),
});

export const StreamControlSchema = z.object({
  type: z.literal("control"),
  action: z.enum(["start", "end", "error", "abort"]),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      recoverable: z.boolean(),
    })
    .optional(),
});

// =============================================================================
// Stream Message (Discriminated Union)
// =============================================================================

export const StreamMessageSchema = z.discriminatedUnion("type", [
  PatchMessageSchema,
  ChatMessageSchema,
  QuestionMessageSchema,
  SuggestionMessageSchema,
  ToolProgressMessageSchema,
  StreamControlSchema,
]);

// =============================================================================
// Stream Frame (Top-level envelope)
// =============================================================================

export const StreamFrameSchema = z.object({
  version: z.literal("2.0").describe("Protocol version"),
  timestamp: z.number().describe("Unix timestamp"),
  correlationId: z.string().uuid().describe("Request correlation ID"),
  sequence: z.number().int().nonnegative().describe("Frame sequence number"),
  message: StreamMessageSchema,
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
