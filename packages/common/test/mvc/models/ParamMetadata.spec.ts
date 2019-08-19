import {Store} from "@tsed/core";
import {expect} from "chai";
import {ParamMetadata, ParamTypes} from "../../../src/mvc";

class Test {
  method(arg1: any, arg2: any) {
  }
}

class TestFilter {
}

describe("ParamMetadata", () => {
  describe("props", () => {
    let paramMetadata: ParamMetadata;
    before(() => {
      paramMetadata = new ParamMetadata({target: Test, propertyKey: "method", index: 0});
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;
      paramMetadata.useConverter = true;
      paramMetadata.useValidation = true;
    });
    it("should return the required value", () => {
      expect(paramMetadata.required)
        .to.be.a("boolean")
        .and.to.eq(true);
    });

    it("should return the expression", () => {
      expect(paramMetadata.expression)
        .to.be.a("string")
        .and.to.eq("test");
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

    it("should return useConverter", () => {
      expect(paramMetadata.useConverter).to.eq(true);
    });
    it("should return useConverter", () => {
      expect(paramMetadata.useValidation).to.eq(true);
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
      paramMetadata.useConverter = true;
      paramMetadata.useValidation = true;
      paramMetadata.service = ParamTypes.ERR;
    });

    it("should return the service", () => {
      expect(paramMetadata.service)
        .to.be.a("string")
        .to.eq(ParamTypes.ERR);
    });
  });

  describe("as a filter", () => {
    let paramMetadata: ParamMetadata;

    before(() => {
      paramMetadata = new ParamMetadata({target: Test, propertyKey: "method", index: 0});
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;
      paramMetadata.useConverter = true;
      paramMetadata.useValidation = true;
      paramMetadata.service = TestFilter;
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
});
