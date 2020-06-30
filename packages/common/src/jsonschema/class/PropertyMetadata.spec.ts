import {Store} from "@tsed/core";
import {expect} from "chai";
import {PropertyMetadata} from "./PropertyMetadata";

class Test {
  method(arg1: any, arg2: any) {
  }
}

class Parent {
  id: string;
  name: string;
  categoryId: string;
}

class Children extends Parent {
  id: string;
  test: string;
  categoryId: string;
}

class Children2 extends Parent {
  id: string;
  test: string;
  categoryId: string;
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
  describe("get()", () => {
    before(() => {
    });

    it("should return the propertyMetadata", () => {
      const propertyMetadata = PropertyMetadata.get(Test, "test");
      expect(propertyMetadata).to.be.an.instanceof(PropertyMetadata);
    });
  });
  describe("getProperties()", () => {
    before(() => {
      PropertyMetadata.get(Children, "id");
      PropertyMetadata.get(Children, "test");
      PropertyMetadata.get(Children, "categoryId").ignoreProperty = true;
      PropertyMetadata.get(Children2, "id");
      PropertyMetadata.get(Children2, "test");
      PropertyMetadata.get(Children2, "categoryId");
      PropertyMetadata.get(Parent, "id");
      PropertyMetadata.get(Parent, "name");
      PropertyMetadata.get(Parent, "_id").ignoreProperty = true;
      PropertyMetadata.get(Parent, "categoryId");
    });

    describe("when is the Children class", () => {
      it("should have a property id metadata from Children class", () => {
        const result = PropertyMetadata.getProperties(Children);
        expect(result.get("id")!.targetName).to.eq("Children");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = PropertyMetadata.getProperties(Children);
        expect(result.get("name")!.targetName).to.eq("Parent");
      });

      it("should have a property test metadata from Parent class", () => {
        const result = PropertyMetadata.getProperties(Children);
        expect(result.get("test")!.targetName).to.eq("Children");
      });

      it("should not have a property categoryId metadata from Parent class", () => {
        const result = PropertyMetadata.getProperties(Children);
        expect(result.has("categoryId"))!.to.eq(false);
      });
    });

    describe("when is the Children2 class", () => {
      it("should have a property id metadata from Children class", () => {
        const result = PropertyMetadata.getProperties(Children2);
        expect(result.get("id")!.targetName).to.eq("Children2");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = PropertyMetadata.getProperties(Children2);
        expect(result.get("name")!.targetName).to.eq("Parent");
      });

      it("should have a property test metadata from Parent class", () => {
        const result = PropertyMetadata.getProperties(Children2);
        expect(result.get("test")!.targetName).to.eq("Children2");
      });

      it("should have a property categoryId metadata from Parent class", () => {
        const result = PropertyMetadata.getProperties(Children2);
        expect(result.get("categoryId")!.targetName).to.eq("Children2");
      });
    });

    describe("when is the Parent class", () => {
      before(() => {
      });
      it("should have a property name metadata from Parent class", () => {
        const result = PropertyMetadata.getProperties(Parent);
        expect(result.has("test")).to.eq(false);
      });

      it("should have a property id metadata from Children class", () => {
        const result = PropertyMetadata.getProperties(Parent);

        expect(result.get("id")!.targetName).to.eq("Parent");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = PropertyMetadata.getProperties(Parent);

        expect(result.get("name")!.targetName).to.eq("Parent");
      });

      it("should not have a property _id metadata from Parent class (because ignoreProperty is used)", () => {
        const result = PropertyMetadata.getProperties(Parent);

        expect(result.has("_id")).to.eq(false);
      });
      it("should not have a property categoryId metadata from Parent class", () => {
        const result = PropertyMetadata.getProperties(Parent);

        expect(result.has("categoryId")).to.eq(true);
      });
    });
  });
});
