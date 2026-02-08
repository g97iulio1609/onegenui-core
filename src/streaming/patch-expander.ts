/**
 * Patch Expander - Progressive rendering expansion for UI patches
 *
 * Splits large "add element" patches into skeleton + children/array-append patches
 * so the browser can render the skeleton immediately while children stream in.
 *
 * Expanded groups are marked `atomic: true` — they MUST be applied in a single batch
 * to avoid rendering a skeleton without its children.
 */

import type { JsonPatch } from "../types";

const ELEMENT_ROOT_PATH_REGEX = /^\/elements\/([^/]+)$/;

export interface ExpandResult {
  patches: JsonPatch[];
  expanded: boolean;
  /** When true, all patches must be applied atomically (skeleton + children) */
  atomic: boolean;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function escapeJsonPointerSegment(segment: string): string {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}

function expandTopLevelArrayProps(
  elementKey: string,
  props: Record<string, unknown>,
): {
  skeletonProps: Record<string, unknown>;
  arrayPatches: JsonPatch[];
} {
  const skeletonProps: Record<string, unknown> = {};
  const arrayPatches: JsonPatch[] = [];

  for (const [propName, propValue] of Object.entries(props)) {
    if (!Array.isArray(propValue)) {
      skeletonProps[propName] = propValue;
      continue;
    }

    skeletonProps[propName] = [];
    const escapedPropName = escapeJsonPointerSegment(propName);
    for (const item of propValue) {
      arrayPatches.push({
        op: "add",
        path: `/elements/${elementKey}/props/${escapedPropName}/-`,
        value: item,
      });
    }
  }

  return { skeletonProps, arrayPatches };
}

function createChildrenAppendPatches(
  elementKey: string,
  children: unknown[],
): JsonPatch[] {
  return children.map((childKey) => ({
    op: "add" as const,
    path: `/elements/${elementKey}/children/-`,
    value: childKey,
  }));
}

export function expandUiPatchForProgressiveRendering(
  patch: JsonPatch,
): ExpandResult {
  if (patch.op !== "add" && patch.op !== "ensure") {
    return { patches: [patch], expanded: false, atomic: false };
  }

  if (typeof patch.path !== "string") {
    return { patches: [patch], expanded: false, atomic: false };
  }

  const match = patch.path.match(ELEMENT_ROOT_PATH_REGEX);
  if (!match) {
    return { patches: [patch], expanded: false, atomic: false };
  }

  const elementKey = match[1];
  if (!elementKey || !isObject(patch.value)) {
    return { patches: [patch], expanded: false, atomic: false };
  }

  const rawProps = patch.value.props;
  const rawChildren = patch.value.children;

  const hasArrayProps =
    isObject(rawProps) &&
    Object.values(rawProps).some(
      (value) => Array.isArray(value) && value.length > 0,
    );
  const hasChildren = Array.isArray(rawChildren) && rawChildren.length > 0;

  if (!hasArrayProps && !hasChildren) {
    return { patches: [patch], expanded: false, atomic: false };
  }

  const elementValue = patch.value as Record<string, unknown>;
  const progressivePatches: JsonPatch[] = [];

  const skeletonPatch: JsonPatch = {
    ...patch,
    value: { ...elementValue },
  };

  if (isObject(rawProps) && hasArrayProps) {
    const { skeletonProps, arrayPatches } = expandTopLevelArrayProps(
      elementKey,
      rawProps,
    );
    (skeletonPatch.value as Record<string, unknown>).props = skeletonProps;
    progressivePatches.push(...arrayPatches);
  }

  if (hasChildren) {
    (skeletonPatch.value as Record<string, unknown>).children = [];
    progressivePatches.push(...createChildrenAppendPatches(elementKey, rawChildren));
  }

  return {
    patches: [skeletonPatch, ...progressivePatches],
    expanded: true,
    atomic: true,
  };
}
