import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../constants/constants.js";
import {Property, compile, string} from "@tsed/schema";
import {Store, descriptorOf} from "@tsed/core";
import {DynamicRef} from "../../src/index.js";
import {Schema} from "mongoose";

describe("@DynamicRef()", () => {
  it("should set metadata", () => {
    // GIVEN
    class RefTest {
      @Property()
      id: string;
    }

    Store.from(RefTest).set(MONGOOSE_MODEL_NAME, "RefTest");

    // WHEN
    class Test {
      @DynamicRef("RefTest")
      test: DynamicRef<RefTest>;
    }

    // THEN
    expect(compile(Test)).toEqual({
      properties: {
        test: {
          description: "A reference ObjectID",
          examples: ["5ce7ad3028890bd71749d477"],
          type: "string"
        }
      },
      type: "object"
    });

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));

    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      type: Schema.Types.ObjectId,
      refPath: "RefTest"
    });
  });
});
