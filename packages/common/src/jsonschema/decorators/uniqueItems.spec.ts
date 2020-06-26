import {expect} from "chai";
import {JsonSchema, UniqueItems} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("UniqueItems", () => {
  it("should store data", () => {
    const decorateStub = stubSchemaDecorator();
    const schema = new JsonSchema();
    UniqueItems(true);
    UniqueItems();
    // @ts-ignore
    decorateStub.getCall(0).args[0](schema);

    expect(schema.uniqueItems).to.eq(true);

    decorateStub.restore();
  });
});
