import {ExclusiveMinimum, JsonSchema} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("ExclusiveMinimum", () => {
  describe("without explicit parameter", () => {
    before(() => {
      this.decorateStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      ExclusiveMinimum(10, true);
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store data", () => {
      this.schema.exclusiveMinimum.should.eq(10);
    });
  });
  describe("without explicit parameter", () => {
    before(() => {
      this.decorateStub = stubSchemaDecorator();
      this.schema = new JsonSchema();
      ExclusiveMinimum(10);
      this.decorateStub.getCall(0).args[0](this.schema);
    });
    after(() => {
      this.decorateStub.restore();
    });

    it("should store data", () => {
      this.schema.exclusiveMinimum.should.eq(10);
    });
  });
});
