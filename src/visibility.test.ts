import { describe, it, expect } from "vitest";
import {
  evaluateLogicExpression,
  evaluateVisibility,
  visibility,
} from "./visibility";

describe("evaluateLogicExpression", () => {
  const emptyContext = { dataModel: {} };

  describe("comparison operators", () => {
    it("evaluates eq expression", () => {
      expect(evaluateLogicExpression({ eq: [1, 1] }, emptyContext)).toBe(true);
      expect(evaluateLogicExpression({ eq: [1, 2] }, emptyContext)).toBe(false);
      expect(evaluateLogicExpression({ eq: ["a", "a"] }, emptyContext)).toBe(
        true,
      );
    });

    it("evaluates neq expression", () => {
      expect(evaluateLogicExpression({ neq: [1, 2] }, emptyContext)).toBe(true);
      expect(evaluateLogicExpression({ neq: [1, 1] }, emptyContext)).toBe(
        false,
      );
    });

    it("evaluates gt expression", () => {
      expect(evaluateLogicExpression({ gt: [5, 3] }, emptyContext)).toBe(true);
      expect(evaluateLogicExpression({ gt: [3, 5] }, emptyContext)).toBe(false);
      expect(evaluateLogicExpression({ gt: [5, 5] }, emptyContext)).toBe(false);
    });

    it("evaluates gte expression", () => {
      expect(evaluateLogicExpression({ gte: [5, 5] }, emptyContext)).toBe(true);
      expect(evaluateLogicExpression({ gte: [6, 5] }, emptyContext)).toBe(true);
      expect(evaluateLogicExpression({ gte: [4, 5] }, emptyContext)).toBe(
        false,
      );
    });

    it("evaluates lt expression", () => {
      expect(evaluateLogicExpression({ lt: [3, 5] }, emptyContext)).toBe(true);
      expect(evaluateLogicExpression({ lt: [5, 3] }, emptyContext)).toBe(false);
      expect(evaluateLogicExpression({ lt: [5, 5] }, emptyContext)).toBe(false);
    });

    it("evaluates lte expression", () => {
      expect(evaluateLogicExpression({ lte: [5, 5] }, emptyContext)).toBe(true);
      expect(evaluateLogicExpression({ lte: [4, 5] }, emptyContext)).toBe(true);
      expect(evaluateLogicExpression({ lte: [6, 5] }, emptyContext)).toBe(
        false,
      );
    });
  });

  describe("boolean operators", () => {
    it("evaluates and expression", () => {
      expect(
        evaluateLogicExpression(
          { and: [{ eq: [1, 1] }, { eq: [2, 2] }] },
          emptyContext,
        ),
      ).toBe(true);
      expect(
        evaluateLogicExpression(
          { and: [{ eq: [1, 1] }, { eq: [1, 2] }] },
          emptyContext,
        ),
      ).toBe(false);
      expect(
        evaluateLogicExpression(
          { and: [{ eq: [1, 2] }, { eq: [1, 2] }] },
          emptyContext,
        ),
      ).toBe(false);
    });

    it("evaluates or expression", () => {
      expect(
        evaluateLogicExpression(
          { or: [{ eq: [1, 2] }, { eq: [2, 2] }] },
          emptyContext,
        ),
      ).toBe(true);
      expect(
        evaluateLogicExpression(
          { or: [{ eq: [1, 1] }, { eq: [1, 2] }] },
          emptyContext,
        ),
      ).toBe(true);
      expect(
        evaluateLogicExpression(
          { or: [{ eq: [1, 2] }, { eq: [3, 4] }] },
          emptyContext,
        ),
      ).toBe(false);
    });

    it("evaluates not expression", () => {
      expect(
        evaluateLogicExpression({ not: { eq: [1, 2] } }, emptyContext),
      ).toBe(true);
      expect(
        evaluateLogicExpression({ not: { eq: [1, 1] } }, emptyContext),
      ).toBe(false);
    });
  });

  describe("path expressions", () => {
    it("evaluates truthy path values", () => {
      const ctx = { dataModel: { isAdmin: true, count: 5, name: "John" } };

      expect(evaluateLogicExpression({ path: "/isAdmin" }, ctx)).toBe(true);
      expect(evaluateLogicExpression({ path: "/count" }, ctx)).toBe(true);
      expect(evaluateLogicExpression({ path: "/name" }, ctx)).toBe(true);
    });

    it("evaluates falsy path values", () => {
      const ctx = {
        dataModel: { isAdmin: false, count: 0, name: "", nothing: null },
      };

      expect(evaluateLogicExpression({ path: "/isAdmin" }, ctx)).toBe(false);
      expect(evaluateLogicExpression({ path: "/count" }, ctx)).toBe(false);
      expect(evaluateLogicExpression({ path: "/name" }, ctx)).toBe(false);
      expect(evaluateLogicExpression({ path: "/nothing" }, ctx)).toBe(false);
    });

    it("evaluates missing paths as false", () => {
      expect(
        evaluateLogicExpression({ path: "/nonexistent" }, emptyContext),
      ).toBe(false);
    });
  });

  describe("with dynamic path references", () => {
    it("resolves path references in comparisons", () => {
      const ctx = { dataModel: { count: 5, limit: 10 } };

      expect(
        evaluateLogicExpression(
          { lt: [{ path: "/count" }, { path: "/limit" }] },
          ctx,
        ),
      ).toBe(true);
      expect(
        evaluateLogicExpression({ eq: [{ path: "/count" }, 5] }, ctx),
      ).toBe(true);
    });
  });
});

