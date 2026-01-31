/**
 * Canvas Component Schemas
 *
 * Defines Canvas and Document components as Generative UI elements
 * that AI can generate for document editing tasks.
 * 
 * SCHEMA DESIGN PRINCIPLES:
 * - Every node MUST have a required `type` field
 * - `children` arrays are required (not optional/default)
 * - Only truly optional fields have `.optional()`
 * - No `.default()` on arrays to force AI to provide content
 */
import { z } from "zod";

// =============================================================================
// Lexical Editor Content Schema
// =============================================================================

/**
 * Text formatting bitmask values (can be combined):
 * - 1 = bold
 * - 2 = italic
 * - 4 = strikethrough
 * - 8 = underline
 * - 16 = code
 * - 32 = subscript
 * - 64 = superscript
 * Example: bold + italic = 3
 */
const TextFormatSchema = z
  .number()
  .int()
  .min(0)
  .max(127)
  .describe("Text format bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code");

const BlockDirectionSchema = z.enum(["ltr", "rtl"]);
const BlockAlignmentSchema = z.enum(["left", "center", "right", "justify", "start", "end"]);

// -----------------------------------------------------------------------------
// Inline (Leaf) Nodes - Must be inside block nodes
// -----------------------------------------------------------------------------

/** 
 * Text node - the fundamental leaf node for all text content.
 * REQUIRED: type, text
 */
export const LexicalTextNodeSchema = z.object({
  type: z.literal("text").describe("REQUIRED: Must be 'text'"),
  text: z.string().describe("REQUIRED: The actual text content"),
  format: TextFormatSchema.optional().describe("Text formatting bitmask"),
  style: z.string().optional().describe("CSS inline styles"),
});

/** Line break node */
export const LexicalLineBreakNodeSchema = z.object({
  type: z.literal("linebreak").describe("REQUIRED: Must be 'linebreak'"),
});

/** 
 * Link node - hyperlink with text children.
 * REQUIRED: type, url, children
 */
export const LexicalLinkNodeSchema = z.object({
  type: z.literal("link").describe("REQUIRED: Must be 'link'"),
  url: z.string().url().describe("REQUIRED: Link URL"),
  target: z.enum(["_blank", "_self"]).optional(),
  children: z.array(z.lazy(() => LexicalTextNodeSchema))
    .min(1)
    .describe("REQUIRED: Link text (array of text nodes)"),
});

/** All inline content types that can appear inside blocks */
export const LexicalInlineNodeSchema = z.discriminatedUnion("type", [
  LexicalTextNodeSchema,
  LexicalLineBreakNodeSchema,
  LexicalLinkNodeSchema,
]);

// -----------------------------------------------------------------------------
// Block-Level Nodes - Must be inside root
// -----------------------------------------------------------------------------

/** 
 * Paragraph node - standard text block.
 * REQUIRED: type, children
 */
export const LexicalParagraphNodeSchema = z.object({
  type: z.literal("paragraph").describe("REQUIRED: Must be 'paragraph'"),
  children: z.array(LexicalInlineNodeSchema)
    .min(1)
    .describe("REQUIRED: Inline content (at least one text node)"),
  direction: BlockDirectionSchema.optional(),
  format: BlockAlignmentSchema.optional(),
  indent: z.number().int().min(0).max(10).optional(),
});

/** 
 * Heading node - h1-h6 headers.
 * REQUIRED: type, tag, children
 */
export const LexicalHeadingNodeSchema = z.object({
  type: z.literal("heading").describe("REQUIRED: Must be 'heading'"),
  tag: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).describe("REQUIRED: Heading level"),
  children: z.array(LexicalInlineNodeSchema)
    .min(1)
    .describe("REQUIRED: Heading text (at least one text node)"),
  direction: BlockDirectionSchema.optional(),
  format: BlockAlignmentSchema.optional(),
});

/** 
 * Quote/blockquote node.
 * REQUIRED: type, children
 */
