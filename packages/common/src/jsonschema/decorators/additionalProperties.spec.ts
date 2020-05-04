import {JsonSchemesRegistry} from "@tsed/common";
import {expect} from "chai";
import {AdditionalProperties} from "./additionalProperties";

describe("@AdditionalProperties", () => {
  it("should accept additional properties", () => {
    @AdditionalProperties(true)
    class MyModel {
      [key: string]: any;
    }

    const schema = JsonSchemesRegistry.getSchemaDefinition(MyModel);

    expect(schema).to.deep.equal({
      additionalProperties: true,
      definitions: {}
    });
  });
});
