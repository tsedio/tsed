import {expect} from "chai";
import {JsonSchema, MaxItems} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("MaxItems", () => {
  it("should store data", () => {
    const decorateStub = stubSchemaDecorator();
    const schema = new JsonSchema();

    MaxItems(10);
    // @ts-ignore
    decorateStub.getCall(0).args[0](schema);

    expect(schema.maxItems).to.eq(10);

    decorateStub.restore();
  });

  it("should throw an error when the given parameters is as negative integer", () => {
    let error: any;
    try {
      MaxItems(-10);
    } catch (er) {
      error = er;
    }
    expect(error.message).to.deep.equal("The value of maxItems MUST be a non-negative integer.");
  });
});
