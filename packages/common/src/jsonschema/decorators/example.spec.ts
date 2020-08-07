import {Example, getJsonSchema} from "@tsed/common";
import {expect} from "chai";

describe("@Example", () => {
  it("should declare description on property", () => {
    // WHEN

    class Model {
      @Example("Examples")
      method: string;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      "definitions": {},
      "properties": {
        "method": {
          "examples": [
            "Examples"
          ],
          "type": "string"
        }
      },
      "type": "object"
    });
  });
  it("should declare description on property (with obj)", () => {
    // WHEN

    class Model {
      @Example({
        default: {id: "id"}
      })
      method: string;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      "definitions": {},
      "properties": {
        "method": {
          "examples": {
            "default": {
              "id": "id"
            }
          },
          "type": "string"
        }
      },
      "type": "object"
    });
  });
  it("should declare description on property (with two params)", () => {
    // WHEN

    class Model {
      @Example("name", "description")
      method: string;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      "definitions": {},
      "properties": {
        "method": {
          "examples": {
            "name": "description"
          },
          "type": "string"
        }
      },
      "type": "object"
    });
  });
});
