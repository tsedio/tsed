import {expect} from "chai";
import {Email, JsonSchema} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("Email", () => {
  it("should store data", () => {
    const decorateStub = stubSchemaDecorator();
    const schema = new JsonSchema();
    Email();

    // @ts-ignore
    decorateStub.getCall(0).args[0](schema);
    expect(schema.format).to.eq("email");

    decorateStub.restore();
  });
});
