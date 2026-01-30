/**
 * Canvas Component Schemas
 *
 * Defines Canvas and Document components as Generative UI elements
 * that AI can generate for document editing tasks.
 */
import { z } from "zod";

// =============================================================================
// Canvas Mode Types
// =============================================================================

/** Canvas operating modes - AI selects based on task */
export const CanvasModeSchema = z
  .enum(["document", "report", "code", "spreadsheet", "slides", "research"])
  .describe("Canvas mode optimized for the specific task type");

export type CanvasMode = z.infer<typeof CanvasModeSchema>;

// =============================================================================
// Document Context Settings
// =============================================================================

/** Target audience for the document */
export const TargetAudienceSchema = z
  .enum(["executives", "technical", "general", "academic", "sales", "internal"])
  .describe("Who will read this document - affects language and depth");

/** Document purpose */
export const DocumentPurposeSchema = z
  .enum(["inform", "persuade", "document", "present", "educate", "entertain"])
  .describe("Primary goal of the document");

/** Writing tone */
export const WritingToneSchema = z
  .enum(["professional", "academic", "conversational", "technical", "creative"])
  .describe("Writing style and register");

/** Document context settings - configures AI behavior */
export const DocumentContextSchema = z.object({
  audience: TargetAudienceSchema.optional(),
  purpose: DocumentPurposeSchema.optional(),
  tone: WritingToneSchema.optional(),
  formalityLevel: z
    .number()
    .min(1)
    .max(5)
    .optional()
    .describe("1=Informal, 5=Very Formal"),
  language: z.string().optional().describe("Output language code (e.g., en, it)"),
  technicalLevel: z
    .number()
    .min(1)
    .max(5)
    .optional()
    .describe("1=Simple, 5=Highly Technical"),
});

export type DocumentContext = z.infer<typeof DocumentContextSchema>;

// =============================================================================
// AI Settings
// =============================================================================

/** Web search integration settings */
export const WebSearchSettingsSchema = z.object({
  autoFacts: z.boolean().default(true).describe("Auto-verify facts"),
  autoData: z.boolean().default(true).describe("Auto-update statistics"),
  autoCitations: z.boolean().default(false).describe("Auto-add citations"),
  autoContext: z.boolean().default(true).describe("Auto-enrich context"),
  depth: z
    .enum(["shallow", "standard", "deep"])
    .default("standard")
    .describe("Search depth"),
  sources: z
    .enum(["academic", "news", "general", "all"])
    .default("all")
    .describe("Source filter"),
});

/** Proactive AI settings */
export const ProactiveSettingsSchema = z.object({
  enabled: z.boolean().default(true).describe("Enable proactive suggestions"),
  frequency: z
    .enum(["minimal", "moderate", "high"])
    .default("moderate")
    .describe("Suggestion frequency"),
  autoReview: z
    .boolean()
    .default(false)
    .describe("Auto-review on completion"),
});

/** Complete AI settings for Canvas */
export const CanvasAISettingsSchema = z.object({
  webSearch: WebSearchSettingsSchema.optional(),
  proactive: ProactiveSettingsSchema.optional(),
  liveCollaboration: z
    .boolean()
    .default(true)
    .describe("AI writes in real-time"),
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

  // Content
  initialContent: z
    .unknown()
    .optional()
    .describe("Initial Lexical editor state (serialized)"),

  // Markdown content - easier for AI to generate
  markdown: z
    .string()
    .optional()
    .describe(
      "Markdown content that will be converted to Lexical state. " +
        "Use this instead of initialContent for simpler content generation. " +
        "Supports images with ![alt](url) syntax.",
    ),

  // Images to embed in the document
  images: z
    .array(
      z.object({
        url: z.string().describe("Image URL"),
        alt: z.string().optional().describe("Alt text for accessibility"),
        caption: z.string().optional().describe("Image caption"),
      }),
    )
    .optional()
    .describe(
      "Images to embed in the document. AI can use web images directly.",
    ),

  // Display
  width: z.string().default("100%").describe("CSS width"),
  height: z.string().default("400px").describe("CSS min-height"),
  showToolbar: z.boolean().default(true).describe("Show formatting toolbar"),
  showAIPanel: z.boolean().default(true).describe("Show AI quick actions"),

  // Behavior
  readOnly: z.boolean().default(false).describe("Read-only mode"),
  autoSave: z.boolean().default(true).describe("Auto-save changes"),
  placeholder: z
    .string()
    .default("Start typing... Use '/' for commands")
    .describe("Placeholder text"),
});

export type CanvasProps = z.infer<typeof CanvasPropsSchema>;

/** Canvas component definition for catalog */
export const CanvasDefinition = {
  name: "Canvas" as const,
  props: CanvasPropsSchema,
  description:
    "Rich document editor with AI collaboration. Supports markdown, LaTeX, code, " +
    "tables, and diagrams. AI generates task-specific configurations automatically. " +
    "Use for writing reports, documentation, research, code, and presentations.",
  hasChildren: false,
};

// =============================================================================
// Document Component Schema (Simplified Canvas)
// =============================================================================

/** Document block for displaying content with "Open in Canvas" action */
export const DocumentPropsSchema = z.object({
  title: z.string().describe("Document title"),
  content: z.string().describe("Document content (markdown, html, or text)"),
  format: z
    .enum(["markdown", "html", "text"])
    .default("markdown")
    .describe("Content format"),
  documentId: z.string().optional().describe("ID for opening in Canvas"),
  showOpenInCanvas: z
    .boolean()
    .default(true)
    .describe("Show 'Open in Canvas' button"),
  summary: z.string().optional().describe("Brief summary of the document"),
  wordCount: z.number().optional().describe("Word count for display"),
  lastModified: z.string().optional().describe("ISO date of last modification"),
});

export type DocumentProps = z.infer<typeof DocumentPropsSchema>;

/** Document component definition for catalog */
export const DocumentDefinition = {
  name: "Document" as const,
  props: DocumentPropsSchema,
  description:
    "Displays document content with preview. Click 'Open in Canvas' for full editing. " +
    "Use for showing generated documents, reports, or any text content.",
  hasChildren: false,
};

// =============================================================================
// Canvas Actions
// =============================================================================

/** Canvas-specific actions that AI can trigger */
export const CanvasActionsSchema = {
  "canvas:create": z.object({
    title: z.string().optional(),
    mode: CanvasModeSchema.optional(),
    content: z.string().optional(),
    context: DocumentContextSchema.optional(),
  }),
  "canvas:open": z.object({
    documentId: z.string().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
  }),
  "canvas:edit": z.object({
    documentId: z.string(),
    operation: z.enum(["rewrite", "expand", "condense", "changeTone", "enhance"]),
    selection: z
      .object({
        start: z.number(),
        end: z.number(),
      })
      .optional(),
    params: z.record(z.string(), z.unknown()).optional(),
  }),
  "canvas:export": z.object({
    documentId: z.string(),
    format: z.enum(["markdown", "pdf", "docx", "pptx", "xlsx"]),
  }),
  "canvas:save": z.object({
    documentId: z.string(),
    content: z.unknown(),
  }),
};
