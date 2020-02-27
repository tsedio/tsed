import {JsonSchema, Minimum} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("Minimum", () => {
  describe("when it used without exclusive value", () => {
    before(() => {
      this.decorateStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      Minimum(10);
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store data", () => {
      this.schema.minimum.should.eq(10);
    });
  });
  describe("when it used with exclusive value", () => {
    before(() => {
      this.decorateStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      Minimum(10, true);
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store exclusiveMinimum data", () => {
      this.schema.exclusiveMinimum.should.eq(10);
    });
  });
});
