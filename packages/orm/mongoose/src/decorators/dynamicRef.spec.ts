import {descriptorOf, Store} from "@tsed/core";
import {getJsonSchema} from "@tsed/schema";
import {Schema} from "mongoose";

import {DynamicRef} from "../../src/index.js";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../constants/constants.js";

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
    expect(getJsonSchema(Test)).toEqual({
      properties: {
        test: {
          description: "A reference ObjectID",
          examples: ["5ce7ad3028890bd71749d477"],
          oneOf: [
            {
              description: "A reference ObjectID",
              examples: ["5ce7ad3028890bd71749d477"],
              type: "string"
            }
          ]
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
