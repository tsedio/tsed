import {Allow, Ignore, Property, Required} from "@tsed/schema";
import {expect} from "chai";
import {PropertyMetadata} from "./PropertyMetadata";

describe("PropertyMetadata", () => {
  describe("required() and allowRequiredValues", () => {
    it("should return the required value", () => {
      class Test {
        @Required(true)
        @Allow(null, "")
        test: string;
      }

      const propertyMetadata = PropertyMetadata.get(Test, "test");
      propertyMetadata.required = true;
      propertyMetadata.type = Test;

      expect(propertyMetadata.required)
        .to.be.a("boolean")
        .and.to.eq(true);

      expect(propertyMetadata.collectionType).to.eq(undefined);
      expect(propertyMetadata.type).to.eq(Test);
      expect(propertyMetadata.collectionName).to.eq("");
      expect(propertyMetadata.typeName).to.eq("Test");
      expect(propertyMetadata.isCollection).to.eq(false);
      expect(propertyMetadata.ignoreProperty).to.eq(false);

      propertyMetadata.ignoreProperty = true;
      expect(propertyMetadata.ignoreProperty).to.eq(true);
    });
  });

  describe("isRequired", () => {
    describe("when property is required", () => {
      class Test {
        @Required(true)
        test: string;
      }

      let propertyMetadata: PropertyMetadata;

      before(() => {
        propertyMetadata = PropertyMetadata.get(Test, "test");
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
      it("should validate the required values", () => {
        class Test {
          @Required()
          @Allow(null)
          test: string;
        }

        let propertyMetadata: PropertyMetadata;
        propertyMetadata = PropertyMetadata.get(Test, "test");

        expect(propertyMetadata.allowedRequiredValues).to.deep.eq([null]);
        expect(propertyMetadata.isRequired(0)).to.be.false;
        expect(propertyMetadata.isRequired("")).to.be.true;
        expect(propertyMetadata.isRequired(null)).to.be.false;
        expect(propertyMetadata.isRequired(undefined)).to.be.true;
      });

      it("should validate the required values (2)", () => {
        class Test {
          @Allow("")
          test: string;
        }

        let propertyMetadata: PropertyMetadata;
        propertyMetadata = PropertyMetadata.get(Test, "test");

        expect(propertyMetadata.allowedRequiredValues).to.deep.eq([""]);
        expect(propertyMetadata.isRequired(0)).to.be.false;
        expect(propertyMetadata.isRequired("")).to.be.false;
        expect(propertyMetadata.isRequired(null)).to.be.true;
        expect(propertyMetadata.isRequired(undefined)).to.be.true;
      });

      it("should validate the required values (3)", () => {
        class Test {
          @Allow("")
          test: string;
        }

        let propertyMetadata: PropertyMetadata;
        propertyMetadata = PropertyMetadata.get(Test, "test");

        expect(propertyMetadata.allowedRequiredValues).to.deep.eq([""]);
        expect(propertyMetadata.isRequired(0)).to.be.false;
        expect(propertyMetadata.isRequired("")).to.be.false;
        expect(propertyMetadata.isRequired(null)).to.be.true;
        expect(propertyMetadata.isRequired(undefined)).to.be.true;
      });
    });

    describe("when property is not required", () => {
      it("should validate values", () => {
        class Test {
          @Required(false)
          test: string;
        }

        const propertyMetadata = PropertyMetadata.get(Test, "test");
        propertyMetadata.required = false;
        expect(propertyMetadata.isRequired(0)).to.be.false;
        expect(propertyMetadata.isRequired("")).to.be.false;
        expect(propertyMetadata.isRequired(null)).to.be.false;
        expect(propertyMetadata.isRequired(undefined)).to.be.false;
      });
    });
  });

  describe("get()", () => {
    class Test {
      test: string;
    }

    it("should return the propertyMetadata", () => {
      const propertyMetadata = PropertyMetadata.get(Test, "test");
      expect(propertyMetadata).to.be.an.instanceof(PropertyMetadata);
    });
  });

  describe("getProperties()", () => {
    class Parent {
      @Ignore()
      _id: string;

      @Property()
      id: string;

      @Property()
      name: string;

      @Property()
      categoryId: string;
    }

    class Children extends Parent {
      @Property()
      id: string;

      @Property()
      test: string;

      @Ignore()
      categoryId: string;
    }

    class Children2 extends Parent {
      @Property()
      id: string;

      @Property()
      test: string;

      @Property()
      categoryId: string;
    }

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
