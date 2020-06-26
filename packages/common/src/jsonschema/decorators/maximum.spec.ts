import {expect} from "chai";
import {JsonSchema, Maximum} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("Maximum", () => {
  describe("when it used without exclusive value", () => {
    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Maximum(10);
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);
      expect(schema.maximum).to.eq(10);
      decorateStub.restore();
    });
  });
  describe("when it used with exclusive value", () => {
    it("should store exclusiveMaximum data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Maximum(10, true);
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);
      expect(schema.exclusiveMaximum).to.eq(10);
      decorateStub.restore();
    });
  });
});
