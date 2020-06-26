import {expect} from "chai";
import {JsonSchema, MaxLength} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("MaxLength", () => {
  it("should store data", () => {
    const decorateStub = stubSchemaDecorator();
    const schema = new JsonSchema();

    MaxLength(10);
    // @ts-ignore
    decorateStub.getCall(0).args[0](schema);

    expect(schema.maxLength).to.eq(10);
    decorateStub.restore();
  });
  it("should throw an error when the given parameters is as negative integer", () => {
    let error: any;
    try {
      MaxLength(-10);
    } catch (er) {
      error = er;
    }
    expect(error.message).to.deep.equal("The value of maxLength MUST be a non-negative integer.");
  });
});
