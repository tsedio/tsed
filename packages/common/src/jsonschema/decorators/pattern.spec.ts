import {JsonEntityStore} from "@tsed/schema";
import {expect} from "chai";
import {Pattern} from "./pattern";

describe("Pattern", () => {
  describe("with string pattern", () => {
    it("should store data", () => {
      // WHEN
      class Model {
        @Pattern(/(a|b)/)
        num: string;
      }

      // THEN
      const classSchema = JsonEntityStore.from(Model);

      expect(classSchema.schema.toJSON()).to.deep.equal({
        properties: {
          num: {
            pattern: "(a|b)",
            type: "string"
          }
        },
        type: "object"
      });
    });
  });
});
