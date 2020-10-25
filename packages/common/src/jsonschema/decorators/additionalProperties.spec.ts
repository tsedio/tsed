import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {AdditionalProperties} from "./additionalProperties";

describe("@AdditionalProperties", () => {
  it("should accept additional properties", () => {
    @AdditionalProperties(true)
    class MyModel {
      [key: string]: any;
    }

    const schema = getJsonSchema(MyModel);

    expect(schema).to.deep.equal({
      additionalProperties: true,
      type: "object"
    });
  });
});
