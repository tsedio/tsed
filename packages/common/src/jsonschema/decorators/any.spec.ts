import {expect} from "chai";
import {Any, JsonSchema} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("Any", () => {
  it("should store data", () => {
    const decoratorStub = stubSchemaDecorator();
    const schema = new JsonSchema();
    Any();

    // @ts-ignore
    decoratorStub.getCall(0).args[0](schema);

    expect(schema.type).to.deep.eq(["integer", "number", "string", "boolean", "array", "object", "null"]);
    decoratorStub.restore();
  });
});
