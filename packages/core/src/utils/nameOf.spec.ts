import {nameOf, nameOfSymbol} from "./nameOf.js";

describe("nameOf()", () => {
  describe("symbols", () => {
    it("should return the description", () => {
      expect(nameOf(Symbol("token"))).toBe("token");
      expect(nameOfSymbol(Symbol.for("shared"))).toBe("shared");
      expect(nameOfSymbol(Symbol.iterator)).toBe("Symbol.iterator");
    });

    it("should return an empty string without description", () => {
      expect(nameOfSymbol(Symbol())).toBe("");
      expect(nameOfSymbol(Symbol(""))).toBe("");
    });

    it("should remove the first closing parenthesis of a description holding one", () => {
      expect(nameOfSymbol(Symbol("fn()"))).toBe("fn()");
      expect(nameOfSymbol(Symbol("a)b"))).toBe("ab)");
      expect(nameOfSymbol(Symbol("Symbol(x)"))).toBe("Symbol(x)");
    });
  });

  it("should return the name of a class, an anonymous class and an instance", () => {
    class Test {}

    expect(nameOf(Test)).toBe("Test");
    expect(nameOf((() => class {})())).toBe("");
    expect(nameOf(new Test())).toBe("[object Object]");
  });
});
