export {
  // Main Canvas schemas
  CanvasPropsSchema,
  DocumentPropsSchema,
  CanvasDefinition,
  DocumentDefinition,
  CanvasActionsSchema,

  // Lexical content schemas (complete set)
  LexicalEditorStateSchema,
  LexicalRootNodeSchema,
  LexicalBlockNodeSchema,
  LexicalInlineNodeSchema,
  // Block nodes
  LexicalParagraphNodeSchema,
  LexicalHeadingNodeSchema,
  LexicalQuoteNodeSchema,
  LexicalCodeNodeSchema,
  LexicalListNodeSchema,
  LexicalListItemNodeSchema,
  // Table nodes
  LexicalTableNodeSchema,
  LexicalTableRowNodeSchema,
  LexicalTableCellNodeSchema,
  // Rich media nodes
  LexicalImageNodeSchema,
  LexicalMathNodeSchema,
  LexicalDiagramNodeSchema,
  // Inline nodes
  LexicalTextNodeSchema,
  LexicalLineBreakNodeSchema,
  LexicalLinkNodeSchema,

  // Canvas config schemas
  CanvasModeSchema,
  DocumentContextSchema,
  CanvasAISettingsSchema,
  WebSearchSettingsSchema,
  ProactiveSettingsSchema,
  TargetAudienceSchema,
  DocumentPurposeSchema,
  WritingToneSchema,

  // Types
  type CanvasProps,
  type DocumentProps,
  type CanvasMode,
  type DocumentContext,
  type CanvasAISettings,
  // Lexical types
  type LexicalEditorState,
  type LexicalRootNode,
  type LexicalBlockNode,
  type LexicalInlineNode,
  type LexicalTextNode,
  type LexicalParagraphNode,
  type LexicalHeadingNode,
  type LexicalQuoteNode,
  type LexicalCodeNode,
  type LexicalListNode,
  type LexicalListItemNode,
  type LexicalTableNode,
  type LexicalTableRowNode,
  type LexicalTableCellNode,
  type LexicalImageNode,
  type LexicalMathNode,
  type LexicalDiagramNode,
  type LexicalLinkNode,
} from "./schemas";
