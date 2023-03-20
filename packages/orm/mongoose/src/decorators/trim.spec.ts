import {descriptorOf, Store} from "@tsed/core";
import {MONGOOSE_SCHEMA} from "../constants/constants";
import {Trim} from "./trim";

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