export const LexicalQuoteNodeSchema = z.object({
  type: z.literal("quote").describe("REQUIRED: Must be 'quote'"),
  children: z.array(LexicalInlineNodeSchema)
    .min(1)
    .describe("REQUIRED: Quote text"),
  direction: BlockDirectionSchema.optional(),
});

/** 
 * Code block node with optional language.
 * REQUIRED: type, children
 */
export const LexicalCodeNodeSchema = z.object({
  type: z.literal("code").describe("REQUIRED: Must be 'code'"),
  language: z.string().optional().describe("Programming language (javascript, python, typescript, etc.)"),
  children: z.array(LexicalTextNodeSchema)
    .min(1)
    .describe("REQUIRED: Code content (text nodes only)"),
});

/** 
 * List item node.
 * REQUIRED: type, value, children
 */
export const LexicalListItemNodeSchema = z.object({
  type: z.literal("listitem").describe("REQUIRED: Must be 'listitem'"),
  value: z.number().int().min(1).describe("REQUIRED: List item number (1-based)"),
  checked: z.boolean().optional().describe("For checklist items only"),
  children: z.array(LexicalInlineNodeSchema)
    .min(1)
    .describe("REQUIRED: Item content (at least one text node)"),
});

/** 
 * List node (bullet, numbered, or checklist).
 * REQUIRED: type, listType, children
 */
export const LexicalListNodeSchema = z.object({
  type: z.literal("list").describe("REQUIRED: Must be 'list'"),
  listType: z.enum(["bullet", "number", "check"]).describe("REQUIRED: List style"),
  start: z.number().int().min(1).optional().describe("Starting number for numbered lists"),
  children: z.array(LexicalListItemNodeSchema)
    .min(1)
    .describe("REQUIRED: List items (at least one)"),
});

// -----------------------------------------------------------------------------
// Table Nodes
// -----------------------------------------------------------------------------

/** 
 * Table cell node - contains paragraphs.
 * REQUIRED: type, children
 */
export const LexicalTableCellNodeSchema = z.object({
  type: z.literal("tablecell").describe("REQUIRED: Must be 'tablecell'"),
  headerState: z.number().int().min(0).max(3).optional()
    .describe("0=normal, 1=row header, 2=col header, 3=both"),
  colSpan: z.number().int().min(1).optional(),
  rowSpan: z.number().int().min(1).optional(),
  children: z.array(z.lazy(() => LexicalParagraphNodeSchema))
    .min(1)
    .describe("REQUIRED: Cell content (paragraphs)"),
});

/** 
 * Table row node - contains cells.
 * REQUIRED: type, children
 */
export const LexicalTableRowNodeSchema = z.object({
  type: z.literal("tablerow").describe("REQUIRED: Must be 'tablerow'"),
  children: z.array(LexicalTableCellNodeSchema)
    .min(1)
    .describe("REQUIRED: Row cells (at least one)"),
});

/** 
 * Table node - contains rows.
 * REQUIRED: type, children
 */
export const LexicalTableNodeSchema = z.object({
  type: z.literal("table").describe("REQUIRED: Must be 'table'"),
  children: z.array(LexicalTableRowNodeSchema)
    .min(1)
    .describe("REQUIRED: Table rows (at least one)"),
});

// -----------------------------------------------------------------------------
// Rich Media Nodes
// -----------------------------------------------------------------------------

/** 
 * Image node.
 * REQUIRED: type, src
 */
