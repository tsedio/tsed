import {expect} from "chai";
import {SymbolMapper} from "./SymbolMapper";

describe("SymbolMapper", () => {
  describe("deserialize()", () => {
    it("should return value", () => {
      const mapper = new SymbolMapper();

      const value = mapper.deserialize("SYMBOL");

      expect(typeof value).to.eq("symbol");
      expect(value.toString()).to.eq("Symbol(SYMBOL)");
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const mapper = new SymbolMapper();

      const value = mapper.serialize(Symbol.for("SYMBOL"));

      expect(value).to.eq("SYMBOL");
    });
  });
});
