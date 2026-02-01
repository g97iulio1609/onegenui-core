/**
 * Canvas Component Schemas
 *
 * Defines Canvas and Document components as Generative UI elements.
 * Uses Tiptap (ProseMirror) JSON format exclusively.
 */
import { z } from "zod";

// =============================================================================
// Tiptap Editor Content Schema (ProseMirror JSON format)
// =============================================================================

/** Text mark (inline formatting) */
export const TiptapMarkSchema = z.object({
  type: z.enum(["bold", "italic", "strike", "underline", "code", "link", "highlight"]),
  attrs: z.record(z.string(), z.unknown()).optional(),
});

/** Text node */
export const TiptapTextNodeSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  marks: z.array(TiptapMarkSchema).optional(),
});

/** Hard break */
export const TiptapHardBreakSchema = z.object({
  type: z.literal("hardBreak"),
});

/** Inline content types */
export const TiptapInlineContentSchema = z.discriminatedUnion("type", [
  TiptapTextNodeSchema,
  TiptapHardBreakSchema,
]);

// Generic content array to avoid circular references
const TiptapContentArray = z.array(z.unknown());

/** Paragraph node */
export const TiptapParagraphSchema = z.object({
  type: z.literal("paragraph"),
  attrs: z.object({
    textAlign: z.enum(["left", "center", "right", "justify"]).optional(),
  }).optional(),
  content: z.array(TiptapInlineContentSchema).optional(),
});

/** Heading node */
export const TiptapHeadingSchema = z.object({
  type: z.literal("heading"),
  attrs: z.object({
    level: z.number().min(1).max(6),
    textAlign: z.enum(["left", "center", "right"]).optional(),
  }),
  content: z.array(TiptapInlineContentSchema).optional(),
});

/** Code block node */
export const TiptapCodeBlockSchema = z.object({
  type: z.literal("codeBlock"),
  attrs: z.object({
    language: z.string().optional(),
  }).optional(),
  content: z.array(TiptapTextNodeSchema).optional(),
});

/** List item node */
export const TiptapListItemSchema = z.object({
  type: z.literal("listItem"),
  content: TiptapContentArray.optional(),
});

/** Bullet list node */
export const TiptapBulletListSchema = z.object({
  type: z.literal("bulletList"),
  content: z.array(TiptapListItemSchema),
});

/** Ordered list node */
export const TiptapOrderedListSchema = z.object({
  type: z.literal("orderedList"),
  attrs: z.object({ start: z.number().optional() }).optional(),
  content: z.array(TiptapListItemSchema),
});

/** Table cell */
export const TiptapTableCellSchema = z.object({
  type: z.literal("tableCell"),
  attrs: z.object({
    colspan: z.number().optional(),
    rowspan: z.number().optional(),
    colwidth: z.array(z.number()).optional(),
  }).optional(),
  content: TiptapContentArray.optional(),
});

/** Table header cell */
export const TiptapTableHeaderSchema = z.object({
  type: z.literal("tableHeader"),
  attrs: z.object({
    colspan: z.number().optional(),
    rowspan: z.number().optional(),
  }).optional(),
  content: TiptapContentArray.optional(),
});

/** Table row */
export const TiptapTableRowSchema = z.object({
  type: z.literal("tableRow"),
  content: z.array(z.union([TiptapTableCellSchema, TiptapTableHeaderSchema])),
});

/** Table node */
export const TiptapTableSchema = z.object({
  type: z.literal("table"),
  content: z.array(TiptapTableRowSchema),
});

