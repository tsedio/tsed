import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Enum} from "../../../src/jsonschema";

describe("Enum", () => {
  it("should store data", () => {
    enum SomeEnum {
      ENUM_1 = "enum1",
      ENUM_2 = "enum2"
    }

    class Model {
      @Enum(SomeEnum)
      property: string;
    }

    expect(getJsonSchema(Model)).to.deep.eq({
      properties: {
        property: {
          enum: ["enum1", "enum2"],
          type: "string"
        }
      },
      type: "object"
    });
  });
});
