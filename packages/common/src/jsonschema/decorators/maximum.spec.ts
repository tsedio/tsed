import {JsonSchema, Maximum} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("Maximum", () => {
  describe("when it used without exclusive value", () => {
    before(() => {
      this.decorateStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      Maximum(10);
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store data", () => {
      this.schema.maximum.should.eq(10);
    });
  });
  describe("when it used with exclusive value", () => {
    before(() => {
      this.decorateStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      Maximum(10, true);
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store exclusiveMaximum data", () => {
      this.schema.exclusiveMaximum.should.eq(10);
    });
  });
});
