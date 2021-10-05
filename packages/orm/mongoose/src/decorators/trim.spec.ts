import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {Trim} from "../../src/decorators";
import {MONGOOSE_SCHEMA} from "../../src/constants";

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
