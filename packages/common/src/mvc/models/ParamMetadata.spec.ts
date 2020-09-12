import {prototypeOf, Store} from "@tsed/core";
import {expect} from "chai";
import {IFilter, ParamMetadata, ParamTypes, QueryParams, Req} from "../../../src/mvc";

class Test {
  method(arg1: any, arg2: any) {}
}

class TestFilter implements IFilter {
  transform(value: any) {
    return value;
  }
}

describe("ParamMetadata", () => {
  describe("props", () => {
    let paramMetadata: ParamMetadata;
    before(() => {
      paramMetadata = new ParamMetadata({target: Test, propertyKey: "method", index: 0});
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;
    });
    it("should return the required value", () => {
      expect(paramMetadata.required).to.be.a("boolean").and.to.eq(true);
    });

    it("should return the expression", () => {
      expect(paramMetadata.expression).to.be.a("string").and.to.eq("test");
    });

    it("should return collectionType", () => {
      expect(paramMetadata.collectionType).to.eq(undefined);
    });

    it("should return type", () => {
      expect(paramMetadata.type).to.eq(Test);
    });

    it("should return index", () => {
      expect(paramMetadata.index).to.eq(0);
    });
    it("should return store", () => {
      expect(paramMetadata.store).to.be.an.instanceof(Store);
    });
  });

  describe("as a service", () => {
    let paramMetadata: ParamMetadata;

    before(() => {
      paramMetadata = new ParamMetadata({target: Test, propertyKey: "method", index: 0});
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;
      paramMetadata.paramType = ParamTypes.ERR;
    });

    it("should return the service", () => {
      expect(paramMetadata.service).to.be.a("string").to.eq(ParamTypes.ERR);
    });
  });

  describe("as a filter", () => {
    let paramMetadata: ParamMetadata;

    before(() => {
      paramMetadata = new ParamMetadata({target: Test, propertyKey: "method", index: 0});
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;
      paramMetadata.filter = TestFilter;
    });

    it("should return the service", () => {
      expect(paramMetadata.service).to.eq(TestFilter);
    });
  });

  describe("isRequired", () => {
    describe("when property is required", () => {
      let paramMetadata: ParamMetadata;

      before(() => {
        paramMetadata = new ParamMetadata({target: Test, propertyKey: "method", index: 0});
        paramMetadata.allowedRequiredValues = [];
        paramMetadata.required = true;
      });
      it("should return false (value 0)", () => {
        expect(paramMetadata.isRequired(0)).to.be.false;
      });

      it("should return true (value '')", () => {
        expect(paramMetadata.isRequired("")).to.be.true;
      });
      it("should return true (value null)", () => {
        expect(paramMetadata.isRequired(null)).to.be.true;
      });
      it("should return true (value undefined)", () => {
        expect(paramMetadata.isRequired(undefined)).to.be.true;
      });
    });

    describe("when property is required and have allowed values", () => {
      let paramMetadata: ParamMetadata;

      before(() => {
        paramMetadata = new ParamMetadata({target: Test, propertyKey: "method", index: 0});
        paramMetadata.allowedRequiredValues = [null];
        paramMetadata.required = true;
      });
      it("should return false (value 0)", () => {
        expect(paramMetadata.isRequired(0)).to.be.false;
      });

      it("should return true (value '')", () => {
        expect(paramMetadata.isRequired("")).to.be.true;
      });
      it("should return false (value null)", () => {
        expect(paramMetadata.isRequired(null)).to.be.false;
      });
      it("should return true (value undefined)", () => {
        expect(paramMetadata.isRequired(undefined)).to.be.true;
      });
    });

    describe("when property is not required", () => {
      let paramMetadata: ParamMetadata;

      before(() => {
        paramMetadata = new ParamMetadata({target: Test, propertyKey: "method", index: 0});
        paramMetadata.allowedRequiredValues = [];
        paramMetadata.required = false;
      });
      it("should return false (value 0)", () => {
        expect(paramMetadata.isRequired(0)).to.be.false;
      });

      it("should return false (value '')", () => {
        expect(paramMetadata.isRequired("")).to.be.false;
      });
      it("should return false (value null)", () => {
        expect(paramMetadata.isRequired(null)).to.be.false;
      });
      it("should return false (value undefined)", () => {
        expect(paramMetadata.isRequired(undefined)).to.be.false;
      });
    });
  });

  describe("getParams", () => {
    it("should returns params", () => {
      // GIVEN
      class Test {
        test(@Req() req: any) {}
      }

      // WHEN
      const result = ParamMetadata.getParams(prototypeOf(Test), "test");

      // THEN
      const param1 = new ParamMetadata({target: prototypeOf(Test), propertyKey: "test", index: 0});
      param1.paramType = ParamTypes.REQUEST;

      expect(result).to.deep.eq([param1]);
    });
    it("should returns params from inherited", () => {
      // GIVEN
      class BaseTest {
        list(@QueryParams("search") search: string) {}

        base(@QueryParams("base") test: string) {}
      }

      class Test extends BaseTest {
        test(@Req() req: any) {}

        base(@QueryParams("test") test: string) {}
      }

      // WHEN
      const result1 = ParamMetadata.getParams(Test, "list");
      const result2 = ParamMetadata.getParams(Test, "test");
      const result3 = ParamMetadata.getParams(Test, "unknown");
      const result4 = ParamMetadata.getParams(Test, "base");

      // THEN
      expect(result1).to.deep.eq(Store.fromMethod(BaseTest, "list").get("params"));
      expect(result2).to.deep.eq(Store.fromMethod(Test, "test").get("params"));
      expect(result3).to.deep.eq([]);
      expect(result4).to.deep.eq(Store.fromMethod(Test, "base").get("params"));
    });
  });
});
