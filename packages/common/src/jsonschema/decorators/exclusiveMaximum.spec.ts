import {expect} from "chai";
import {ExclusiveMaximum, JsonSchema} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("ExclusiveMaximum", () => {
  describe("with explicit parameter", () => {
    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      ExclusiveMaximum(10, true);

      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);

      expect(schema.exclusiveMaximum).to.eq(10);
      decorateStub.restore();
    });
  });

  describe("without explicit parameter", () => {
    before(() => {});
    after(() => {});

    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      ExclusiveMaximum(10);
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);

      expect(schema.exclusiveMaximum).to.eq(10);
      decorateStub.restore();
    });
  });
});
