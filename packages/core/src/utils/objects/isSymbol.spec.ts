import {isSymbol, isSymbolOrSymbolClass} from "@tsed/core";
import {expect} from "chai";

describe("isSymbol()", () => {
  it("should validate value", () => {
    expect(isSymbol(Symbol.for("test"))).to.eq(true);
    expect(isSymbol("test")).to.eq(false);
    expect(isSymbolOrSymbolClass(Symbol.for("test"))).to.eq(true);
    expect(isSymbolOrSymbolClass(Symbol)).to.eq(true);
    expect(isSymbolOrSymbolClass("test")).to.eq(false);
  });
});
