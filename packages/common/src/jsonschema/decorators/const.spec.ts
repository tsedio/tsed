import {Const, JsonSchema} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("Const", () => {
  describe("when const is a string", () => {
    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Const("0");
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);
      schema.const.should.eq("0");
      decorateStub.restore();
    });
  });

  describe("when const is a boolean", () => {
    it("should store data", () => {
      const decorateStub = stubSchemaDecorator();
      const schema = new JsonSchema();
      Const(false);
      // @ts-ignore
      decorateStub.getCall(0).args[0](schema);
      schema.const.should.eq(false);
      decorateStub.restore();
    });
  });
});
