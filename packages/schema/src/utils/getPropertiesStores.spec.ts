import {expect} from "chai";
import {Email, Ignore, Property, Required} from "../index";
import {getProperties, getPropertiesStores} from "./getPropertiesStores";

class Base {
  @Property()
  id: string;

  @Email()
  email: string;
}

class Child extends Base {
  @Required()
  id: string;

  @Property()
  name: string;
}

describe("getProperties()", () => {
  it("should return properties", () => {
    const properties = getPropertiesStores(Child);
    expect(Array.from(properties.keys())).to.deep.eq(["id", "name", "email"]);
    const properties2 = getPropertiesStores(Child);
    expect(Array.from(properties2.keys())).to.deep.eq(["id", "name", "email"]);
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
        const result = getProperties(Children);
        expect(result.get("id")!.targetName).to.eq("Children");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = getProperties(Children);
        expect(result.get("name")!.targetName).to.eq("Parent");
      });

      it("should have a property test metadata from Parent class", () => {
        const result = getProperties(Children);
        expect(result.get("test")!.targetName).to.eq("Children");
      });

      it("should not have a property categoryId metadata from Parent class", () => {
        const result = getProperties(Children);
        expect(result.has("categoryId"))!.to.eq(false);
      });
    });

    describe("when is the Children2 class", () => {
      it("should have a property id metadata from Children class", () => {
        const result = getProperties(Children2);
        expect(result.get("id")!.targetName).to.eq("Children2");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = getProperties(Children2);
        expect(result.get("name")!.targetName).to.eq("Parent");
      });

      it("should have a property test metadata from Parent class", () => {
        const result = getProperties(Children2);
        expect(result.get("test")!.targetName).to.eq("Children2");
      });

      it("should have a property categoryId metadata from Parent class", () => {
        const result = getProperties(Children2);
        expect(result.get("categoryId")!.targetName).to.eq("Children2");
      });
    });

    describe("when is the Parent class", () => {
      it("should have a property name metadata from Parent class", () => {
        const result = getProperties(Parent);
        expect(result.has("test")).to.eq(false);
      });

      it("should have a property id metadata from Children class", () => {
        const result = getProperties(Parent);
        expect(result.get("id")!.targetName).to.eq("Parent");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = getProperties(Parent);
        expect(result.get("name")!.targetName).to.eq("Parent");
      });

      it("should not have a property _id metadata from Parent class (because ignoreProperty is used)", () => {
        const result = getProperties(Parent);
        expect(result.has("_id")).to.eq(false);
      });
      it("should not have a property categoryId metadata from Parent class", () => {
        const result = getProperties(Parent);
        expect(result.has("categoryId")).to.eq(true);
      });
    });
  });
});
