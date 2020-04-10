import {JsonSchema, MinProperties} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("MinProperties", () => {
  it("should store data", () => {
    const decorateStub = stubSchemaDecorator();
    const schema = new JsonSchema();
    MinProperties(10);
    // @ts-ignore
    decorateStub.getCall(0).args[0](schema);
    schema.minProperties.should.eq(10);
    decorateStub.restore();
  });
  it("should throw an error when the given parameters is as negative integer", () => {
    let error: any;
    try {
      MinProperties(-10);
    } catch (er) {
      error = er;
    }
    error.message.should.deep.equal("The value of minProperties MUST be a non-negative integer.");
  });
});
