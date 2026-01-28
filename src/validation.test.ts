import { describe, it, expect } from "vitest";
import {
  builtInValidationFunctions,
  runValidationCheck,
  runValidation,
  check,
} from "./validation";

describe("builtInValidationFunctions", () => {
  describe("required", () => {
    it("passes for non-empty values", () => {
      expect(builtInValidationFunctions.required("hello")).toBe(true);
      expect(builtInValidationFunctions.required(0)).toBe(true);
      expect(builtInValidationFunctions.required(false)).toBe(true);
      expect(builtInValidationFunctions.required(["item"])).toBe(true);
      expect(builtInValidationFunctions.required({ key: "value" })).toBe(true);
    });

    it("fails for empty values", () => {
      expect(builtInValidationFunctions.required("")).toBe(false);
      expect(builtInValidationFunctions.required("   ")).toBe(false);
      expect(builtInValidationFunctions.required(null)).toBe(false);
      expect(builtInValidationFunctions.required(undefined)).toBe(false);
      expect(builtInValidationFunctions.required([])).toBe(false);
    });
  });

  describe("email", () => {
    it("passes for valid emails", () => {
      expect(builtInValidationFunctions.email("test@example.com")).toBe(true);
      expect(builtInValidationFunctions.email("user.name@domain.co")).toBe(
        true,
      );
      expect(builtInValidationFunctions.email("a@b.c")).toBe(true);
    });

    it("fails for invalid emails", () => {
      expect(builtInValidationFunctions.email("invalid")).toBe(false);
      expect(builtInValidationFunctions.email("missing@domain")).toBe(false);
      expect(builtInValidationFunctions.email("@domain.com")).toBe(false);
      expect(builtInValidationFunctions.email("user@")).toBe(false);
      expect(builtInValidationFunctions.email(123)).toBe(false);
    });
  });

  describe("minLength", () => {
    it("passes when string meets minimum length", () => {
      expect(builtInValidationFunctions.minLength("hello", { min: 3 })).toBe(
        true,
      );
      expect(builtInValidationFunctions.minLength("abc", { min: 3 })).toBe(
        true,
      );
      expect(builtInValidationFunctions.minLength("abcdef", { min: 3 })).toBe(
        true,
      );
    });

    it("fails when string is too short", () => {
      expect(builtInValidationFunctions.minLength("hi", { min: 3 })).toBe(
        false,
      );
      expect(builtInValidationFunctions.minLength("", { min: 1 })).toBe(false);
    });

    it("fails for non-strings", () => {
      expect(builtInValidationFunctions.minLength(123, { min: 1 })).toBe(false);
    });

    it("fails when min is not provided", () => {
      expect(builtInValidationFunctions.minLength("hello", {})).toBe(false);
    });
  });

  describe("maxLength", () => {
    it("passes when string meets maximum length", () => {
      expect(builtInValidationFunctions.maxLength("hi", { max: 5 })).toBe(true);
      expect(builtInValidationFunctions.maxLength("hello", { max: 5 })).toBe(
        true,
      );
    });

    it("fails when string exceeds maximum", () => {
      expect(builtInValidationFunctions.maxLength("hello!", { max: 5 })).toBe(
        false,
      );
    });
  });

  describe("pattern", () => {
    it("passes when string matches pattern", () => {
      expect(
        builtInValidationFunctions.pattern("abc123", {
          pattern: "^[a-z0-9]+$",
        }),
      ).toBe(true);
    });

    it("fails when string does not match pattern", () => {
      expect(
        builtInValidationFunctions.pattern("ABC", { pattern: "^[a-z]+$" }),
      ).toBe(false);
    });

    it("fails for invalid regex pattern", () => {
      expect(
        builtInValidationFunctions.pattern("test", { pattern: "[invalid" }),
      ).toBe(false);
    });
  });

  describe("min", () => {
    it("passes when number meets minimum", () => {
      expect(builtInValidationFunctions.min(5, { min: 3 })).toBe(true);
      expect(builtInValidationFunctions.min(3, { min: 3 })).toBe(true);
    });

    it("fails when number is below minimum", () => {
      expect(builtInValidationFunctions.min(2, { min: 3 })).toBe(false);
    });

    it("fails for non-numbers", () => {
      expect(builtInValidationFunctions.min("5", { min: 3 })).toBe(false);
    });
  });

  describe("max", () => {
    it("passes when number meets maximum", () => {
      expect(builtInValidationFunctions.max(3, { max: 5 })).toBe(true);
      expect(builtInValidationFunctions.max(5, { max: 5 })).toBe(true);
    });

    it("fails when number exceeds maximum", () => {
      expect(builtInValidationFunctions.max(6, { max: 5 })).toBe(false);
    });
  });

  describe("numeric", () => {
    it("passes for numbers", () => {
      expect(builtInValidationFunctions.numeric(42)).toBe(true);
      expect(builtInValidationFunctions.numeric(3.14)).toBe(true);
      expect(builtInValidationFunctions.numeric(0)).toBe(true);
    });

    it("passes for numeric strings", () => {
      expect(builtInValidationFunctions.numeric("42")).toBe(true);
      expect(builtInValidationFunctions.numeric("3.14")).toBe(true);
    });

    it("fails for non-numeric values", () => {
      expect(builtInValidationFunctions.numeric("abc")).toBe(false);
      expect(builtInValidationFunctions.numeric(NaN)).toBe(false);
      expect(builtInValidationFunctions.numeric(null)).toBe(false);
    });
  });

  describe("url", () => {
    it("passes for valid URLs", () => {
      expect(builtInValidationFunctions.url("https://example.com")).toBe(true);
      expect(builtInValidationFunctions.url("http://localhost:3000")).toBe(
        true,
      );
      expect(
        builtInValidationFunctions.url("https://example.com/path?query=1"),
      ).toBe(true);
    });

    it("fails for invalid URLs", () => {
      expect(builtInValidationFunctions.url("not-a-url")).toBe(false);
      expect(builtInValidationFunctions.url("example.com")).toBe(false);
    });
  });

  describe("matches", () => {
    it("passes when values match", () => {
      expect(
        builtInValidationFunctions.matches("password", { other: "password" }),
      ).toBe(true);
      expect(builtInValidationFunctions.matches(123, { other: 123 })).toBe(
        true,
      );
    });

    it("fails when values do not match", () => {
      expect(
        builtInValidationFunctions.matches("password", { other: "different" }),
      ).toBe(false);
    });
  });
});

