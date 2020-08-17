import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Name} from "./propertyName";

describe("@Name", () => {
  it("should create a propertyMetadata", () => {
    // WHEN
    class Model {
      @Name("num2")
      num: number;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num2: {
          type: "number"
        }
      },
      type: "object"
    });
  });
});
