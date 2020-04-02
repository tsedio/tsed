import {inject, TestContext} from "@tsed/testing";
import {expect} from "chai";
import {ConverterService} from "../../../src/converters";

describe("SymbolConverter", () => {
  after(TestContext.create);
  after(TestContext.reset);

  describe("deserialize()", () => {
    it("should deserialize data as symbol when a string is given", inject([ConverterService], (converterService: ConverterService) => {
      const converter = converterService.getConverter(Symbol)!;

      // @ts-ignore
      expect(converter.deserialize("testSymbol")).to.be.a("symbol");
    }));
  });

  describe("serialize()", () => {
    it("should serialize data", inject([ConverterService], (converterService: ConverterService) => {
      const converter = converterService.getConverter(Symbol)!;
      // @ts-ignore
      const symbolTest = converter.serialize(Symbol("testSymbol2"));
      expect(symbolTest).to.be.a("string");
      expect(symbolTest).to.be.equal("testSymbol2");
    }));
  });
});
