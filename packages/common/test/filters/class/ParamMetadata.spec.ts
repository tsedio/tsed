import {Store} from "@tsed/core";
import {expect} from "chai";
import {ParamMetadata} from "../../../src/filters";
import {EXPRESS_ERR} from "../../../src/filters/constants";

class Test {
  method(arg1: any, arg2: any) {
  }
}

class TestFilter {
}

describe("ParamMetadata", () => {
  before(() => {
    this.paramMetadata = new ParamMetadata(Test, "method", 0);
    this.paramMetadata.required = true;
    this.paramMetadata.expression = "test";
    this.paramMetadata.type = Test;
    this.paramMetadata.useConverter = true;
    this.paramMetadata.useValidation = true;
  });

  it("should return the required value", () => {
    expect(this.paramMetadata.required)
      .to.be.a("boolean")
      .and.to.eq(true);
  });

  it("should return the expression", () => {
    expect(this.paramMetadata.expression)
      .to.be.a("string")
      .and.to.eq("test");
  });

  it("should return collectionType", () => {
    expect(this.paramMetadata.collectionType).to.eq(undefined);
  });

  it("should return type", () => {
    expect(this.paramMetadata.type).to.eq(Test);
  });

  it("should return index", () => {
    expect(this.paramMetadata.index).to.eq(0);
  });

  it("should return useConverter", () => {
    expect(this.paramMetadata.useConverter).to.eq(true);
  });
  it("should return useConverter", () => {
    expect(this.paramMetadata.useValidation).to.eq(true);
  });

  it("should return store", () => {
    expect(this.paramMetadata.store).to.be.an.instanceof(Store);
  });

  describe("as a service", () => {
    before(() => {
      this.paramMetadata.service = EXPRESS_ERR;
    });

    it("should return the service", () => {
      expect(this.paramMetadata.service)
        .to.be.a("symbol")
        .to.eq(EXPRESS_ERR);
    });

    it("should return the service's name", () => {
      expect(this.paramMetadata.name)
        .to.be.a("string")
        .to.eq("err");
    });
  });

  describe("as a filter", () => {
    before(() => {
      this.paramMetadata.service = TestFilter;
    });

    it("should return the service", () => {
      expect(this.paramMetadata.service).to.eq(TestFilter);
    });

    it("should return the service's name", () => {
      expect(this.paramMetadata.name)
        .to.be.a("string")
        .to.eq("TestFilter");
    });
  });

  describe("toJson()", () => {
    describe("with service", () => {
      before(() => {
        this.paramMetadata = new ParamMetadata(Test, "method", 0);
        this.paramMetadata.required = true;
        this.paramMetadata.expression = "test";
        this.paramMetadata.type = Test;
        this.paramMetadata.useConverter = true;
        this.paramMetadata.service = TestFilter;
      });

      it("should return the JSON", () => {
        expect(JSON.stringify(this.paramMetadata)).to.eq(
          `{"service":"TestFilter","name":"TestFilter","expression":"test","required":true,"use":"Test","baseType":""}`
        );
      });
    });

    describe("with collectionType != type", () => {
      before(() => {
        this.paramMetadata = new ParamMetadata(Test, "method", 0);
        this.paramMetadata.required = true;
        this.paramMetadata.expression = "test";
        this.paramMetadata._collectionType = Array;
        this.paramMetadata.type = Test;
        this.paramMetadata.useConverter = true;
        this.paramMetadata.service = TestFilter;
      });

      it("should return the JSON", () => {
        expect(JSON.stringify(this.paramMetadata)).to.eq(
          `{"service":"TestFilter","name":"TestFilter","expression":"test","required":true,"use":"Test","baseType":"Array"}`
        );
      });
    });

    describe("without collectionType and type", () => {
      before(() => {
        this.paramMetadata = new ParamMetadata(Test, "method", 0);
        this.paramMetadata.required = true;
        this.paramMetadata.expression = "test";
        this.paramMetadata.service = TestFilter;
        this.paramMetadata.type = TestFilter;
      });

      it("should return the JSON", () => {
        expect(JSON.stringify(this.paramMetadata)).to.eq(
          `{"service":"TestFilter","name":"TestFilter","expression":"test","required":true,"use":"TestFilter","baseType":""}`
        );
      });
    });
  });

  describe("isValidRequiredValue", () => {
    describe("when property is required", () => {
      before(() => {
        this.paramMetadata = new ParamMetadata(Test, "test", 0);
        this.paramMetadata.allowedRequiredValues = [];
        this.paramMetadata.required = true;
      });
      it("should return false (value 0)", () => {
        expect(this.paramMetadata.isValidRequiredValue(0)).to.be.true;
      });

      it("should return true (value '')", () => {
        expect(this.paramMetadata.isValidRequiredValue("")).to.be.false;
      });
      it("should return true (value null)", () => {
        expect(this.paramMetadata.isValidRequiredValue(null)).to.be.false;
      });
      it("should return true (value undefined)", () => {
        expect(this.paramMetadata.isValidRequiredValue(undefined)).to.be.false;
      });
    });

    describe("when property is required and have allowed values", () => {
      before(() => {
        this.paramMetadata = new ParamMetadata(Test, "test", 0);
        this.paramMetadata.allowedRequiredValues = [null];
        this.paramMetadata.required = true;
      });
      it("should return false (value 0)", () => {
        expect(this.paramMetadata.isValidRequiredValue(0)).to.be.true;
      });

      it("should return true (value '')", () => {
        expect(this.paramMetadata.isValidRequiredValue("")).to.be.false;
      });
      it("should return true (value null)", () => {
        expect(this.paramMetadata.isValidRequiredValue(null)).to.be.true;
      });
      it("should return true (value undefined)", () => {
        expect(this.paramMetadata.isValidRequiredValue(undefined)).to.be.false;
      });
    });

    describe("when property is not required", () => {
      before(() => {
        this.paramMetadata = new ParamMetadata(Test, "test", 0);
        this.paramMetadata.allowedRequiredValues = [];
        this.paramMetadata.required = false;
      });
      it("should return false (value 0)", () => {
        expect(this.paramMetadata.isValidRequiredValue(0)).to.be.true;
      });

      it("should return true (value '')", () => {
        expect(this.paramMetadata.isValidRequiredValue("")).to.be.true;
      });
      it("should return true (value null)", () => {
        expect(this.paramMetadata.isValidRequiredValue(null)).to.be.true;
      });
      it("should return true (value undefined)", () => {
        expect(this.paramMetadata.isValidRequiredValue(undefined)).to.be.true;
      });
    });
  });

  describe("isRequired", () => {
    describe("when property is required", () => {
      before(() => {
        this.paramMetadata = new ParamMetadata(Test, "test");
        this.paramMetadata.allowedRequiredValues = [];
        this.paramMetadata.required = true;
      });
      it("should return false (value 0)", () => {
        expect(this.paramMetadata.isRequired(0)).to.be.false;
      });

      it("should return true (value '')", () => {
        expect(this.paramMetadata.isRequired("")).to.be.true;
      });
      it("should return true (value null)", () => {
        expect(this.paramMetadata.isRequired(null)).to.be.true;
      });
      it("should return true (value undefined)", () => {
        expect(this.paramMetadata.isRequired(undefined)).to.be.true;
      });
    });

    describe("when property is required and have allowed values", () => {
      before(() => {
        this.paramMetadata = new ParamMetadata(Test, "test");
        this.paramMetadata.allowedRequiredValues = [null];
        this.paramMetadata.required = true;
      });
      it("should return false (value 0)", () => {
        expect(this.paramMetadata.isRequired(0)).to.be.false;
      });

      it("should return true (value '')", () => {
        expect(this.paramMetadata.isRequired("")).to.be.true;
      });
      it("should return false (value null)", () => {
        expect(this.paramMetadata.isRequired(null)).to.be.false;
      });
      it("should return true (value undefined)", () => {
        expect(this.paramMetadata.isRequired(undefined)).to.be.true;
      });
    });

    describe("when property is not required", () => {
      before(() => {
        this.paramMetadata = new ParamMetadata(Test, "test");
        this.paramMetadata.allowedRequiredValues = [];
        this.paramMetadata.required = false;
      });
      it("should return false (value 0)", () => {
        expect(this.paramMetadata.isRequired(0)).to.be.false;
      });

      it("should return false (value '')", () => {
        expect(this.paramMetadata.isRequired("")).to.be.false;
      });
      it("should return false (value null)", () => {
        expect(this.paramMetadata.isRequired(null)).to.be.false;
      });
      it("should return false (value undefined)", () => {
        expect(this.paramMetadata.isRequired(undefined)).to.be.false;
      });
    });
  });
});
