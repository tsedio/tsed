import {Store} from "@tsed/core";
import {expect} from "chai";
import {ParamMetadata} from "./ParamMetadata";
import {ParamTypes} from "./ParamTypes";

class Test {
  method(arg1: any, arg2: any) {}
}

describe("ParamMetadata", () => {
  describe("props", () => {
    it("should return the required value", () => {
      const paramMetadata = ParamMetadata.get(Test, "method", 0);
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;

      expect(paramMetadata.required).to.be.a("boolean").and.to.eq(true);

      expect(paramMetadata.expression).to.be.a("string").and.to.eq("test");

      expect(paramMetadata.collectionType).to.eq(undefined);
      expect(paramMetadata.type).to.eq(Test);
      expect(paramMetadata.index).to.eq(0);
      expect(paramMetadata.store).to.be.an.instanceof(Store);
    });
  });

  describe("as a service", () => {
    it("should return the service", () => {
      const paramMetadata = ParamMetadata.get(Test, "method", 0);
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;
      paramMetadata.paramType = ParamTypes.ERR;

      expect(paramMetadata.paramType).to.be.a("string").to.eq(ParamTypes.ERR);
    });
  });
});
