import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Format} from "./format";

describe("Format", () => {
  it("should store data", () => {
    class Model {
      @Format("email")
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
