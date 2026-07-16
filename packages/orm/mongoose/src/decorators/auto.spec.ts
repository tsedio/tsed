import {Store, descriptorOf} from "@tsed/core";
import {Auto} from "./auto.js";
import {MONGOOSE_SCHEMA} from "../constants/constants.js";

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
