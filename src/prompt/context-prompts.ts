import type { UITree } from "../types";

/**
 * Info about native browser text selection
 */
export interface TextSelectionForPrompt {
  /** The selected text */
  text: string;
  /** The JSON-UI element key containing the selection */
  elementKey?: string;
  /** The component type */
  elementType?: string;
}

/**
 * Layout info for prompt generation
 */
export interface LayoutInfoForPrompt {
  elementKey: string;
  elementType: string;
  size?: {
    width?: number | string;
    height?: number | string;
  };
  grid?: {
    column?: number;
    row?: number;
    columnSpan?: number;
    rowSpan?: number;
  };
  resizable?: boolean;
}

/**
 * Action type for tracked user actions
 */
export type TrackedActionType =
  | "toggle"
  | "input"
  | "select"
  | "click"
  | "complete"
  | "create"
  | "delete"
  | "update"
  | "submit"
  | "expand"
  | "collapse"
  | "drag"
  | "drop";

/**
 * Tracked action interface for prompt generation
 */
export interface TrackedActionForPrompt {
  type: TrackedActionType;
  elementKey: string;
  elementType: string;
  timestamp: number;
  context?: {
    itemId?: string;
    itemIndex?: number;
    itemLabel?: string;
    previousValue?: unknown;
    newValue?: unknown;
  };
}

/**
 * Generate context-aware prompt additions for tree state
 */
export function generateTreeContextPrompt(
  tree: unknown,
  options?: { isPruned?: boolean; totalElements?: number },
): string {
  const prunedNote = options?.isPruned
    ? `\nNOTE: This is a PRUNED tree showing only elements relevant to current context.
Total elements in full tree: ${options.totalElements ?? "unknown"}
Only the shown elements can be modified. To access other elements, the user must select them first.`
    : "";

  return `
CURRENT UI STATE (JSON TREE):
${JSON.stringify(tree, null, 2)}${prunedNote}

IMPORTANT:
1. DO NOT create a new root container if one already exists. Reuse the existing root.
2. DO NOT wrap the existing content in a new Card/Stack/Grid. Just add new elements to the existing root's children.
3. Reuse existing keys for elements that shouldn't change.
4. To ADD an element:
   - Output {"op":"add", "path":"/elements/NEW_KEY", "value":{...}}
   - Output {"op":"ensure", "path":"/elements/PARENT_KEY", "value":{parent element}} (CRITICAL: ensures parent exists!)
   - Output {"op":"add", "path":"/elements/PARENT_KEY/children/-", "value":"NEW_KEY"}
5. To REMOVE an element:
   - Output {"op":"remove", "path":"/elements/KEY_TO_REMOVE"}
   - Output {"op":"remove", "path":"/elements/PARENT_KEY/children/INDEX_OF_KEY"}
6. To UPDATE an element:
   - Output {"op":"replace", "path":"/elements/KEY/props/PROPERTY", "value":"NEW_VALUE"}
7. To UPDATE LAYOUT (size, grid position):
   - Output {"op":"replace", "path":"/elements/KEY/layout/size/width", "value":300}
   - Output {"op":"replace", "path":"/elements/KEY/layout/grid/columnSpan", "value":2}
   - Output {"op":"replace", "path":"/elements/KEY/layout/resizable", "value":true}

CRITICAL: ALWAYS use {"op":"ensure"} BEFORE adding to a parent's children. This prevents errors if parent doesn't exist.
DO NOT re-output the entire tree unless requested to reset/clear. Work incrementally.`;
}

/**
 * Generate context-aware prompt additions for selection
 */
export function generateSelectionContextPrompt(
  selection: { key: string; subItems?: string[] },
  hasSubItems: boolean,
): string {
  let prompt = `
SELECTED ELEMENT CONTEXT:
${JSON.stringify(selection, null, 2)}

EDITING RULES:`;

  if (hasSubItems) {
    prompt += `
The user has selected specific items within this component.
Selected item IDs: ${JSON.stringify(selection.subItems)}

Focus your response on these selected items:
- Use "replace" operations to update their properties
- Find each item's index by matching its "id" in the element's data array
- Example: {"op":"replace","path":"/elements/${selection.key}/props/items/INDEX/description","value":"Updated content"}`;
  } else {
    prompt += `
- Apply the smallest possible patch that satisfies the user request.
- Prefer updates inside the selected element's props or its list data.
- You may modify the selected element's children if needed.
- Only edit parent/layout elements if the change explicitly requires it.`;
  }

  return prompt;
}

/**
 * Generate deep selection context prompt
 */
