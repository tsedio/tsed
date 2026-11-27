import {ancestorsOf} from "./ancestorsOf.js";

describe("ancestorsOf()", () => {
  class A {}
  class B extends A {}
  class C extends B {}

  it("should return the classes from the root to the given class", () => {
    expect(ancestorsOf(C)).toEqual([A, B, C]);
    expect(ancestorsOf(A)).toEqual([A]);
  });

  it("should accept an instance", () => {
    expect(ancestorsOf(new C())).toEqual([A, B, C]);
  });

  it("should stop on an anonymous class", () => {
    const Anonymous = (() => class extends A {})();

    class D extends Anonymous {}

    expect(ancestorsOf(Anonymous)).toEqual([]);
    expect(ancestorsOf(D)).toEqual([D]);
  });

  it("should return a new array on each call", () => {
    const first = ancestorsOf(C);

    first.push("other" as any);

    expect(ancestorsOf(C)).toEqual([A, B, C]);
  });
});
