import {hasPlaceholders, interpolate} from "./interpolate.js";

describe("interpolate()", () => {
  it("replaces the placeholders with the matching variables", () => {
    expect(interpolate("Bearer ${TOKEN}", {TOKEN: "abc"})).toBe("Bearer abc");
    expect(interpolate("${A}-${B}-${A}", {A: "1", B: "2"})).toBe("1-2-1");
  });

  it("leaves placeholders without a matching variable untouched", () => {
    expect(interpolate("${TOKEN} ${OTHER}", {TOKEN: "abc"})).toBe("abc ${OTHER}");
    expect(interpolate("${constructor}", {})).toBe("${constructor}");
  });

  it("replaces an undefined variable with an empty string", () => {
    expect(interpolate("Bearer ${TOKEN}", {TOKEN: undefined})).toBe("Bearer ");
  });

  it("returns a string without placeholder as is", () => {
    expect(interpolate("plain $TOKEN {TOKEN}", {TOKEN: "abc"})).toBe("plain $TOKEN {TOKEN}");
  });
});

describe("hasPlaceholders()", () => {
  it("detects one of the given placeholder names", () => {
    expect(hasPlaceholders("Bearer ${TOKEN}", ["TOKEN", "CLIENT"])).toBe(true);
    expect(hasPlaceholders("${OTHER} ${CLIENT}", ["TOKEN", "CLIENT"])).toBe(true);
  });

  it("ignores other placeholders and plain strings", () => {
    expect(hasPlaceholders("${OTHER}", ["TOKEN"])).toBe(false);
    expect(hasPlaceholders("Bearer token", ["TOKEN"])).toBe(false);
  });
});
