import {JsonSchema, Minimum} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("Minimum", () => {
  describe("when it used without exclusive value", () => {
    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Minimum(10);

      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);
      schema.minimum.should.eq(10);
      decorateStub.restore();
    });
  });
  describe("when it used with exclusive value", () => {
    before(() => {});
    after(() => {});

    it("should store exclusiveMinimum data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Minimum(10, true);
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);

      schema.exclusiveMinimum.should.eq(10);

      decorateStub.restore();
    });
  });
});
