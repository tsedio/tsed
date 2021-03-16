import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {PropertyMetadata} from "../models/PropertyMetadata";
import {Allow} from "./allow";

describe("Allow", () => {
  describe("when decorator is used as property", () => {
    it("should called with the correct parameters (string)", () => {
      // WHEN
      class Test {
        @Allow(null)
        test: string;
      }

      const metadata = PropertyMetadata.get(Test, "test");

      // THEN
      expect(metadata.allowedRequiredValues).to.deep.eq([null]);
    });

    it("should called with the correct parameters (class)", () => {
      // WHEN
      class Children {}

      class Test {
        @Allow(null)
        test: Children;
      }

      const metadata = PropertyMetadata.get(Test, "test");

      // THEN
      expect(getJsonSchema(Test)).to.deep.eq({
        definitions: {
          Children: {
            type: "object"
          }
        },
        properties: {
          test: {
            oneOf: [
              {
                type: "null"
              },
              {
                $ref: "#/definitions/Children"
              }
            ]
          }
        },
        required: ["test"],
        type: "object"
      });
      expect(metadata.allowedRequiredValues).to.deep.eq([null]);
    });
  });

  describe("when decorator is used in another way", () => {
    it("should called with the correct parameters", () => {
      // WHEN
      let actualError: any;
      try {
        @Allow(null)
        class Test {
          test: string;
        }
      } catch (er) {
        actualError = er;
      }

      expect(actualError.message).to.deep.eq("Allow cannot be used as class decorator on Test");
    });
  });
});
