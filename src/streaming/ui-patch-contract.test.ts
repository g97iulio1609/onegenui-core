import { describe, expect, it } from "vitest";
import {
  NormalizedUiPatchSchema,
  StrictUiPatchSchema,
  normalizeUiPatch,
} from "./ui-patch-contract";

describe("StrictUiPatchSchema", () => {
  it("accepts a valid element add patch", () => {
    const parsed = StrictUiPatchSchema.safeParse({
      op: "add",
      path: "/elements/main-stack",
      value: {
        key: "main-stack",
        type: "Stack",
        props: { gap: "lg" },
        children: [],
      },
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects stringified JSON element payloads", () => {
    const parsed = StrictUiPatchSchema.safeParse({
      op: "add",
      path: "/elements/main-stack",
      value:
        '{"key":"main-stack","type":"Stack","props":{"gap":"lg"},"children":[]}',
    });

    expect(parsed.success).toBe(false);
  });

  it("normalizes stringified element payloads into objects", () => {
    const parsed = NormalizedUiPatchSchema.safeParse({
      op: "add",
      path: "/elements/main-stack",
      value:
        '{"key":"main-stack","type":"Stack","props":{"gap":"lg"},"children":[]}',
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(typeof parsed.data.value).toBe("object");
    expect(parsed.data.value).toEqual({
      key: "main-stack",
      type: "Stack",
      props: { gap: "lg" },
      children: [],
    });
  });

  it("normalizes children collection stringified arrays", () => {
    const patch = normalizeUiPatch({
      op: "set",
      path: "/elements/main-stack/children",
      value: '["one","two"]',
    });

    expect(patch.value).toEqual(["one", "two"]);
  });
});
