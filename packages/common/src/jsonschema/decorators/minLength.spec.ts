import {JsonSchema, MinLength} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("MinLength", () => {
  it("should store data", () => {
    const decorateStub = stubSchemaDecorator();
    const schema = new JsonSchema();
    MinLength(10);
    // @ts-ignore
    decorateStub.getCall(0).args[0](schema);

    schema.minLength.should.eq(10);
    decorateStub.restore();
  });
  it("should throw an error when the given parameters is as negative integer", () => {
    let error: any;
    try {
      MinLength(-10);
    } catch (er) {
      error = er;
    }

    error.message.should.deep.equal("The value of minLength MUST be a non-negative integer.");
  });
});
