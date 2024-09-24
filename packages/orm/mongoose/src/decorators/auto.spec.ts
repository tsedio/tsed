import {descriptorOf, Store} from "@tsed/core";

import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {Auto} from "./auto.js";

describe("@Auto()", () => {
  it("should set metadata (default)", () => {
    class Test {
      @Auto()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      auto: true
    });
  });

  it("should set metadata (true)", () => {
    class Test {
      @Auto(true)
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      auto: true
    });
  });
});
