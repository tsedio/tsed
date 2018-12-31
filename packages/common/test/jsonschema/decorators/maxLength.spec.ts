import {JsonSchema, MaxLength} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("MaxLength", () => {
  before(() => {
    this.decorateStub = stubSchemaDecorator();
    this.schema = new JsonSchema();

    try {
      MaxLength(-10);
    } catch (er) {
      this.error = er;
    }

    MaxLength(10);
    this.decorateStub.getCall(0).args[0](this.schema);
  });
  after(() => {
    this.decorateStub.restore();
  });

  it("should store data", () => {
    this.schema.maxLength.should.eq(10);
  });
  it("should throw an error when the given parameters is as negative integer", () => {
    this.error.message.should.deep.equal("The value of maxLength MUST be a non-negative integer.");
  });
});