describe("runValidationCheck", () => {
  it("runs a validation check and returns result", () => {
    const result = runValidationCheck(
      { fn: "required", message: "Required" },
      { value: "hello", dataModel: {} },
    );

    expect(result.fn).toBe("required");
    expect(result.valid).toBe(true);
    expect(result.message).toBe("Required");
  });

  it("resolves dynamic args from dataModel", () => {
    const result = runValidationCheck(
      {
        fn: "minLength",
        args: { min: { path: "/minLen" } },
        message: "Too short",
      },
      { value: "hi", dataModel: { minLen: 5 } },
    );

    expect(result.valid).toBe(false);
  });

  it("returns valid for unknown functions with warning", () => {
    const result = runValidationCheck(
      { fn: "unknownFunction", message: "Unknown" },
      { value: "test", dataModel: {} },
    );

    expect(result.valid).toBe(true);
  });

  it("uses custom validation functions", () => {
    const customFunctions = {
      startsWithA: (value: unknown) =>
        typeof value === "string" && value.startsWith("A"),
    };

    const result = runValidationCheck(
      { fn: "startsWithA", message: "Must start with A" },
      { value: "Apple", dataModel: {}, customFunctions },
    );

    expect(result.valid).toBe(true);
  });
});

describe("runValidation", () => {
  it("runs all validation checks", () => {
    const result = runValidation(
      {
        checks: [
          { fn: "required", message: "Required" },
          { fn: "email", message: "Invalid email" },
        ],
      },
      { value: "test@example.com", dataModel: {} },
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.checks).toHaveLength(2);
  });

  it("collects all errors", () => {
    const result = runValidation(
      {
        checks: [
          { fn: "required", message: "Required" },
          { fn: "email", message: "Invalid email" },
        ],
      },
      { value: "", dataModel: {} },
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Required");
    expect(result.errors).toContain("Invalid email");
  });

  it("skips validation when enabled condition is false", () => {
    const result = runValidation(
      {
        checks: [{ fn: "required", message: "Required" }],
        enabled: { eq: [1, 2] }, // Always false
      },
      { value: "", dataModel: {} },
    );

    expect(result.valid).toBe(true);
    expect(result.checks).toHaveLength(0);
  });

  it("runs validation when enabled condition is true", () => {
    const result = runValidation(
      {
        checks: [{ fn: "required", message: "Required" }],
        enabled: { eq: [1, 1] }, // Always true
      },
      { value: "", dataModel: {} },
    );

    expect(result.valid).toBe(false);
  });

  it("returns valid when no checks defined", () => {
    const result = runValidation({}, { value: "", dataModel: {} });

    expect(result.valid).toBe(true);
    expect(result.checks).toHaveLength(0);
  });
});

describe("check helper", () => {
  describe("required", () => {
    it("creates required check with default message", () => {
      const c = check.required();

      expect(c.fn).toBe("required");
      expect(c.message).toBe("This field is required");
    });

    it("creates required check with custom message", () => {
      const c = check.required("Custom message");

      expect(c.message).toBe("Custom message");
    });
  });

  describe("email", () => {
    it("creates email check with default message", () => {
      const c = check.email();

      expect(c.fn).toBe("email");
      expect(c.message).toBe("Invalid email address");
    });
  });

  describe("minLength", () => {
    it("creates minLength check with args", () => {
      const c = check.minLength(5, "Too short");

      expect(c.fn).toBe("minLength");
      expect(c.args).toEqual({ min: 5 });
      expect(c.message).toBe("Too short");
    });

    it("uses default message", () => {
      const c = check.minLength(3);

      expect(c.message).toBe("Must be at least 3 characters");
    });
  });

  describe("maxLength", () => {
    it("creates maxLength check with args", () => {
      const c = check.maxLength(100);

      expect(c.fn).toBe("maxLength");
      expect(c.args).toEqual({ max: 100 });
    });
  });

  describe("pattern", () => {
    it("creates pattern check", () => {
      const c = check.pattern("^[a-z]+$", "Letters only");

      expect(c.fn).toBe("pattern");
      expect(c.args).toEqual({ pattern: "^[a-z]+$" });
      expect(c.message).toBe("Letters only");
    });
  });

  describe("min", () => {
    it("creates min check", () => {
      const c = check.min(0, "Must be positive");

      expect(c.fn).toBe("min");
      expect(c.args).toEqual({ min: 0 });
    });
  });

  describe("max", () => {
    it("creates max check", () => {
      const c = check.max(100);

      expect(c.fn).toBe("max");
      expect(c.args).toEqual({ max: 100 });
    });
  });

  describe("url", () => {
    it("creates url check", () => {
      const c = check.url("Must be a URL");

      expect(c.fn).toBe("url");
      expect(c.message).toBe("Must be a URL");
    });
  });

  describe("matches", () => {
    it("creates matches check with path reference", () => {
      const c = check.matches("/password", "Passwords must match");

      expect(c.fn).toBe("matches");
      expect(c.args).toEqual({ other: { path: "/password" } });
      expect(c.message).toBe("Passwords must match");
    });
  });

  describe("phone", () => {
    it("creates phone check", () => {
      const c = check.phone();

      expect(c.fn).toBe("phone");
      expect(c.message).toBe("Invalid phone number");
    });
  });

  describe("date", () => {
    it("creates date check", () => {
      const c = check.date();

      expect(c.fn).toBe("date");
      expect(c.message).toBe("Invalid date");
    });
  });

  describe("isoDate", () => {
    it("creates ISO date check", () => {
      const c = check.isoDate();

      expect(c.fn).toBe("date");
      expect(c.args).toEqual({ format: "iso" });
      expect(c.message).toBe("Must be ISO date format");
    });
  });

  describe("futureDate", () => {
    it("creates future date check", () => {
      const c = check.futureDate();

      expect(c.fn).toBe("futureDate");
      expect(c.message).toBe("Must be a future date");
    });
  });

  describe("pastDate", () => {
    it("creates past date check", () => {
      const c = check.pastDate();

      expect(c.fn).toBe("pastDate");
      expect(c.message).toBe("Must be a past date");
    });
  });

  describe("alphanumeric", () => {
    it("creates alphanumeric check", () => {
      const c = check.alphanumeric();

      expect(c.fn).toBe("alphanumeric");
    });
  });

  describe("minItems", () => {
    it("creates minItems check", () => {
      const c = check.minItems(2);

      expect(c.fn).toBe("minItems");
      expect(c.args).toEqual({ min: 2 });
      expect(c.message).toBe("Must have at least 2 items");
    });
  });

  describe("maxItems", () => {
    it("creates maxItems check", () => {
      const c = check.maxItems(10, "Too many items");

      expect(c.fn).toBe("maxItems");
      expect(c.args).toEqual({ max: 10 });
      expect(c.message).toBe("Too many items");
    });
  });

  describe("when", () => {
    it("creates conditional check", () => {
      const c = check.when({ path: "/isAdmin" }, check.required());

      expect(c.fn).toBe("required");
      expect(c.when).toEqual({ path: "/isAdmin" });
    });
  });
});

describe("builtInValidationFunctions - extended", () => {
  describe("phone", () => {
    it("validates valid phone numbers", () => {
      expect(builtInValidationFunctions.phone("+1234567890")).toBe(true);
      expect(builtInValidationFunctions.phone("(123) 456-7890")).toBe(true);
      expect(builtInValidationFunctions.phone("123-456-7890")).toBe(true);
    });

    it("rejects invalid phone numbers", () => {
      expect(builtInValidationFunctions.phone("123")).toBe(false);
      expect(builtInValidationFunctions.phone("abc")).toBe(false);
      expect(builtInValidationFunctions.phone(123)).toBe(false);
    });
  });

  describe("date", () => {
    it("validates valid dates", () => {
      expect(builtInValidationFunctions.date("2024-01-15")).toBe(true);
      expect(builtInValidationFunctions.date("January 15, 2024")).toBe(true);
    });

    it("validates ISO format when specified", () => {
      expect(
        builtInValidationFunctions.date("2024-01-15", { format: "iso" }),
      ).toBe(true);
      expect(
        builtInValidationFunctions.date("2024-01-15T10:30:00", {
          format: "iso",
        }),
      ).toBe(true);
      expect(
        builtInValidationFunctions.date("Jan 15 2024", { format: "iso" }),
      ).toBe(false);
    });

    it("rejects invalid dates", () => {
      expect(builtInValidationFunctions.date("not a date")).toBe(false);
      expect(builtInValidationFunctions.date(12345)).toBe(false);
    });
  });

  describe("futureDate", () => {
    it("validates future dates", () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      expect(builtInValidationFunctions.futureDate(future.toISOString())).toBe(
        true,
      );
    });

    it("rejects past dates", () => {
      expect(builtInValidationFunctions.futureDate("2020-01-01")).toBe(false);
    });
  });

  describe("pastDate", () => {
    it("validates past dates", () => {
      expect(builtInValidationFunctions.pastDate("2020-01-01")).toBe(true);
    });

    it("rejects future dates", () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      expect(builtInValidationFunctions.pastDate(future.toISOString())).toBe(
        false,
      );
    });
  });

  describe("alphanumeric", () => {
    it("validates alphanumeric strings", () => {
      expect(builtInValidationFunctions.alphanumeric("abc123")).toBe(true);
      expect(builtInValidationFunctions.alphanumeric("ABC")).toBe(true);
    });

    it("rejects non-alphanumeric", () => {
      expect(builtInValidationFunctions.alphanumeric("abc 123")).toBe(false);
      expect(builtInValidationFunctions.alphanumeric("abc!")).toBe(false);
    });
  });

  describe("minItems", () => {
    it("validates array with enough items", () => {
      expect(builtInValidationFunctions.minItems([1, 2, 3], { min: 2 })).toBe(
        true,
      );
    });

    it("rejects array with too few items", () => {
      expect(builtInValidationFunctions.minItems([1], { min: 2 })).toBe(false);
    });
  });

  describe("maxItems", () => {
    it("validates array within limit", () => {
      expect(builtInValidationFunctions.maxItems([1, 2], { max: 3 })).toBe(
        true,
      );
    });

    it("rejects array over limit", () => {
      expect(
        builtInValidationFunctions.maxItems([1, 2, 3, 4], { max: 3 }),
      ).toBe(false);
    });
  });
});

describe("runValidationCheck with when condition", () => {
  it("runs check when condition is true", () => {
    const result = runValidationCheck(
      {
        fn: "required",
        message: "Required",
        when: { path: "/isRequired" },
      },
      { value: "", dataModel: { isRequired: true } },
    );

    expect(result.valid).toBe(false);
  });

  it("skips check when condition is false", () => {
    const result = runValidationCheck(
      {
        fn: "required",
        message: "Required",
        when: { path: "/isRequired" },
      },
      { value: "", dataModel: { isRequired: false } },
    );

    expect(result.valid).toBe(true); // Skipped, so returns valid
  });

  it("evaluates complex when conditions", () => {
    const result = runValidationCheck(
      {
        fn: "required",
        message: "Required for admins",
        when: { eq: [{ path: "/role" }, "admin"] },
      },
      { value: "", dataModel: { role: "admin" } },
    );

    expect(result.valid).toBe(false);
  });
});
