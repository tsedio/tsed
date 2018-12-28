import {expect} from "chai";
import {EntityDescription} from "../../src";

class Test {
  method(arg1: any, arg2: any) {
  }
}

class EntityTest extends EntityDescription {
}

describe("EntityDescription", () => {
  describe("getter / setter", () => {
    before(() => {
      this.entityDescription = new EntityTest(Test, "test", 0);
      this.entityDescription.required = true;
      this.entityDescription.type = Test;
      this.entityDescription.allowedRequiredValues = [null, ""];
    });

    it("should return the required value", () => {
      expect(this.entityDescription.required)
        .to.be.a("boolean")
        .and.to.eq(true);
    });

    it("should return collectionType", () => {
      expect(this.entityDescription.collectionType).to.eq(undefined);
    });

    it("should return type", () => {
      expect(this.entityDescription.type).to.eq(Test);
    });

    it("should return collectionName", () => {
      expect(this.entityDescription.collectionName).to.eq("");
    });

    it("should return typeName", () => {
      expect(this.entityDescription.typeName).to.eq("Test");
    });

    it("should return isCollection", () => {
      expect(this.entityDescription.isCollection).to.eq(false);
    });

    it("should return allowedRequiredValues", () => {
      expect(this.entityDescription.allowedRequiredValues).to.deep.eq([null, ""]);
    });

    it("should return false (isDate)", () => {
      expect(this.entityDescription.isDate).to.be.false;
    });

    it("should return false (isPrimitive)", () => {
      expect(this.entityDescription.isPrimitive).to.be.false;
    });
    it("should return false (isObject)", () => {
      expect(this.entityDescription.isObject).to.be.false;
    });
  });
});
