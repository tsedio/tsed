import {expect} from "chai";
import {JsonSchema, MultipleOf} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("MultipleOf", () => {
  it("should store data", () => {
    const decorateStub = stubSchemaDecorator();
    const schema = new JsonSchema();
    MultipleOf(10);
    // @ts-ignore
    decorateStub.getCall(0).args[0](schema);

    expect(schema.multipleOf).to.eq(10);
    decorateStub.restore();
  });

  it("should throw an error when the given parameters is as negative integer", () => {
    let error: any;
    try {
      MultipleOf(0);
    } catch (er) {
      error = er;
    }
    expect(error.message).to.deep.equal("The value of multipleOf MUST be a number, strictly greater than 0.");
  });
});