describe("evaluateVisibility", () => {
  it("returns true for undefined condition", () => {
    expect(evaluateVisibility(undefined, { dataModel: {} })).toBe(true);
  });

  it("evaluates boolean literals", () => {
    expect(evaluateVisibility(true, { dataModel: {} })).toBe(true);
    expect(evaluateVisibility(false, { dataModel: {} })).toBe(false);
  });

  it("evaluates path conditions", () => {
    expect(
      evaluateVisibility(
        { path: "/visible" },
        { dataModel: { visible: true } },
      ),
    ).toBe(true);
    expect(
      evaluateVisibility(
        { path: "/visible" },
        { dataModel: { visible: false } },
      ),
    ).toBe(false);
  });

  it("evaluates auth signedIn condition", () => {
    expect(
      evaluateVisibility(
        { auth: "signedIn" },
        { dataModel: {}, authState: { isSignedIn: true } },
      ),
    ).toBe(true);
    expect(
      evaluateVisibility(
        { auth: "signedIn" },
        { dataModel: {}, authState: { isSignedIn: false } },
      ),
    ).toBe(false);
    expect(evaluateVisibility({ auth: "signedIn" }, { dataModel: {} })).toBe(
      false,
    );
  });

  it("evaluates auth signedOut condition", () => {
    expect(
      evaluateVisibility(
        { auth: "signedOut" },
        { dataModel: {}, authState: { isSignedIn: false } },
      ),
    ).toBe(true);
    expect(
      evaluateVisibility(
        { auth: "signedOut" },
        { dataModel: {}, authState: { isSignedIn: true } },
      ),
    ).toBe(false);
  });

  it("evaluates logic expressions", () => {
    expect(evaluateVisibility({ eq: [1, 1] }, { dataModel: {} })).toBe(true);
    expect(
      evaluateVisibility(
        { and: [{ eq: [1, 1] }, { eq: [2, 2] }] },
        { dataModel: {} },
      ),
    ).toBe(true);
  });
});

describe("visibility helper", () => {
  it("creates always condition", () => {
    expect(visibility.always).toBe(true);
  });

  it("creates never condition", () => {
    expect(visibility.never).toBe(false);
  });

  it("creates when (path) condition", () => {
    expect(visibility.when("/user/isAdmin")).toEqual({ path: "/user/isAdmin" });
  });

  it("creates signedIn condition", () => {
    expect(visibility.signedIn).toEqual({ auth: "signedIn" });
  });

  it("creates signedOut condition", () => {
    expect(visibility.signedOut).toEqual({ auth: "signedOut" });
  });

  it("creates and condition", () => {
    const cond1 = { eq: [1, 1] as [number, number] };
    const cond2 = { eq: [2, 2] as [number, number] };
    expect(visibility.and(cond1, cond2)).toEqual({ and: [cond1, cond2] });
  });

  it("creates or condition", () => {
    const cond1 = { eq: [1, 1] as [number, number] };
    const cond2 = { eq: [2, 2] as [number, number] };
    expect(visibility.or(cond1, cond2)).toEqual({ or: [cond1, cond2] });
  });

  it("creates not condition", () => {
    const cond = { eq: [1, 2] as [number, number] };
    expect(visibility.not(cond)).toEqual({ not: cond });
  });

  it("creates eq condition", () => {
    expect(visibility.eq(1, 1)).toEqual({ eq: [1, 1] });
    expect(visibility.eq({ path: "/a" }, { path: "/b" })).toEqual({
      eq: [{ path: "/a" }, { path: "/b" }],
    });
  });

  it("creates comparison conditions", () => {
    expect(visibility.neq(1, 2)).toEqual({ neq: [1, 2] });
    expect(visibility.gt(5, 3)).toEqual({ gt: [5, 3] });
    expect(visibility.gte(5, 5)).toEqual({ gte: [5, 5] });
    expect(visibility.lt(3, 5)).toEqual({ lt: [3, 5] });
    expect(visibility.lte(5, 5)).toEqual({ lte: [5, 5] });
  });

  it("creates hasRole condition", () => {
    expect(visibility.hasRole("admin")).toEqual({ role: "admin" });
    expect(visibility.hasRole(["admin", "editor"])).toEqual({
      role: ["admin", "editor"],
    });
  });

  it("creates hasFeature condition", () => {
    expect(visibility.hasFeature("beta")).toEqual({ feature: "beta" });
    expect(visibility.hasFeature(["beta", "v2"])).toEqual({
      feature: ["beta", "v2"],
    });
  });

  it("creates onDevice condition", () => {
    expect(visibility.onDevice("mobile")).toEqual({ device: "mobile" });
    expect(visibility.onDevice(["mobile", "tablet"])).toEqual({
      device: ["mobile", "tablet"],
    });
  });

  it("creates mobileOnly condition", () => {
    expect(visibility.mobileOnly).toEqual({ device: "mobile" });
  });

  it("creates desktopOnly condition", () => {
    expect(visibility.desktopOnly).toEqual({ device: "desktop" });
  });
});