export function generateDeepSelectionPrompt(
  deepSelections: Array<{
    textContent: string;
    itemId?: string;
    selectionType: string;
    elementKey?: string;
  }>,
): string {
  const selectionSummary = deepSelections
    .map((s) => {
      const preview =
        s.textContent.length > 60
          ? s.textContent.substring(0, 60) + "..."
          : s.textContent;
      return `- "${preview}" (${s.selectionType}, itemId: ${s.itemId || "none"}, element: ${s.elementKey || "unknown"})`;
    })
    .join("\n");

  return `
CRITICAL: USER HAS SELECTED SPECIFIC ELEMENTS
The user explicitly selected these ${deepSelections.length} item(s):
${selectionSummary}

FULL SELECTION DATA:
${JSON.stringify(deepSelections, null, 2)}

STRICT RULES FOR SELECTED ELEMENTS:
1. ONLY modify the items that the user selected - DO NOT touch any other items
2. If user asks to "expand" or "elaborate", ONLY expand the selected items
3. If user asks to "change" something, ONLY change the selected items
4. Find each selected item by matching its itemId or textContent in the component's data
5. Use "replace" operations targeting the specific array index of each selected item
6. Other items in the same component must remain EXACTLY as they are
7. You may modify the LAYOUT (size, position) of selected elements if relevant to the request`;
}

/**
 * Generate prompt section for native text selection
 */
export function generateTextSelectionPrompt(
  textSelection: TextSelectionForPrompt,
): string {
  const componentInfo = textSelection.elementKey
    ? `\nThis text is from component: ${textSelection.elementKey}${textSelection.elementType ? ` (${textSelection.elementType})` : ""}`
    : "";

  return `
USER HAS HIGHLIGHTED/SELECTED TEXT:
"${textSelection.text}"${componentInfo}

The user has explicitly selected this text. Their message likely refers to it.
Possible intents:
- Ask questions about this specific text
- Request modifications or expansion of this content
- Use it as context for their question
- Quote it in a new component

Consider this selected text as the PRIMARY FOCUS of the user's request.`;
}

/**
 * Generate prompt section for layout-aware operations
 */
export function generateLayoutContextPrompt(
  layouts: LayoutInfoForPrompt[],
): string {
  if (layouts.length === 0) return "";

  const layoutSummary = layouts
    .map((l) => {
      const parts = [`- ${l.elementKey} (${l.elementType})`];
      if (l.size?.width || l.size?.height) {
        parts.push(
          `size: ${l.size.width ?? "auto"} x ${l.size.height ?? "auto"}`,
        );
      }
      if (l.grid?.column || l.grid?.row) {
        parts.push(
          `grid: col ${l.grid.column ?? "auto"}, row ${l.grid.row ?? "auto"}`,
        );
      }
      if (l.grid?.columnSpan && l.grid.columnSpan > 1) {
        parts.push(`span: ${l.grid.columnSpan} cols`);
      }
      if (l.resizable) {
        parts.push("(resizable)");
      }
      return parts.join(" | ");
    })
    .join("\n");

  return `
LAYOUT CONTEXT:
The following elements have explicit layout configurations:
${layoutSummary}

LAYOUT OPERATIONS:
- To RESIZE an element:
  {"op":"replace","path":"/elements/KEY/layout/size","value":{"width":400,"height":300}}
- To REPOSITION in grid:
  {"op":"replace","path":"/elements/KEY/layout/grid","value":{"column":1,"columnSpan":6}}
- To ENABLE resize handles:
  {"op":"replace","path":"/elements/KEY/layout/resizable","value":true}
- To SET full layout at once:
  {"op":"replace","path":"/elements/KEY/layout","value":{"size":{"width":500},"grid":{"columnSpan":4},"resizable":true}}

When the user mentions size, width, height, position, columns, or layout, use these operations.`;
}

/**
 * Generate context-aware prompt for recent user actions (proactivity)
 */
export function generateActionsContextPrompt(
  actions: TrackedActionForPrompt[],
): string {
  if (actions.length === 0) return "";

  const formatted = actions.map((action) => {
    const parts = [`- ${action.type} on ${action.elementType}`];

    if (action.context?.itemLabel) {
      parts.push(`"${action.context.itemLabel}"`);
    }

    if (
      action.context?.previousValue !== undefined &&
      action.context?.newValue !== undefined
    ) {
      parts.push(
        `(${action.context.previousValue} -> ${action.context.newValue})`,
      );
    }

    return parts.join(" ");
  });

  const lastAction = actions[actions.length - 1];
  if (!lastAction) return "";

  return `
RECENT USER ACTIONS:
${formatted.join("\n")}

LAST ACTION DETAILS:
${JSON.stringify(lastAction, null, 2)}

PROACTIVE INSTRUCTION:
The user just performed the action above. Analyze:
1. The ELEMENT TYPE (${lastAction.elementType}) - what kind of component is this?
2. The ACTION TYPE (${lastAction.type}) - what did the user do?
3. The CONTEXT - any item labels, values, or indices involved?

Based on this analysis, provide a contextual, helpful follow-up that:
- Is relevant to the component type and its purpose
- Acknowledges the specific action taken
- Offers useful next steps or asks for relevant information
- Does NOT assume domain-specific knowledge (e.g., don't assume workout if it's a TodoList)

Your response should feel natural and helpful, adapting to whatever domain the component represents.`;
}
