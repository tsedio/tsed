import {Property} from "@tsed/common";
import {expect} from "chai";
import {Default, PropertyRegistry} from "../../../src/jsonschema";

describe("Default", () => {
  class Test {
    @Property()
    property: String;
  }

  describe("value (0)", () => {
    before(() => {
      Default(0)(Test, "property");
      this.schema = PropertyRegistry.get(Test, "property").schema;
    });
    after(() => {
    });

    it("should store data", () => {
      expect(this.schema.default).to.eq(0);
    });
  });

  describe("value (false)", () => {
    before(() => {
      Default(false)(Test, "property");
      this.schema = PropertyRegistry.get(Test, "property").schema;
    });
    after(() => {
    });

    it("should store data", () => {
      expect(this.schema.default).to.eq(false);
    });
  });
});
