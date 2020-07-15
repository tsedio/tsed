import {descriptorOf, Store} from "@tsed/core";
import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Schema} from "mongoose";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../../src/constants";
import {DynamicRef} from "../../src/decorators";

describe("@DynamicRef()", () => {
  it("should set metadata", () => {
    // GIVEN
    class RefTest {}

    Store.from(RefTest).set(MONGOOSE_MODEL_NAME, "RefTest");

    // WHEN
    class Test {
      @DynamicRef("RefTest")
      test: DynamicRef<RefTest>;
    }

    // THEN
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

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));

    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      type: Schema.Types.ObjectId,
      refPath: "RefTest"
    });
  });
});
