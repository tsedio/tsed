import {descriptorOf, Store} from "@tsed/core";

import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {Uppercase} from "./uppercase.js";

describe("@Uppercase()", () => {
  it("should set metadata (default)", () => {
    class Test {
      @Uppercase()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      uppercase: true
    });
  });

  it("should set metadata (true)", () => {
    class Test {
      @Uppercase(true)
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      uppercase: true
    });
  });
});
