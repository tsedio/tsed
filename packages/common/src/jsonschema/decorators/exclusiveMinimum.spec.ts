import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {ExclusiveMinimum} from "../../../src/jsonschema";

describe("ExclusiveMinimum", () => {
  describe("without explicit parameter", () => {
    it("should store data", () => {
      class Model {
        @ExclusiveMinimum(0)
        property: number;
      }

      expect(getJsonSchema(Model)).to.deep.eq({
        properties: {
          property: {
            exclusiveMinimum: 0,
            type: "number"
          }
        },
        type: "object"
      });
    });
  });
});
