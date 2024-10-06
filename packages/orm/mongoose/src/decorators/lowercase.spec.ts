import {descriptorOf, Store} from "@tsed/core";

import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {Lowercase} from "./lowercase.js";

describe("@Lowercase()", () => {
  it("should set metadata (default)", () => {
    class Test {
      @Lowercase()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      lowercase: true
    });
  });

  it("should set metadata (true)", () => {
    class Test {
      @Lowercase(true)
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      lowercase: true
    });
  });
});
