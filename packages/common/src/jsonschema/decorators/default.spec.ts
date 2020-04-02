import {Property} from "@tsed/common";
import {expect} from "chai";
import {Default, PropertyRegistry} from "../../../src/jsonschema";

describe("Default", () => {
  class Test {
    @Property()
    property: String;
  }

  describe("value (0)", () => {
    it("should store data", () => {
      Default(0)(Test, "property");
      const schema = PropertyRegistry.get(Test, "property").schema;
      expect(schema.default).to.eq(0);
    });
  });

  describe("value (false)", () => {
    it("should store data", () => {
      Default(false)(Test, "property");
      const schema = PropertyRegistry.get(Test, "property").schema;
      expect(schema.default).to.eq(false);
    });
  });
});
