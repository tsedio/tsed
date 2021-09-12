import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {Default} from "./default";

describe("@Default", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @Default("10")
      num: string = "10";

      constructor() {}
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num: {
          default: "10",
          type: "string"
        }
      },
      type: "object"
    });
  });
});
