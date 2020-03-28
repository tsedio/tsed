import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {Any} from "./any";

describe("@Any", () => {
  it("should declare any prop", () => {
    // WHEN
    class Model {
      @Any()
      num: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num: {
          type: ["integer", "number", "string", "boolean", "array", "object", "null"]
        }
      },
      type: "object"
    });
  });
  it("should declare any prop (with list)", () => {
    // WHEN
    class Model {
      @Any(String, Number, Boolean)
      num: any;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num: {
          type: ["string", "number", "boolean"]
        }
      },
      type: "object"
    });
  });
});