/** Image node */
export const TiptapImageSchema = z.object({
  type: z.literal("image"),
  attrs: z.object({
    src: z.string(),
    alt: z.string().optional(),
    title: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
});

/** Horizontal rule */
export const TiptapHorizontalRuleSchema = z.object({
  type: z.literal("horizontalRule"),
});

/** Math block (KaTeX) */
export const TiptapMathBlockSchema = z.object({
  type: z.literal("mathBlock"),
  attrs: z.object({ latex: z.string() }),
});

/** Diagram block (Mermaid) */
export const TiptapDiagramSchema = z.object({
  type: z.literal("diagram"),
  attrs: z.object({
    code: z.string(),
    diagramType: z.enum(["flowchart", "sequence", "class", "state", "er", "gantt", "pie"]).optional(),
  }),
});

/** Callout block */
export const TiptapCalloutSchema = z.object({
  type: z.literal("callout"),
  attrs: z.object({
    variant: z.enum(["info", "warning", "error", "success", "note"]),
    title: z.string().optional(),
  }),
  content: TiptapContentArray.optional(),
});

/** Blockquote node */
export const TiptapBlockquoteSchema = z.object({
  type: z.literal("blockquote"),
  content: TiptapContentArray.optional(),
});

/** All block node types */
export const TiptapBlockNodeSchema = z.discriminatedUnion("type", [
  TiptapParagraphSchema,
  TiptapHeadingSchema,
  TiptapCodeBlockSchema,
  TiptapBulletListSchema,
  TiptapOrderedListSchema,
  TiptapTableSchema,
  TiptapImageSchema,
  TiptapHorizontalRuleSchema,
  TiptapMathBlockSchema,
  TiptapDiagramSchema,
  TiptapCalloutSchema,
  TiptapBlockquoteSchema,
]);

/** Complete Tiptap document */
export const TiptapDocumentSchema = z.object({
  type: z.literal("doc"),
  content: z.array(TiptapBlockNodeSchema),
});

export type TiptapDocument = z.infer<typeof TiptapDocumentSchema>;
export type TiptapBlockNode = z.infer<typeof TiptapBlockNodeSchema>;
export type TiptapMark = z.infer<typeof TiptapMarkSchema>;
export type TiptapTextNode = z.infer<typeof TiptapTextNodeSchema>;

// =============================================================================
// Canvas Configuration Schemas
// =============================================================================

export const CanvasModeSchema = z
  .enum(["document", "notes", "code", "presentation", "research", "chat"])
  .describe("Canvas mode determines default AI behavior and formatting");

export const DocumentContextSchema = z.object({
  purpose: z.string().optional().describe("Document purpose (e.g., 'blog post', 'report')"),
  audience: z.string().optional().describe("Target audience"),
  tone: z.enum(["formal", "casual", "technical", "creative"]).optional(),
  language: z.string().default("en").describe("ISO language code"),
});

export const WebSearchSettingsSchema = z.object({
  enabled: z.boolean().default(true).describe("Enable web search for research"),
  maxResults: z.number().int().min(1).max(10).default(5),
  includeSources: z.boolean().default(true).describe("Show source citations"),
});

export const ProactiveSettingsSchema = z.object({
  enabled: z.boolean().default(true).describe("Enable proactive suggestions"),
  frequency: z.enum(["minimal", "moderate", "high"]).default("moderate"),
  autoReview: z.boolean().default(false).describe("Auto-review on completion"),
});

export const CanvasAISettingsSchema = z.object({
  webSearch: WebSearchSettingsSchema.optional(),
  proactive: ProactiveSettingsSchema.optional(),
  liveCollaboration: z.boolean().default(true).describe("AI writes in real-time"),
});

export type CanvasAISettings = z.infer<typeof CanvasAISettingsSchema>;

// =============================================================================
// Canvas Component Schema
// =============================================================================

/** Main Canvas component props */
export const CanvasPropsSchema = z.object({
  // Identity
  documentId: z.string().optional().describe("Unique document identifier"),
  title: z.string().optional().describe("Document title"),

  // Mode & Configuration
  mode: CanvasModeSchema.default("document"),
  context: DocumentContextSchema.optional().describe("Document context settings"),
  aiSettings: CanvasAISettingsSchema.optional().describe("AI behavior settings"),

  // Content - Tiptap document format
  content: z.object({
    type: z.literal("doc"),
    content: z.array(z.unknown()),
  })
    .optional()
    .describe(
      "Tiptap document. Use types: paragraph, heading, codeBlock, table, " +
      "bulletList, orderedList, image, mathBlock, diagram, callout, blockquote"
    ),

  // Markdown content - alternative input format
  markdown: z.string().optional().describe("Markdown content (converted to Tiptap)"),

  // Images to embed
  images: z.array(z.object({
    url: z.string().describe("Image URL"),
    alt: z.string().optional().describe("Alt text"),
    caption: z.string().optional().describe("Caption"),
  })).optional().describe("Images to embed in document"),

  // Display
  width: z.string().default("100%").describe("CSS width"),
  height: z.string().default("400px").describe("CSS min-height"),
  showToolbar: z.boolean().default(true).describe("Show formatting toolbar"),
  showAIPanel: z.boolean().default(true).describe("Show AI quick actions"),

  // Behavior
  readOnly: z.boolean().default(false).describe("Read-only mode"),
  autoSave: z.boolean().default(true).describe("Auto-save changes"),
  placeholder: z.string().default("Start typing... Use '/' for commands"),
  streamingEnabled: z.boolean().default(true).describe("Enable streaming"),
});

export type CanvasProps = z.infer<typeof CanvasPropsSchema>;

/** Canvas component definition for catalog */
export const CanvasDefinition = {
  name: "Canvas" as const,
  props: CanvasPropsSchema,
  description:
    "Rich document editor with AI collaboration. " +
    "IMPORTANT: Use 'content' prop (NOT 'initialContent'). " +
    "Content must be Tiptap format: {type:'doc',content:[...]}. " +
    "Supports: paragraph, heading, codeBlock, table, bulletList, orderedList, " +
    "image, mathBlock, diagram, callout, blockquote.",
  hasChildren: false,
  example: {
    type: "Canvas",
    key: "canvas_1",
    props: {
      title: "Document",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 1 },
            content: [{ type: "text", text: "Hello World" }],
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "Start writing..." }],
          },
        ],
      },
    },
    children: [],
  },
};

// =============================================================================
// Document Component (read-only view)
// =============================================================================

export const DocumentPropsSchema = z.object({
  documentId: z.string().describe("Document identifier"),
  title: z.string().optional(),
  content: z.object({
    type: z.literal("doc"),
    content: z.array(z.unknown()),
  }).optional(),
  markdown: z.string().optional(),
  showToc: z.boolean().default(true).describe("Show table of contents"),
  showMetadata: z.boolean().default(true).describe("Show document metadata"),
});

export type DocumentProps = z.infer<typeof DocumentPropsSchema>;

export const DocumentDefinition = {
  name: "Document" as const,
  props: DocumentPropsSchema,
  description: "Read-only document viewer with table of contents",
  hasChildren: false,
  example: {
    type: "Document",
    key: "doc_1",
    props: {
      documentId: "doc-123",
      title: "Report",
      content: {
        type: "doc",
        content: [],
      },
    },
    children: [],
  },
};
