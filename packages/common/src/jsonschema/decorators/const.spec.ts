import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Const} from "../../../src/jsonschema";

describe("Const", () => {
  describe("when const is a string", () => {
    it("should store data", () => {
      class Model {
        @Const("0")
        property: string;
      }

      expect(getJsonSchema(Model)).to.deep.eq({
        properties: {
          property: {
            const: "0",
            type: "string"
          }
        },
        type: "object"
      });
    });
  });
});