describe("evaluateVisibility - extended conditions", () => {
  describe("role conditions", () => {
    it("evaluates role condition with matching role", () => {
      const ctx = {
        dataModel: {},
        authState: { isSignedIn: true, roles: ["admin", "user"] },
      };
      expect(evaluateVisibility({ role: "admin" }, ctx)).toBe(true);
    });

    it("evaluates role condition with no matching role", () => {
      const ctx = {
        dataModel: {},
        authState: { isSignedIn: true, roles: ["user"] },
      };
      expect(evaluateVisibility({ role: "admin" }, ctx)).toBe(false);
    });

    it("evaluates role condition with array of roles (OR logic)", () => {
      const ctx = {
        dataModel: {},
        authState: { isSignedIn: true, roles: ["editor"] },
      };
      expect(evaluateVisibility({ role: ["admin", "editor"] }, ctx)).toBe(true);
    });

    it("evaluates role condition with no roles in state", () => {
      const ctx = { dataModel: {}, authState: { isSignedIn: true } };
      expect(evaluateVisibility({ role: "admin" }, ctx)).toBe(false);
    });
  });

  describe("feature conditions", () => {
    it("evaluates feature condition with enabled feature", () => {
      const ctx = { dataModel: {}, featureFlags: { enabled: ["beta", "v2"] } };
      expect(evaluateVisibility({ feature: "beta" }, ctx)).toBe(true);
    });

    it("evaluates feature condition with disabled feature", () => {
      const ctx = { dataModel: {}, featureFlags: { enabled: ["v2"] } };
      expect(evaluateVisibility({ feature: "beta" }, ctx)).toBe(false);
    });

    it("evaluates feature condition with array (OR logic)", () => {
      const ctx = { dataModel: {}, featureFlags: { enabled: ["v2"] } };
      expect(evaluateVisibility({ feature: ["beta", "v2"] }, ctx)).toBe(true);
    });

    it("evaluates feature condition with no feature flags", () => {
      const ctx = { dataModel: {} };
      expect(evaluateVisibility({ feature: "beta" }, ctx)).toBe(false);
    });
  });

  describe("device conditions", () => {
    it("evaluates device condition with matching device", () => {
      const ctx = { dataModel: {}, deviceState: { type: "mobile" as const } };
      expect(evaluateVisibility({ device: "mobile" }, ctx)).toBe(true);
    });

    it("evaluates device condition with non-matching device", () => {
      const ctx = { dataModel: {}, deviceState: { type: "desktop" as const } };
      expect(evaluateVisibility({ device: "mobile" }, ctx)).toBe(false);
    });

    it("evaluates device condition with array (OR logic)", () => {
      const ctx = { dataModel: {}, deviceState: { type: "tablet" as const } };
      expect(evaluateVisibility({ device: ["mobile", "tablet"] }, ctx)).toBe(
        true,
      );
    });

    it("defaults to desktop when no device state", () => {
      const ctx = { dataModel: {} };
      expect(evaluateVisibility({ device: "desktop" }, ctx)).toBe(true);
      expect(evaluateVisibility({ device: "mobile" }, ctx)).toBe(false);
    });
  });
});
