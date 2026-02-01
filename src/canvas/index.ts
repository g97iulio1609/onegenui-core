export {
  // Main Canvas schemas
  CanvasPropsSchema,
  DocumentPropsSchema,
  CanvasDefinition,
  DocumentDefinition,

  // Tiptap content schemas
  TiptapDocumentSchema,
  TiptapBlockNodeSchema,
  TiptapParagraphSchema,
  TiptapHeadingSchema,
  TiptapCodeBlockSchema,
  TiptapBulletListSchema,
  TiptapOrderedListSchema,
  TiptapTableSchema,
  TiptapTableRowSchema,
  TiptapTableCellSchema,
  TiptapTableHeaderSchema,
  TiptapListItemSchema,
  TiptapImageSchema,
  TiptapHorizontalRuleSchema,
  TiptapMathBlockSchema,
  TiptapDiagramSchema,
  TiptapCalloutSchema,
  TiptapBlockquoteSchema,
  TiptapTextNodeSchema,
  TiptapHardBreakSchema,
  TiptapInlineContentSchema,
  TiptapMarkSchema,

  // Canvas config schemas
  CanvasModeSchema,
  DocumentContextSchema,
  CanvasAISettingsSchema,
  WebSearchSettingsSchema,
  ProactiveSettingsSchema,

  // Types
  type CanvasProps,
  type DocumentProps,
  type CanvasAISettings,
  type TiptapDocument,
  type TiptapBlockNode,
  type TiptapMark,
  type TiptapTextNode,
} from "./schemas";
