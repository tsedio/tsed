import {isSymbol, isSymbolOrSymbolClass} from "./isSymbol.js";

describe("isSymbol()", () => {
  it("should validate value", () => {
    expect(isSymbol(Symbol.for("test"))).toBe(true);
    expect(isSymbol("test")).toBe(false);
    expect(isSymbolOrSymbolClass(Symbol.for("test"))).toBe(true);
    expect(isSymbolOrSymbolClass(Symbol)).toBe(true);
    expect(isSymbolOrSymbolClass("test")).toBe(false);
  });
});
