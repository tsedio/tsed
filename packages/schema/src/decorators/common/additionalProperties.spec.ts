import {AdditionalProperties, getJsonSchema, Property} from "@tsed/schema";
import {expect} from "chai";

describe("AdditionalProperties", () => {
  it("should declare additional properties", () => {
    @AdditionalProperties(true)
    class Model {
      @Property()
      id: string;

      [key: string]: any;
    }

    expect(getJsonSchema(Model)).to.deep.eq({
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
      },
      type: "object",
    });
  });
});
