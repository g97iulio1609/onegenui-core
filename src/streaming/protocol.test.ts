import { describe, expect, it } from "vitest";
import { WireFrameSchema, createWireFrame } from "./protocol";

describe("stream wire protocol", () => {
  it("creates a valid frame envelope", () => {
    const frame = createWireFrame({
      correlationId: "corr-1",
      sequence: 0,
      event: { kind: "control", action: "start", data: { mode: "DIRECT" } },
      timestamp: 1234,
    });

    const parsed = WireFrameSchema.safeParse(frame);
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.version).toBe("3.0");
    expect(parsed.success && parsed.data.sequence).toBe(0);
  });

  it("rejects invalid frame payloads", () => {
    const parsed = WireFrameSchema.safeParse({
      version: "3.0",
      correlationId: "",
      sequence: -1,
      timestamp: Date.now(),
      event: { kind: "control", action: "start" },
    });

    expect(parsed.success).toBe(false);
  });
});

