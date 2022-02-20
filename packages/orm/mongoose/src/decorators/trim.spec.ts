import {descriptorOf, Store} from "@tsed/core";
import {MONGOOSE_SCHEMA, Trim} from "@tsed/mongoose";

describe("@Trim()", () => {
  it("should set metadata", () => {
    class Test {
      @Trim()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      trim: true
    });
  });
});