export const LexicalImageNodeSchema = z.object({
  type: z.literal("image").describe("REQUIRED: Must be 'image'"),
  src: z.string().describe("REQUIRED: Image source URL"),
  alt: z.string().optional().describe("Alt text for accessibility"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  caption: z.string().optional(),
});

/** 
 * Math (LaTeX) node.
 * REQUIRED: type, equation
 */
export const LexicalMathNodeSchema = z.object({
  type: z.literal("math").describe("REQUIRED: Must be 'math'"),
  equation: z.string().min(1).describe("REQUIRED: LaTeX equation"),
  inline: z.boolean().optional().describe("Inline vs block display"),
});

/** 
 * Diagram node (Mermaid, PlantUML, etc.).
 * REQUIRED: type, code
 */
export const LexicalDiagramNodeSchema = z.object({
  type: z.literal("diagram").describe("REQUIRED: Must be 'diagram'"),
  diagramType: z.enum(["mermaid", "plantuml", "graphviz"]).optional(),
  code: z.string().min(1).describe("REQUIRED: Diagram source code"),
});

// -----------------------------------------------------------------------------
// Union of All Block Nodes
// -----------------------------------------------------------------------------

/** All block-level content types that can appear in root.children */
export const LexicalBlockNodeSchema = z.discriminatedUnion("type", [
  LexicalParagraphNodeSchema,
  LexicalHeadingNodeSchema,
  LexicalQuoteNodeSchema,
  LexicalCodeNodeSchema,
  LexicalListNodeSchema,
  LexicalTableNodeSchema,
  LexicalImageNodeSchema,
  LexicalMathNodeSchema,
  LexicalDiagramNodeSchema,
]);

// -----------------------------------------------------------------------------
// Root Node & Complete State
// -----------------------------------------------------------------------------

/** 
 * Root node - the top-level container for all document content.
 * REQUIRED: type, children
 */
export const LexicalRootNodeSchema = z.object({
  type: z.literal("root").describe("REQUIRED: Must be 'root'"),
  children: z.array(LexicalBlockNodeSchema)
    .min(1)
    .describe("REQUIRED: Block-level content (at least one block)"),
  direction: BlockDirectionSchema.optional(),
});

/**
 * Complete Lexical editor state schema.
 * 
 * This is the ONLY valid structure for Canvas initialContent.
 * - Every node MUST have a "type" field
 * - Every children array MUST have at least one element
 * - Block nodes go in root.children
 * - Inline nodes (text, link) go inside block nodes' children
 */
export const LexicalEditorStateSchema = z.object({
  root: LexicalRootNodeSchema.describe("REQUIRED: The root node"),
}).strict().describe("Lexical editor serialized state - structured output only");

// -----------------------------------------------------------------------------
// Type Exports
// -----------------------------------------------------------------------------

export type LexicalEditorState = z.infer<typeof LexicalEditorStateSchema>;
export type LexicalRootNode = z.infer<typeof LexicalRootNodeSchema>;
export type LexicalBlockNode = z.infer<typeof LexicalBlockNodeSchema>;
export type LexicalInlineNode = z.infer<typeof LexicalInlineNodeSchema>;
export type LexicalTextNode = z.infer<typeof LexicalTextNodeSchema>;
export type LexicalParagraphNode = z.infer<typeof LexicalParagraphNodeSchema>;
export type LexicalHeadingNode = z.infer<typeof LexicalHeadingNodeSchema>;
export type LexicalQuoteNode = z.infer<typeof LexicalQuoteNodeSchema>;
export type LexicalCodeNode = z.infer<typeof LexicalCodeNodeSchema>;
export type LexicalListNode = z.infer<typeof LexicalListNodeSchema>;
export type LexicalListItemNode = z.infer<typeof LexicalListItemNodeSchema>;
export type LexicalTableNode = z.infer<typeof LexicalTableNodeSchema>;
export type LexicalTableRowNode = z.infer<typeof LexicalTableRowNodeSchema>;
export type LexicalTableCellNode = z.infer<typeof LexicalTableCellNodeSchema>;
export type LexicalImageNode = z.infer<typeof LexicalImageNodeSchema>;
export type LexicalMathNode = z.infer<typeof LexicalMathNodeSchema>;
export type LexicalDiagramNode = z.infer<typeof LexicalDiagramNodeSchema>;
export type LexicalLinkNode = z.infer<typeof LexicalLinkNodeSchema>;

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

  // Content - use Lexical schema for validation
  initialContent: LexicalEditorStateSchema
    .optional()
    .describe(
      "Initial Lexical editor state. EVERY node MUST have a 'type' field. " +
      "Use types: root, paragraph, heading, text, list, listitem, code, quote, linebreak"
    ),

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
