import {AllowTypes, JsonSchema} from "../../../src/jsonschema";
import {stubSchemaDecorator} from "./utils";

describe("AllowTypes", () => {
  it("should store data", () => {
    const decoratorStub = stubSchemaDecorator();
    const schema = new JsonSchema();
    AllowTypes("string", "number");

    // @ts-ignore
    decoratorStub.getCall(0).args[0](schema);

    schema.type.should.deep.eq(["string", "number"]);

    decoratorStub.restore();
  });
});
