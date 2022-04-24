import {SymbolMapper} from "./SymbolMapper";

describe("SymbolMapper", () => {
  describe("deserialize()", () => {
    it("should return value", () => {
      const mapper = new SymbolMapper();

      const value = mapper.deserialize("SYMBOL");

      expect(typeof value).toEqual("symbol");
      expect(value.toString()).toEqual("Symbol(SYMBOL)");
    });
  });
  describe("serialize()", () => {
    it("should return value", () => {
      const mapper = new SymbolMapper();

      const value = mapper.serialize(Symbol.for("SYMBOL"));

      expect(value).toEqual("SYMBOL");
    });
  });
});
