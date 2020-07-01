import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Default} from "../../../src/jsonschema";

describe("Default", () => {
  describe("value (0)", () => {
    it("should store data", () => {
      class Model {
        @Default(0)
        property: number;
      }

      expect(getJsonSchema(Model)).to.deep.eq({
        properties: {
          property: {
            default: 0,
            type: "number"
          }
        },
        type: "object"
      });
    });
  });
});
