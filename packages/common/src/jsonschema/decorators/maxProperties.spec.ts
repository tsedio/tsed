import {JsonSchema, MaxProperties} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("MaxProperties", () => {
  it("should store data", () => {
    const decorateStub = stubSchemaDecorator();
    const schema = new JsonSchema();

    MaxProperties(10);
    // @ts-ignore
    decorateStub.getCall(0).args[0](schema);

    schema.maxProperties.should.eq(10);

    decorateStub.restore();
  });
  it("should throw an error when the given parameters is as negative integer", () => {
    let error: any;
    try {
      MaxProperties(-10);
    } catch (er) {
      error = er;
    }

    error.message.should.deep.equal("The value of maxProperties MUST be a non-negative integer.");
  });
});
