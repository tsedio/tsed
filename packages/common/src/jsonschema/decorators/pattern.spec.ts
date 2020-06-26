import {expect} from "chai";
import {JsonSchema, Pattern} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("Pattern", () => {
  describe("with string pattern", () => {
    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Pattern("patternValue");
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);
      expect(schema.pattern).to.eq("patternValue");
      decorateStub.restore();
    });
  });
  describe("with regexp pattern", () => {
    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Pattern(/abc/);

      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);
      expect(schema.pattern).to.eq("abc");
      decorateStub.restore();
    });
  });
});
