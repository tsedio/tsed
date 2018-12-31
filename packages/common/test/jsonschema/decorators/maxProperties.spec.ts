import {JsonSchema, MaxProperties} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("MaxProperties", () => {
  before(() => {
    this.decorateStub = stubSchemaDecorator();
    this.schema = new JsonSchema();
    try {
      MaxProperties(-10);
    } catch (er) {
      this.error = er;
    }

    MaxProperties(10);
    this.decorateStub.getCall(0).args[0](this.schema);
  });
  after(() => {
    this.decorateStub.restore();
  });

  it("should store data", () => {
    this.schema.maxProperties.should.eq(10);
  });
  it("should throw an error when the given parameters is as negative integer", () => {
    this.error.message.should.deep.equal("The value of maxProperties MUST be a non-negative integer.");
  });
});
