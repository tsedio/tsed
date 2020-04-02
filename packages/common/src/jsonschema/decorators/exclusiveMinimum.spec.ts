import {ExclusiveMinimum, JsonSchema} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("ExclusiveMinimum", () => {
  describe("without explicit parameter", () => {
    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      ExclusiveMinimum(10, true);

      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);

      schema.exclusiveMinimum.should.eq(10);

      decorateStub.restore();
    });
  });
  describe("without explicit parameter", () => {
    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      ExclusiveMinimum(10);
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);

      schema.exclusiveMinimum.should.eq(10);

      decorateStub.restore();
    });
  });
});
