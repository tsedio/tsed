import {Store, descriptorOf} from "@tsed/core";
import {ExcludeIndexes} from "./excludeIndexes.js";
import {MONGOOSE_SCHEMA} from "../constants/constants.js";

describe("@ExcludeIndexes()", () => {
  it("should set metadata (default)", () => {
    class Test {
      @ExcludeIndexes()
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      excludeIndexes: true
    });
  });

  it("should set metadata (true)", () => {
    class Test {
      @ExcludeIndexes(true)
      test: string;
    }

    const store = Store.from(Test, "test", descriptorOf(Test, "test"));
    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      excludeIndexes: true
    });
  });
});
