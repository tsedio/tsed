import {expect} from "chai";
import {JsonSchema, MinItems} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("MinItems", () => {
  it("should store data", () => {
    const decorateStub = stubSchemaDecorator();
    const schema = new JsonSchema();

    MinItems(10);
    // @ts-ignore
    decorateStub.getCall(0).args[0](schema);

    expect(schema.minItems).to.eq(10);

    decorateStub.restore();
  });
  it("should throw an error when the given parameters is as negative integer", () => {
    let error: any;
    try {
      MinItems(-10);
    } catch (er) {
      error = er;
    }
    expect(error.message).to.deep.equal("The value of minItems MUST be a non-negative integer.");
  });
});
