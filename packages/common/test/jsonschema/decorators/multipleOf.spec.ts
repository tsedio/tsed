import {JsonSchema, MultipleOf} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("MultipleOf", () => {
  before(() => {
    this.decorateStub = stubSchemaDecorator();
    this.schema = new JsonSchema();
    try {
      MultipleOf(0);
    } catch (er) {
      this.error = er;
    }
    MultipleOf(10);
    this.decorateStub.getCall(0).args[0](this.schema);
  });
  after(() => {
    this.decorateStub.restore();
  });

  it("should store data", () => {
    this.schema.multipleOf.should.eq(10);
  });

  it("should throw an error when the given parameters is as negative integer", () => {
    this.error.message.should.deep.equal("The value of multipleOf MUST be a number, strictly greater than 0.");
  });
});
