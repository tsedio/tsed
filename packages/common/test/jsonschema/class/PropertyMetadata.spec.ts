import {Store} from "@tsed/core";
import {expect} from "chai";
import {PropertyMetadata} from "../../../src/jsonschema";

class Test {
  method(arg1: any, arg2: any) {
  }
}

describe("PropertyMetadata", () => {
  describe("getter / setter", () => {
    let propertyMetadata: PropertyMetadata;

    before(() => {
      propertyMetadata = new PropertyMetadata(Test, "test");
      propertyMetadata.required = true;
      propertyMetadata.type = Test;
      propertyMetadata.allowedRequiredValues = [null, ""];
    });

    it("should return the required value", () => {
      expect(propertyMetadata.required)
        .to.be.a("boolean")
        .and.to.eq(true);
    });

    it("should return collectionType", () => {
      expect(propertyMetadata.collectionType).to.eq(undefined);
    });

    it("should return type", () => {
      expect(propertyMetadata.type).to.eq(Test);
    });

    it("should return collectionName", () => {
      expect(propertyMetadata.collectionName).to.eq("");
    });

    it("should return typeName", () => {
      expect(propertyMetadata.typeName).to.eq("Test");
    });

    it("should return isCollection", () => {
      expect(propertyMetadata.isCollection).to.eq(false);
    });

    it("should return allowedRequiredValues", () => {
      expect(propertyMetadata.allowedRequiredValues).to.deep.eq([null, ""]);
    });

    it("should return a Store", () => {
      expect(propertyMetadata.store).to.be.an.instanceOf(Store);
    });

    it("should return schema", () => {
      expect(propertyMetadata.schema.toJSON()).to.deep.eq({$ref: "#/definitions/Test"});
    });
  });

  describe("isRequired", () => {
    describe("when property is required", () => {
      let propertyMetadata: PropertyMetadata;

      before(() => {
        propertyMetadata = new PropertyMetadata(Test, "test");
        propertyMetadata.allowedRequiredValues = [];
        propertyMetadata.required = true;
      });
      it("should return false (value 0)", () => {
        expect(propertyMetadata.isRequired(0)).to.be.false;
      });

      it("should return true (value '')", () => {
        expect(propertyMetadata.isRequired("")).to.be.true;
      });
      it("should return true (value null)", () => {
        expect(propertyMetadata.isRequired(null)).to.be.true;
      });
      it("should return true (value undefined)", () => {
        expect(propertyMetadata.isRequired(undefined)).to.be.true;
      });
    });

    describe("when property is required and have allowed values", () => {
      let propertyMetadata: PropertyMetadata;

      before(() => {
        propertyMetadata = new PropertyMetadata(Test, "test");
        propertyMetadata.allowedRequiredValues = [null];
        propertyMetadata.required = true;
      });
      it("should return false (value 0)", () => {
        expect(propertyMetadata.isRequired(0)).to.be.false;
      });

      it("should return true (value '')", () => {
        expect(propertyMetadata.isRequired("")).to.be.true;
      });
      it("should return false (value null)", () => {
        expect(propertyMetadata.isRequired(null)).to.be.false;
      });
      it("should return true (value undefined)", () => {
        expect(propertyMetadata.isRequired(undefined)).to.be.true;
      });
    });

    describe("when property is not required", () => {
      let propertyMetadata: PropertyMetadata;

      before(() => {
        propertyMetadata = new PropertyMetadata(Test, "test");
        propertyMetadata.allowedRequiredValues = [];
        propertyMetadata.required = false;
      });
      it("should return false (value 0)", () => {
        expect(propertyMetadata.isRequired(0)).to.be.false;
      });

      it("should return false (value '')", () => {
        expect(propertyMetadata.isRequired("")).to.be.false;
      });
      it("should return false (value null)", () => {
        expect(propertyMetadata.isRequired(null)).to.be.false;
      });
      it("should return false (value undefined)", () => {
        expect(propertyMetadata.isRequired(undefined)).to.be.false;
      });
    });
  });
});
