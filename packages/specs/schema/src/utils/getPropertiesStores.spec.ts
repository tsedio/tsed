import {Email} from "../decorators/common/format.js";
import {Ignore} from "../decorators/common/ignore.js";
import {Property} from "../decorators/common/property.js";
import {Required} from "../decorators/common/required.js";
import {getProperties, getPropertiesStores} from "./getPropertiesStores.js";

class Base {
  @Property()
  id: string;

  @Email()
  email: string;
}

class Child extends Base {
  @Required()
  declare id: string;

  @Property()
  name: string;
}

describe("getProperties()", () => {
  it("should return properties", () => {
    const properties = getPropertiesStores(Child);
    expect(Array.from(properties.keys())).toEqual(["id", "name", "email"]);
    const properties2 = getPropertiesStores(Child);
    expect(Array.from(properties2.keys())).toEqual(["id", "name", "email"]);
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
      declare id: string;

      @Property()
      test: string;

      @Ignore()
      declare categoryId: string;
    }

    class Children2 extends Parent {
      @Property()
      declare id: string;

      @Property()
      test: string;

      @Property()
      declare categoryId: string;
    }

    describe("when is the Children class", () => {
      it("should have a property id metadata from Children class", () => {
        const result = getProperties(Children);
        expect(result.get("id")!.targetName).toBe("Children");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = getProperties(Children);
        expect(result.get("name")!.targetName).toBe("Parent");
      });

      it("should have a property test metadata from Parent class", () => {
        const result = getProperties(Children);
        expect(result.get("test")!.targetName).toBe("Children");
      });

      it("should not have a property categoryId metadata from Parent class", () => {
        const result = getProperties(Children);
        expect(result.has("categoryId")).toEqual(false);
      });
    });

    describe("when is the Children2 class", () => {
      it("should have a property id metadata from Children class", () => {
        const result = getProperties(Children2);
        expect(result.get("id")!.targetName).toBe("Children2");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = getProperties(Children2);
        expect(result.get("name")!.targetName).toBe("Parent");
      });

      it("should have a property test metadata from Parent class", () => {
        const result = getProperties(Children2);
        expect(result.get("test")!.targetName).toBe("Children2");
      });

      it("should have a property categoryId metadata from Parent class", () => {
        const result = getProperties(Children2);
        expect(result.get("categoryId")!.targetName).toBe("Children2");
      });
    });

    describe("when is the Parent class", () => {
      it("should have a property test metadata from Parent class", () => {
        const result = getProperties(Parent);
        expect(result.has("test")).toBe(false);
      });

      it("should have a property id metadata from Children class", () => {
        const result = getProperties(Parent);
        expect(result.get("id")!.targetName).toBe("Parent");
      });

      it("should have a property name metadata from Parent class", () => {
        const result = getProperties(Parent);
        expect(result.get("name")!.targetName).toBe("Parent");
      });

      it("should not have a property _id metadata from Parent class (because ignoreProperty is used)", () => {
        const result = getProperties(Parent);
        expect(result.has("_id")).toBe(false);
      });
      it("should not have a property categoryId metadata from Parent class", () => {
        const result = getProperties(Parent);
        expect(result.has("categoryId")).toBe(true);
      });
    });
  });
});
