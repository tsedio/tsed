import {expect} from "chai";
import {PropertyMetadata, PropertyRegistry} from "../../../src/jsonschema";

class Test {
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

describe("PropertyRegistry", () => {
  describe("get()", () => {
    before(() => {
      this.propertyMetadata = PropertyRegistry.get(Test, "test");
    });

    it("should return the propertyMetadata", () => {
      expect(this.propertyMetadata).to.be.an.instanceof(PropertyMetadata);
    });
  });
  describe("getProperties()", () => {
    before(() => {
      PropertyRegistry.get(Children, "id");
      PropertyRegistry.get(Children, "test");
      PropertyRegistry.get(Children, "categoryId").ignoreProperty = true;
      PropertyRegistry.get(Children2, "id");
      PropertyRegistry.get(Children2, "test");
      PropertyRegistry.get(Children2, "categoryId");
      PropertyRegistry.get(Parent, "id");
      PropertyRegistry.get(Parent, "name");
      PropertyRegistry.get(Parent, "_id").ignoreProperty = true;
      PropertyRegistry.get(Parent, "categoryId");
    });

    describe("when is the Children class", () => {
      before(() => {
        this.result = PropertyRegistry.getProperties(Children);
      });
      it("should have a property id metadata from Children class", () => {
        expect(this.result.get("id").targetName).to.eq("Children");
      });

      it("should have a property name metadata from Parent class", () => {
        expect(this.result.get("name").targetName).to.eq("Parent");
      });

      it("should have a property test metadata from Parent class", () => {
        expect(this.result.get("test").targetName).to.eq("Children");
      });

      it("should not have a property categoryId metadata from Parent class", () => {
        expect(this.result.has("categoryId")).to.eq(false);
      });
    });

    describe("when is the Children2 class", () => {
      before(() => {
        this.result = PropertyRegistry.getProperties(Children2);
      });
      it("should have a property id metadata from Children class", () => {
        expect(this.result.get("id").targetName).to.eq("Children2");
      });

      it("should have a property name metadata from Parent class", () => {
        expect(this.result.get("name").targetName).to.eq("Parent");
      });

      it("should have a property test metadata from Parent class", () => {
        expect(this.result.get("test").targetName).to.eq("Children2");
      });

      it("should have a property categoryId metadata from Parent class", () => {
        expect(this.result.get("categoryId").targetName).to.eq("Children2");
      });
    });

    describe("when is the Parent class", () => {
      before(() => {
        this.result = PropertyRegistry.getProperties(Parent);
      });
      it("should have a property name metadata from Parent class", () => {
        expect(this.result.has("test")).to.eq(false);
      });

      it("should have a property id metadata from Children class", () => {
        expect(this.result.get("id").targetName).to.eq("Parent");
      });

      it("should have a property name metadata from Parent class", () => {
        expect(this.result.get("name").targetName).to.eq("Parent");
      });

      it("should not have a property _id metadata from Parent class (because ignoreProperty is used)", () => {
        expect(this.result.has("_id")).to.eq(false);
      });
      it("should not have a property categoryId metadata from Parent class", () => {
        expect(this.result.has("categoryId")).to.eq(true);
      });
    });
  });
});
