import {Store} from "@tsed/core";
import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Schema} from "mongoose";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../../src/constants";
import {Ref} from "../../src/decorators";

describe("@Ref()", () => {
  describe("type is a class", () => {
    it("should set metadata", () => {
      class RefTest {}

      Store.from(RefTest).set(MONGOOSE_MODEL_NAME, "RefTest");

      class Test {
        @Ref(RefTest)
        test: Ref<RefTest>;
      }

      const store = Store.from(Test, "test");

      expect(getJsonSchema(Test)).to.deep.eq({
        properties: {
          test: {
            description: "Mongoose Ref ObjectId",
            examples: ["5ce7ad3028890bd71749d477"],
            type: "string"
          }
        },
        type: "object"
      });

      expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
        type: Schema.Types.ObjectId,
        ref: "RefTest"
      });
    });
  });

  describe("type is a string", () => {
    it("should set metadata", () => {
      class RefTest {}

      class Test {
        @Ref("RefTest")
        test: Ref<RefTest>;
      }

      const store = Store.from(Test, "test");

      expect(getJsonSchema(Test)).to.deep.eq({
        properties: {
          test: {
            description: "Mongoose Ref ObjectId",
            examples: ["5ce7ad3028890bd71749d477"],
            type: "string"
          }
        },
        type: "object"
      });
      expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
        type: Schema.Types.ObjectId,
        ref: "RefTest"
      });
    });
  });
});
