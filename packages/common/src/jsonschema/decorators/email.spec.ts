import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Email} from "../../../src/jsonschema";

describe("Email", () => {
  it("should store data", () => {
    class Model {
      @Email()
      property: string;
    }

    expect(getJsonSchema(Model)).to.deep.eq({
      properties: {
        property: {
          format: "email",
          type: "string"
        }
      },
      type: "object"
    });
  });
});
