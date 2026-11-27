import {isInheritedFrom} from "./isInheritedFrom.js";

describe("isInheritedFrom()", () => {
  class A {}
  class B extends A {}
  class C extends B {}
  class Other {}

  it("should check the inheritance chain", () => {
    expect(isInheritedFrom(C, A)).toBe(true);
    expect(isInheritedFrom(C, C)).toBe(true);
    expect(isInheritedFrom(new C(), A)).toBe(true);
    expect(isInheritedFrom(C, Other)).toBe(false);
    expect(isInheritedFrom(A, C)).toBe(false);
  });

  it("should return false for empty values", () => {
    expect(isInheritedFrom(undefined, A)).toBe(false);
    expect(isInheritedFrom(C, null)).toBe(false);
  });

  it("should respect the depth", () => {
    expect(isInheritedFrom(C, A, 2)).toBe(false);
    expect(isInheritedFrom(C, A, 3)).toBe(true);
  });

  it("should stop on an anonymous class", () => {
    const Anonymous = (() => class extends A {})();

    expect(isInheritedFrom(Anonymous, A)).toBe(false);
  });
});
