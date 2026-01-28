/**
 * Rules generators for AI prompt sections
 * Single Responsibility: Each function generates one specific rule section
 */

/**
 * Generate the streaming strategy section
 */
export function generateStreamingStrategy(): string {
  return `
STREAMING STRATEGY:
1. Create containers (Stack, Grid, Card) with children:[] EMPTY
2. Add each child element as a separate operation
3. Append child key to parent via: {"op":"add","path":"/elements/PARENT/children/-","value":"CHILD_KEY"}
4. For data props (items, rows, documents), use "replace" to set full content after element creation
5. Prefer multiple small patches for responsive UI updates
6. Use short, descriptive keys (e.g., "revenue-metric", "user-table")

NEVER DO THIS (pre-populated children):
{"op":"add","path":"/elements/grid","value":{"key":"grid","type":"Grid","children":["a","b","c"]}}

ALWAYS DO THIS (empty children, then append):
{"op":"add","path":"/elements/grid","value":{"key":"grid","type":"Grid","children":[]}}
{"op":"add","path":"/elements/a","value":{...}}
{"op":"add","path":"/elements/grid/children/-","value":"a"}`;
}

/**
 * Generate layout rules section
 */
export function generateLayoutRules(): string {
  return `
LAYOUT RULES:
- ALWAYS use Stack or Grid as root container when generating multiple components
- Stack: Set gap prop for vertical spacing (e.g., "gap": "lg" or "gap": "md")
- Grid: Set gap prop for both row/column spacing
- Available gap values: "none", "xs", "sm", "md", "lg", "xl", "2xl"
- RECOMMENDED: Use "gap": "lg" for main layouts, "gap": "md" for nested content
- Single components may omit container, but prefer Card wrapper for visual consistency`;
}

/**
 * Generate the message rules section
 */
export function generateMessageRules(): string {
  return `
MESSAGE RULES:
- ALWAYS begin your response with a 'message' operation to explain what you are building.
- Use 'message' operations to provide context, ask for feedback, or explain design decisions.
- Do NOT treat messages and UI patches as mutually exclusive; use BOTH.
- Example:
  {"op":"message","role":"assistant","content":"I'm creating a dashboard with charts and metrics."}
  {"op":"set","path":"/root","value":"dashboard"}

MESSAGE CONTENT RULES:
- Messages should be CONVERSATIONAL and HELPFUL
- Messages provide context, reasoning, and high-level summaries
- NEVER include URLs, links, or deep links in messages - put them in component props instead
- NEVER include raw JSON, JSONL operations, or technical code in messages
- NEVER include markdown tables or data dumps - use UI components to display structured data
- NEVER echo back the JSONL patches as text - the user sees the rendered components
- If a component has a prop for links (e.g., bookingUrl, href, url), use THAT prop, not the message`;
}

/**
 * Generate the selection context rules section
 */
export function generateSelectionRules(): string {
  return `
SELECTION CONTEXT BEHAVIOR:

When SELECTED ELEMENT CONTEXT is present in the prompt, you must reason about what the user wants.

REASONING PROCESS:
1. Read the user's request carefully - understand the semantic meaning
2. Examine the selected element - its type, current content, structure, purpose
3. Think: "What would best serve the user given this element and this request?"
4. Decide your approach based on your reasoning

You have FULL AUTONOMY to:
- MODIFY the selected element (change props, update content, fix issues)
- ADD new content (siblings, children, or related components)  
- DO BOTH if the request naturally calls for it

There are NO rigid keyword rules. Each situation is unique. Use your understanding of:
- What the element currently contains
- What the user is trying to achieve  
- What would create the best user experience`;
}

/**
 * Generate the base JSONL output format rules
 */
export function generateOutputFormat(): string {
  return `
OUTPUT FORMAT:
Output JSONL where each line is a patch operation. Use a FLAT key-based structure:

OPERATIONS:
- {"op":"set","path":"/root","value":"main-stack"} - Set the root element key
- {"op":"add","path":"/elements/main-stack","value":{...}} - Add an element by unique key
- {"op":"add","path":"/elements/parent/children/-","value":"child-key"} - Append child to parent
- {"op":"replace","path":"/elements/key/props/data","value":[...]} - Update element data
- {"op":"message","role":"assistant","content":"..."} - Send a conversational message

ELEMENT STRUCTURE:
{
  "key": "unique-key",
  "type": "ComponentType",
  "props": { ... },
  "children": []  // Start empty, add children via /children/- operations
}

CRITICAL STREAMING ORDER:
1. FIRST: {"op":"message"} - Explain what you're building
2. SECOND: {"op":"set","path":"/root","value":"root-key"}
3. THIRD: {"op":"add","path":"/elements/root-key","value":{...with empty children}}
4. THEN: Add child elements and append to parent's children array

CORRECT EXAMPLE - Creating Grid with 3 Metrics:
{"op":"message","role":"assistant","content":"Creating your financial dashboard..."}
{"op":"set","path":"/root","value":"main-stack"}
{"op":"add","path":"/elements/main-stack","value":{"key":"main-stack","type":"Stack","props":{"gap":"lg"},"children":[]}}
{"op":"add","path":"/elements/metrics-grid","value":{"key":"metrics-grid","type":"Grid","props":{"columns":3,"gap":"md"},"children":[]}}
{"op":"add","path":"/elements/main-stack/children/-","value":"metrics-grid"}
{"op":"add","path":"/elements/metric-1","value":{"key":"metric-1","type":"Metric","props":{"label":"Revenue","value":50000,"format":"currency"}}}
{"op":"add","path":"/elements/metrics-grid/children/-","value":"metric-1"}
{"op":"add","path":"/elements/metric-2","value":{"key":"metric-2","type":"Metric","props":{"label":"Users","value":1200}}}
{"op":"add","path":"/elements/metrics-grid/children/-","value":"metric-2"}
{"op":"add","path":"/elements/metric-3","value":{"key":"metric-3","type":"Metric","props":{"label":"Growth","value":0.15,"format":"percent","trend":"up"}}}
{"op":"add","path":"/elements/metrics-grid/children/-","value":"metric-3"}

RULES:
1. ALWAYS start children:[] empty, then append via /children/-
2. NEVER pre-populate children array with keys in the initial add
3. Add element BEFORE appending it to parent's children
4. Each element must have: key, type, props (children optional)
5. Do NOT wrap output in markdown code fences
6. Output ONLY JSONL lines (one JSON object per line)

RICH CONTENT PATTERN (for Document, Table, etc.):
Stream structure first, then populate with full content:
{"op":"add","path":"/elements/doc","value":{"key":"doc","type":"Document","props":{"title":"Report"},"children":[]}}
{"op":"add","path":"/elements/main-stack/children/-","value":"doc"}
{"op":"replace","path":"/elements/doc/props/documents","value":[{"title":"Section","sections":[{"title":"Details","content":"Full detailed content here with multiple paragraphs..."}]}]}

NEVER create empty Documents/Tables - ALWAYS populate content immediately after creation.`;
}
