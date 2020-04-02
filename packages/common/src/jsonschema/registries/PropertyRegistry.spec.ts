import {expect} from "chai";
import {PropertyMetadata, PropertyRegistry} from "../../../src/jsonschema";

class Test {}

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
    before(() => {});

    it("should return the propertyMetadata", () => {
      const propertyMetadata = PropertyRegistry.get(Test, "test");
      expect(propertyMetadata).to.be.an.instanceof(PropertyMetadata);
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
      it("should have a property id metadata from Children class", () => {
        const result = PropertyRegistry.getProperties(Children);
        expect(result.get("id")!.targetName).to.eq("Children");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = PropertyRegistry.getProperties(Children);
        expect(result.get("name")!.targetName).to.eq("Parent");
      });

      it("should have a property test metadata from Parent class", () => {
        const result = PropertyRegistry.getProperties(Children);
        expect(result.get("test")!.targetName).to.eq("Children");
      });

      it("should not have a property categoryId metadata from Parent class", () => {
        const result = PropertyRegistry.getProperties(Children);
        expect(result.has("categoryId"))!.to.eq(false);
      });
    });

    describe("when is the Children2 class", () => {
      it("should have a property id metadata from Children class", () => {
        const result = PropertyRegistry.getProperties(Children2);
        expect(result.get("id")!.targetName).to.eq("Children2");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = PropertyRegistry.getProperties(Children2);
        expect(result.get("name")!.targetName).to.eq("Parent");
      });

      it("should have a property test metadata from Parent class", () => {
        const result = PropertyRegistry.getProperties(Children2);
        expect(result.get("test")!.targetName).to.eq("Children2");
      });

      it("should have a property categoryId metadata from Parent class", () => {
        const result = PropertyRegistry.getProperties(Children2);
        expect(result.get("categoryId")!.targetName).to.eq("Children2");
      });
    });

    describe("when is the Parent class", () => {
      before(() => {});
      it("should have a property name metadata from Parent class", () => {
        const result = PropertyRegistry.getProperties(Parent);
        expect(result.has("test")).to.eq(false);
      });

      it("should have a property id metadata from Children class", () => {
        const result = PropertyRegistry.getProperties(Parent);

        expect(result.get("id")!.targetName).to.eq("Parent");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = PropertyRegistry.getProperties(Parent);

        expect(result.get("name")!.targetName).to.eq("Parent");
      });

      it("should not have a property _id metadata from Parent class (because ignoreProperty is used)", () => {
        const result = PropertyRegistry.getProperties(Parent);

        expect(result.has("_id")).to.eq(false);
      });
      it("should not have a property categoryId metadata from Parent class", () => {
        const result = PropertyRegistry.getProperties(Parent);

        expect(result.has("categoryId")).to.eq(true);
      });
    });
  });
});
