import {JsonEntityStore} from "@tsed/schema";
import {expect} from "chai";
import {Minimum} from "./minimum";

describe("Minimum", () => {
  describe("when it used without exclusive value", () => {
    it("should store data", () => {
      // WHEN
      class Model {
        @Minimum(0)
        num: number;
      }

      // THEN
      const classSchema = JsonEntityStore.from(Model);

      expect(classSchema.schema.toJSON()).to.deep.equal({
        properties: {
          num: {
            minimum: 0,
            type: "number"
          }
        },
        type: "object"
      });
    });
  });
});
