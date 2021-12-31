import {AdditionalProperties, getJsonSchema, Property} from "@tsed/schema";

describe("AdditionalProperties", () => {
  it("should declare additional properties", () => {
    @AdditionalProperties(true)
    class Model {
      @Property()
      id: string;

      [key: string]: any;
    }

    expect(getJsonSchema(Model)).toEqual({
      additionalProperties: true,
      properties: {
        id: {
          type: "string"
        }
      },
      type: "object"
    });
  });
});
